# Final Change Log

Documentation of all changes to the BCA Nepal app around the **Course Content** feature and related work.

---

## 1. Committed changes (current HEAD `f4c5c1e`)

These commits were already on the `stillWorking` branch and define the current app behavior.

### 1.1 "Add Course Content section" (`aa04212`)
- Added the `/subjects/course-content` and `/subjects/[semester]/[subject]/course-content` pages.
- Added semester 2 titles/overviews to `src/content/subjects/semester-2/index.ts`:
  - **Discrete Structure** (semester-2, index line 18)
  - **OOP in Java** (line 160)
  - **UX/UI Design** (line 289)
  - Each with 2025 syllabus overview summaries.
- `src/app/api/db/init/route.ts` format CHECK now accepts: `('pdf', 'handwritten', 'solution', 'course')`.

### 1.2 "Optimize course-content page" (`f4c5c1e`)
- `/subjects/course-content` now fetches unit PDFs from the **`notes` DB table** (one query per subject via `supabase.from("notes")`) instead of per-unit `storage.list`.
  - Query: `format IN ('pdf','course')`, grouped by `unit_slug`, rendered under each unit.
  - Units with no PDFs show "PDFs coming soon".
  - Course-level rows (`unit_slug = ''`) are fetched but not rendered (an all-subjects overview was missing — fixed in §2).
- Kept the per-subject page's `fetchCoursePdf` (storage-list of `notes/{sem}/{sub}/`) which surfaces a "Course Syllabus" at the top of each per-subject course-content page.

---

## 2. Uncommitted working-tree changes (this session)

Two files modified (verified via `git diff`, both live on the dev server).

### 2.1 `src/app/subjects/course-content/page.tsx` — "+45/−3"
**Purpose:** restore the missing **"Course PDF" welcome-hero button** and surface the global **sem1→sem4 overview PDF**.

Added:
- `fetchOverviewPdf()` — server-side `storage.list("notes/course-overview")`, finds the first `.pdf`, returns `{ title, href }` from its public URL. Returns `null` (never throws) on error/no file.
- Page now loads overview + semester PDFs in parallel via one `Promise.all`.
- Welcome-hero markup: a **no-icon** `Course PDF` button (`.csb-minimal-btn` style) implemented as a **CSS-only checkbox toggle** (no client JS, no hydration concern):
  - Checkbox `#course-pdf-toggle` (hidden) + `<label>` styled as the button.
  - `.course-overview-panel` hidden until checked; when open it shows the overview PDF `<Link>` to `/view-pdf?url=...&title=...` **or** "PDF coming soon" when `fetchOverviewPdf()` returns null.

### 2.2 `src/app/globals.css` — "+41"
Added (after `.csb-minimal-btn:hover`):
- `.course-pdf-cta` — button wrapper spacing.
- `.course-pdf-toggle` — hides the native checkbox.
- `.course-pdf-toggle:checked + .csb-minimal-btn::after` — appends "hide" to the label when open.
- `.course-pdf-toggle:checked ~ .course-overview-panel` — reveals the panel.
- `.course-overview-panel` — card styling (border, radius, bg) + `html.dark` variant.
- `.course-overview-coming` — muted italic "PDF coming soon" text.

---

## 3. Related prior changes (already committed, part of HEAD)

- **`/upload` page** (`src/app/upload/page.tsx`) — "Course PDF" **Note Type** radio option (added earlier chain, present at HEAD):
  - Uploads to `notes/{semester}/{subject}/` (subject root, unit not required).
  - Sends `format: "course"` to `/api/storage/upload`.
- **`/api/storage/upload`** — derives `unit_slug` from `folder.split("/")[2]`; uploads to subject root yield `unit_slug = ''` with `format='course'`.
- **`/api/db/init`** — table DDL includes the extended `format` CHECK (see §1.1).

---

## 4. Data / upload guide

| What | Where it lives | How to upload |
|---|---|---|
| Global overview (sem1–4) | `notes` bucket → folder `course-overview/` (e.g. `notes/course-overview/BCA Updated Syllabus.pdf`) | **Supabase Dashboard → Storage → `notes` bucket** — create `course-overview/` folder and drop the PDF. The welcome-hero "Course PDF" button reads this folder directly. |
| Per-subject Course PDF | `notes/{semester}/{subject}/` with `format='course'` | `/upload` page → Note Type = **Course PDF** (or upload to the subject root folder). |
| Unit PDFs | `notes/{semester}/{subject}/{unit}/` with `format='pdf'` | `/upload` → Note Type = **PDF Notes**. |

**Verified live** on `http://192.168.1.25:3000/subjects/course-content` (HTTP 200) — the panel currently resolves the overview to `course-overview/BCA Updated Syllabus.pdf` and renders the link in the viewer.

---

## 5. Known dev-only error (not a bug)

```
[browser] Uncaught TypeError: Failed to execute 'measure' on 'Performance':
'NotFound' cannot have a negative time stamp.
```
- **Source:** not app code — no `performance.measure` exists in `src/`, `public/sw.js`, or `node_modules/next`. Caused by a browser DevTools/performance extension calling `performance.measure('NotFound', <missing mark>)`.
- **Production impact:** none. Console noise only; does not appear in production builds or on user devices.
- **Remedy (dev only):** disable the extension / hard refresh.

---

## 6. File summary

| File | Change |
|---|---|
| `src/app/subjects/course-content/page.tsx` | Rewritten (HEAD) to DB-table PDF fetch **+** re-added `fetchOverviewPdf` & "Course PDF" welcome-hero toggle (working tree) |
| `src/app/globals.css` | Added `course-pdf-*` toggle/panel styles (working tree) |
| `src/app/upload/page.tsx` | "Course PDF" Note Type option (HEAD) |
| `src/app/api/db/init/route.ts` | `format` CHECK incl. `solution`, `course` (HEAD) |
| `src/content/subjects/semester-2/index.ts` | Titles (Discrete Structure, OOP in Java, UX/UI Design) + 2025 overviews (HEAD) |
| `src/app/subjects/[semester]/[subject]/course-content/page.tsx` | Per-subject course-content page with `fetchCoursePdf` syllabus section (HEAD) |

> Note: working-tree changes in §2 are uncommitted. Commit them (e.g. `git add src/app/subjects/course-content/page.tsx src/app/globals.css && git commit`) when ready.