#!/usr/bin/env node
/*
 * check-core: verify the GENERIC files in this app are byte-identical to the
 * baseline recorded in sync.json (the shared brand/engine template).
 *
 * Usage:
 *   node scripts/check-core.mjs          # check (exit 1 on drift)
 *   node scripts/check-core.mjs --update # record current files as the new baseline
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = join(ROOT, "sync.json");
const UPDATE = process.argv.includes("--update");

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));

function hashFile(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

let ok = true;
let changed = 0;
let missing = 0;

for (const entry of manifest.files) {
  const abs = join(ROOT, entry.path);
  let status;
  let currentHash = null;

  try {
    currentHash = hashFile(abs);
  } catch {
    missing += 1;
    ok = false;
    status = "MISSING";
  }

  if (currentHash) {
    if (currentHash === entry.sha256) {
      status = "ok";
    } else {
      changed += 1;
      ok = false;
      status = "CHANGED";
      if (UPDATE) entry.sha256 = currentHash;
    }
  }

  console.log(`${status === "ok" ? "  ok" : "! " + status.padEnd(7)}  ${entry.path}`);
}

if (UPDATE) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nsync.json updated (${manifest.files.length} files).`);
} else {
  const total = manifest.files.length;
  console.log(`\n${total - changed - missing}/${total} generic files match the baseline.`);
  if (missing) console.log(`  ${missing} missing`);
  if (changed) console.log(`  ${changed} changed`);
  console.log(ok
    ? "No drift. Generic files are byte-identical to the template."
    : "DRIFT DETECTED. Merge the template (git merge upstream) before deploying, or run --update only if this app is now the new template.");
}

process.exit(ok ? 0 : 1);
