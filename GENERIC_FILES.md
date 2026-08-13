# CSIT × BCA — Consistency Contract

This document is the single source of truth for keeping `csitnepal.vercel.app`
visually and functionally identical to `bcanepal.vercel.app` while both
codebases stay fully isolated (separate repos, separate Vercel builds, separate
user bases).

The core idea: **separate code, one source of truth for appearance and engine.**

Every file in this repo belongs to exactly one of four categories (A–D).
The boundary is enforced by `sync.json` + `scripts/check-core.mjs` (category A)
and by review discipline (categories B–D).

---

## Category A — BYTE-IDENTICAL (tracked automatically)

These files must be **exactly the same bytes** in both apps. They carry no
brand, no course content, no environment values. Tracked by:

```sh
npm run check:core          # fail the build/CI if any file drifted
node scripts/check-core.mjs --update   # only when this app becomes the new template
```

### Visual identity
| File | Why |
|---|---|
| `src/app/globals.css` (~4,400 lines) | THE layout: all tokens, classes, breakpoints, dark mode. Nothing else matters as much. |

### Core engine (`src/lib/`)
`supabase.ts`, `pdf-access.ts` (signed URLs), `storage.ts`, `storage-url.ts`,
`db.ts` (IndexedDB/offline), `progress.ts`, `admin-auth.ts`, `utils.ts`,
`database.types.ts`

### API routes (`src/app/api/**`)
`auth/login`, `auth/logout`, `db/init`, `entrance/pdfs`, `entrance/questions`,
`lectures`, `notes`, `notes/[id]`, `pdf/signed-url`, `storage/delete`,
`storage/init`, `storage/list`, `storage/sync`, `storage/upload`,
`subject-questions`, `youtube/pubsub`, `youtube/subscribe`

### PDF viewer (`src/app/view-pdf/`)
`page.tsx`, `pdf-viewer.tsx`, `pdf-viewer-loader.tsx`, `back-nav-button.tsx`

### Generic components (`src/components/`)
`ad-banner`, `back-nav`, `code-block`, `completion-toggle`, `content-body`,
`course-content-card`, `course-structure-button`, `dashboard-card`,
`entrance-card`, `entrance-mock-test`, `katex-renderer`, `lecture-grid`,
`notes-tree`, `offline-banner`, `offline-error`, `pdf-error-boundary`,
`prism-init`, `progress-dashboard`, `related-lectures`, `route-progress`,
`semester-scroller`, `site-nav`, `subject-quiz`, `theme-provider`,
`theme-toggle`, `ui-utils`, `unit-content-tabs`, `video-notes`

### Root config
`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`,
`vercel.json`, `netlify.toml`, `instrumentation.ts`, `sentry.*.config.ts`,
`.env.example`

---

## Category B — TEMPLATED (same structure, app values only)

Same file, same code flow — only brand/course values change. When the template
repo updates these, merge and re-apply your values. Keep brand strings in as
few, obvious places as possible so merges don't conflict.

| File | What changes per app |
|---|---|
| `src/app/layout.tsx` | metadata (title/description/keywords), GTM/GA4 IDs, AdSense client, `apple-mobile-web-app-title` |
| `src/components/json-ld.tsx` | site name, URL, description, FAQ answers |
| `src/components/app-header.tsx` | logo, `<h1>` brand, YouTube channel link |
| `src/components/welcome-hero.tsx` | brand copy |
| `src/components/service-worker-register.tsx` | "Install BCA Nepal" strings |
| `src/components/notification-panel.tsx` | welcome message copy |
| `src/components/image-gallery.tsx` | "BCA Nepal" strings in install/share steps |
| `src/components/course-pdf-viewer.tsx` | `cp.code.replace("BCA ", "")` → course code prefix |
| `src/app/view-pdf/layout.tsx` | description ("BCA study material…") |
| `src/app/page.tsx` | JSON-LD copy, YouTube banner copy |
| `public/manifest.json` | name, short_name, description |
| `public/sw.js` | cache names (`bca-nepal-v15` → `csitnepal-v1`), notification fallback title |
| `public/offline.html` | title |
| `public/robots.ts`, `public/sitemap.ts` | domain only |
| `package.json` | name/description; **dependencies must stay in lockstep** |
| `.env` (untracked) | see env table below |
| Icons/logo (`public/icons/*.png`, `favicon.png`, `apple-touch-icon.png`, `logo.jpg`, `qr_*.png`) | regenerate per brand; keep the same icon set sizes (48–512) |

---

## Category C — APP-SPECIFIC (must differ, never synced)

| Path | Notes |
|---|---|
| `src/content/**` | Curriculum: `subjects/` (8 CSIT semesters vs 2), `lectures.ts`, `notes.ts`, `entrance/` |
| `src/app/notes/**`, `src/app/subjects/**`, `src/app/quiz/**`, `src/app/lectures/**`, `src/app/questions/**`, `src/app/mock-test/**`, `src/app/watch/**` | Content-driven pages — *structure* is maintained by re-merging the template; content inside is yours |
| `public/images/ui-ux/**` | lesson image assets |
| Supabase: buckets (`notes`/`lectures`/`entrance` → e.g. `csit_notes`), DB tables, RLS | migrate `supabase/migrations/` per app, changing bucket/table names only |
| Analytics/ads accounts | GA4, GTM, AdSense IDs per app |

---

## Category D — ALIGNED (match shape, not bytes)

- `package.json` → same dependency versions (react-pdf, supabase-js, next…).
- `supabase/migrations/*.sql` → same policies, renamed objects.
- Naming conventions → identical file/class/route naming so diffs against the
  template stay readable.

---

## Environment variables (per app)

| Var | Notes |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | the app's own domain (`https://csitnepal.vercel.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | per-app project |
| `SUPABASE_SERVICE_ROLE_KEY` | per-app project |
| `ADMIN_KEY` | per-app |
| `PUBSUB_CALLBACK_URL` | per-app |
| GTM/GA4/AdSense IDs | per-app |

---

## Workflow rules

1. **Fix/improve a Category A file?** Commit to the **template repo** (e.g.
   bcanepal-app), then `git merge upstream/main` in csitnepal-app. Never edit
   A-files independently in CSIT — the hash check will (correctly) fail.
2. **Change a Category B file?** Same: template first, merge, then re-apply the
   app's values if the merge touched them.
3. **Before every CSIT deploy:** run `npm run check:core`. Red = stop and merge
   the template. This is the drift alarm.
4. **Never** add brand strings to a Category A file. If a generic component
   needs a label, feed it as a prop from a Category C page.
5. When CSIT is live, its repo becomes the second template source: fixes must be
   ported to BOTH (or one app becomes canonical — pick one and stick to it).

---

## Bootstrap checklist for CSIT (do once)

1. Clone bcanepal-app → new private repo `csitnepal-app` (keep full git history).
2. Keep every Category A file untouched — run `npm run check:core` and see green.
3. Apply Category B values (find `BCA` / `bcanepal` → 40ish spots listed above).
4. Replace `src/content/**` with CSIT curriculum; rebuild content-driven pages
   against the new data (structure copied from BCA).
5. Create CSIT Supabase project; copy migrations with renamed buckets/tables;
   set `.env`.
6. Deploy as its own Vercel project (`csitnepal` slug) → `csitnepal.vercel.app`.
7. Add a CI job running `npm run check:core` in both repos.
