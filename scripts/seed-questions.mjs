#!/usr/bin/env node
/**
 * Seed the subject quiz from PDFs already in Supabase Storage (notes bucket).
 *
 * Pipeline per PDF:  storage -> pdfjs text extract -> (optional OCR) -> LLM MCQs -> insert into subject_questions
 *
 * Usage:
 *   node scripts/seed-questions.mjs                                  # everything
 *   node scripts/seed-questions.mjs --semester=semester-2 --subject=oop-in-java --limit=5
 *   node scripts/seed-questions.mjs --subject=math --dry-run
 *   node scripts/seed-questions.mjs --subject=oop-in-java --force      # re-run done files
 *
 * Required env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY
 * Optional env: OPENAI_MODEL, OPENAI_BASE_URL, OCR_SPACE_API_KEY
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, ".seed-state.json");

const cfg = {
  baseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  openaiKey: process.env.OPENAI_API_KEY,
  openaiBase: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  ocrKey: process.env.OCR_SPACE_API_KEY || null,
  isGemini:
    (process.env.OPENAI_BASE_URL || "").includes("generativelanguage.googleapis.com") ||
    (process.env.LLM_PROVIDER || "").toLowerCase() === "gemini",
};

function log(msg) {
  console.log(`[seed] ${msg}`);
}
function warn(msg) {
  console.warn(`[seed][warn] ${msg}`);
}
function fail(msg) {
  console.error(`\n[x] ${msg}`);
  process.exit(1);
}

// ---- args ----
const arg = process.argv.reduce((acc, a) => {
  if (a.startsWith("--")) {
    const no = a.slice(2);
    const i = no.indexOf("=");
    acc[i >= 0 ? no.slice(0, i) : no] = i >= 0 ? no.slice(i + 1) : true;
  }
  return acc;
}, {});
const semester = arg.semester || null;
const subject = arg.subject || null;
const limit = Number(arg.limit) || Infinity;
const dryRun = Boolean(arg["dry-run"]);
const force = Boolean(arg.force);
const qPerDoc = Number(arg["questions-per-doc"]) || 10;

// ---------------------------------------------------------------------------
// State (resumable)
// ---------------------------------------------------------------------------
const state = fs.existsSync(STATE_FILE)
  ? JSON.parse(fs.readFileSync(STATE_FILE, "utf8"))
  : { done: [], scanned: [] };
const saveState = () => fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

// ---------------------------------------------------------------------------
// Validators
// ---------------------------------------------------------------------------
if (!cfg.baseUrl) fail("NEXT_PUBLIC_SUPABASE_URL is required");
if (!cfg.serviceKey) fail("SUPABASE_SERVICE_ROLE_KEY is required");
if (!cfg.openaiKey) fail("OPENAI_API_KEY is required");

const supabase = createClient(cfg.baseUrl, cfg.serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ---------------------------------------------------------------------------
// Walk bucket: notes/{semester}/{subject}/{unit}/file.pdf
// ---------------------------------------------------------------------------
async function listDir(dirPath) {
  const { data, error } = await supabase.storage.from("notes").list(dirPath);
  if (error) throw new Error(`list "${dirPath || "(root)"}" failed: ${error.message}`);
  const folders = [];
  const files = [];
  for (const item of data) {
    if (item.name === ".emptyFolderPlaceholder" || item.name === "placeholder.txt") continue;
    if (item.metadata === null) folders.push(item.name);
    else files.push(item.name);
  }
  return { folders, files };
}

async function walk(dirPath, depth, out) {
  const { folders, files } = await listDir(dirPath);
  for (const f of files) {
    if (/\.pdf$/i.test(f)) out.push(dirPath ? `${dirPath}/${f}` : f);
  }
  if (depth < 3) {
    for (const folder of folders) {
      await walk(dirPath ? `${dirPath}/${folder}` : folder, depth + 1, out);
    }
  }
}

// ---------------------------------------------------------------------------
// Text extraction + OCR fallback
// ---------------------------------------------------------------------------
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
  import.meta.url,
).href;

async function extractTextFromPdf(bytes) {
  const doc = await pdfjs.getDocument({ data: bytes }).promise;
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it) => (typeof it.str === "string" ? it.str : "")).join(" ") + "\n";
  }
  await doc.destroy();
  return text;
}

async function ocrPdf(bytes) {
  if (!cfg.ocrKey) return null;
  const base64 = Buffer.from(bytes).toString("base64");
  const body = new FormData();
  body.append("base64Image", `data:application/pdf;base64,${base64}`);
  body.append("language", "eng");
  body.append("apikey", cfg.ocrKey);
  body.append("OCREngine", "2");
  const res = await fetch("https://api.ocr.space/parse/image", { method: "POST", body });
  const json = await res.json();
  if (!json.ParsedResults || !json.ParsedResults.length) return null;
  return json.ParsedResults.map((r) => r.ParsedText || "").join("\n");
}

// ---------------------------------------------------------------------------
// LLM -> MCQs
// ---------------------------------------------------------------------------
async function callLLM(messages) {
  // Gemini native REST endpoint (works with free-tier API keys)
  if (cfg.isGemini) {
    const url = `${cfg.openaiBase}/models/${cfg.openaiModel}:generateContent`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": cfg.openaiKey,
      },
      body: JSON.stringify({
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature: 0.7 },
      }),
    });
    if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  }

  // OpenAI-compatible endpoint
  const res = await fetch(`${cfg.openaiBase}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.openaiKey}`,
    },
    body: JSON.stringify({
      model: cfg.openaiModel,
      temperature: 0.7,
      messages,
    }),
  });

  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function generateQuestions(text) {
  const prompt = `You are generating BCA (Nepal) quiz questions from study notes. Produce up to ${qPerDoc} multiple choice questions derived ONLY from the actual content below.

Return STRICT JSON only (no prose, no markdown fences), exactly:
{"questions":[{"question":"...","options":["A","B","C","D"],"correct_answer":"<exactly one of options>","explanation":"..."}]}

Notes text:
"""${text.slice(0, 20000)}"""`;

  const content = await callLLM([{ role: "user", content: prompt }]);
  const json = content.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  return JSON.parse(json);
}

function toUnitParts(filePath) {
  const p = filePath.split("/");
  return { semester: p[0], subject: p[1], unitSlug: p[2] };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
log(`semester=${semester ?? "all"} subject=${subject ?? "all"} dryRun=${dryRun} limit=${limit}`);
log("Walking Supabase storage notes bucket...");

const allFiles = [];
await walk("", 0, allFiles);
log(`found ${allFiles.length} PDF(s)`);

let processed = 0;
const inserted = { count: 0 };
const scannedFiles = [];

for (const filePath of allFiles) {
  const { semester: sem, subject: sub, unitSlug } = toUnitParts(filePath);
  if (semester && semester !== sem) continue;
  if (subject && subject !== sub) continue;

  if (state.done.includes(filePath) && !force) {
    log(`skip (already done): ${filePath}`);
    continue;
  }
  if (limit !== Infinity && processed >= limit) break;
  processed++;

  log(`\n[${processed}] ${filePath}`);

  let bytes;
  try {
    const { data, error } = await supabase.storage.from("notes").download(filePath);
    if (error || !data) { warn(`download failed: ${error?.message}`); continue; }
    bytes = await data.arrayBuffer();
  } catch (e) {
    warn(`download error: ${e.message}`);
    continue;
  }

  let text = "";
  try {
    text = await extractTextFromPdf(bytes);
  } catch (e) {
    warn(`pdf parse failed: ${e.message}`);
    continue;
  }

  if (!text || text.trim().length < 20) {
    const ocrText = await ocrPdf(bytes);
    if (ocrText && ocrText.trim().length > 20) {
      text = ocrText;
      warn("used OCR fallback");
    } else {
      scannedFiles.push(filePath);
      warn(`no usable text (scanned). Skipped — needs OCR.`);
      continue;
    }
  }

  let mcqs;
  try {
    mcqs = await generateQuestions(text);
  } catch (e) {
    warn(`LLM generate failed: ${e.message}`);
    continue;
  }

  if (!Array.isArray(mcqs.questions) || mcqs.questions.length === 0) {
    warn("no questions generated");
    continue;
  }

  const rows = mcqs.questions.map((q) => ({
    semester_key: sem,
    subject_slug: sub,
    unit_slug: unitSlug,
    question: q.question,
    options: Array.isArray(q.options) && q.options.length ? q.options : ["A"],
    correct_answer: q.correct_answer,
    ...(q.explanation ? { explanation: q.explanation } : {}),
  }));

  if (dryRun) {
    log(`[dry-run] would insert ${rows.length} for ${filePath}`);
  } else {
    try {
      const { error } = await supabase.from("subject_questions").insert(rows);
      if (error) warn(`insert error: ${error.message}`);
      else {
        inserted.count += rows.length;
        log(`inserted ${rows.length} questions`);
      }
    } catch (e) {
      warn(`insert error: ${e.message}`);
    }
    if (!force) {
      state.done.push(filePath);
      saveState();
    }
  }

  await new Promise((r) => setTimeout(r, 300));
}

console.log("\n======== SUMMARY ========");
console.log(`processed : ${processed}`);
console.log(`inserted  : ${dryRun ? "n/a (dry-run)" : inserted.count}`);
if (scannedFiles.length) {
  console.log(`scanned/skipped (needs OCR): ${scannedFiles.length}`);
  scannedFiles.forEach((f) => console.log("  - " + f));
}