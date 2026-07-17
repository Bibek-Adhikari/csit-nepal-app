# 🏗 BCA Nepal App — Complete Architecture Guide

> **A PWA-first, mobile-optimized educational study hub for BCA students at Tribhuvan University, Nepal.**
> Built with Next.js 16 + React 19 + Supabase + Tailwind CSS 4.

---

## 📋 Table of Contents

1. [Tech Stack & UI Framework](#1-tech-stack--ui-framework)
2. [Complete Directory Map](#2-complete-directory-map)
3. [Data Flow & Cold Loading](#3-data-flow--cold-loading)
4. [API Routes Deep Dive](#4-api-routes-deep-dive)
5. [Auth System](#5-auth-system)
6. [PDF Handling — End to End](#6-pdf-handling--end-to-end)
7. [Lecture System — End to End](#7-lecture-system--end-to-end)
8. [Entrance Preparation System](#8-entrance-preparation-system)
9. [Lab Reports System](#9-lab-reports-system)
10. [Linking Between Nodes](#10-linking-between-nodes)
11. [Profile Page In-Depth](#11-profile-page-in-depth)
12. [Admin Panel In-Depth](#12-admin-panel-in-depth)
13. [Notification & Progress Systems](#13-notification--progress-systems)
14. [Database & Storage Schema](#14-database--storage-schema)
15. [PWA & Offline Architecture](#15-pwa--offline-architecture)
16. [Environment Variables](#16-environment-variables)

---

## 1. Tech Stack & UI Framework

### 🧰 Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16.2.9 (App Router) | SSR, SSG, API routes, file-based routing |
| **UI Library** | React 19.2.4 + React DOM 19.2.4 | Component rendering |
| **Language** | TypeScript 5.x | Type safety across all code |
| **Styling** | **Tailwind CSS 4** + Custom CSS (`globals.css`) | All UI styling |
| **Icons** | **Boxicons** (CDN) + Lucide React (1 component only) | Primary icon set site-wide |
| **Database** | Supabase (PostgreSQL) via `@supabase/supabase-js` 2.x | Note metadata storage |
| **Storage** | Supabase Storage (buckets: `notes`, `lectures`) | PDF file hosting |
| **Auth** | Shared secret (`ADMIN_KEY` env) + HttpOnly cookie | Admin authentication |
| **PDF** | `react-pdf` 10.x + `pdfjs-dist` (CDN worker) | PDF rendering |
| **Offline** | IndexedDB (custom `lib/db.ts`) + Service Worker | Offline PDFs, bookmarks |
| **Theming** | `next-themes` (class strategy) | Dark/light mode |
| **Error** | `react-error-boundary` | PDF viewer error boundary |
| **Analytics** | Google Tag Manager (GTM-TDJL2X9D) + GA4 (G-3MLZFJ1XP5) | Usage tracking |
| **Error Tracking** | Sentry (`@sentry/nextjs` 10.x) | Error monitoring |
| **Hosting** | Netlify (`@netlify/plugin-nextjs`) or Vercel | Deployment |
| **Font** | Geist (`next/font/google`) | Typography |

### 🎨 UI Framework — Tailwind Only, No shadcn

```
❌ No shadcn/ui
❌ No Radix UI
❌ No Material UI
❌ No Chakra
❌ No component library of any kind

✅ Custom CSS variables in :root (3560+ lines in globals.css)
✅ Tailwind CSS 4 (utility classes used sparingly)
✅ cn() utility (clsx + tailwind-merge) — used in ~3 files
✅ Boxicons CDN — primary icon set (bx-*, bxs-*, bxl-*)
✅ Lucide React — only in theme-toggle.tsx (moon/sun icons)
```

#### Theme System

```
:root                → Light mode CSS variables (--bg-app, --text, --accent, etc.)
html.dark            → Dark mode overrides (same variable names, darker values)
next-themes          → class strategy (toggles <html class="dark">)
ThemeProvider        → wraps root layout
ThemeToggle          → Sun/Moon button in AppHeader
```

#### Custom CSS Architecture (globals.css @ 3560 lines)

| Section | Lines | Classes |
|---|---|---|
| Tailwind import + theme tokens | 1-20 | `@theme inline { --color-* }` |
| CSS variables (`:root` + `html.dark`) | 21-130 | `--bg-app`, `--accent`, `--border`, etc. |
| Base resets + app shell | 131-250 | `.app-shell`, `.app-main`, `.offline-banner` |
| Home page | 251-380 | `.home-*`, `.hero-*`, `.subject-stack` |
| Subject pages | 381-500 | `.subject-page`, `.subject-card` |
| Unit notes page | 501-750 | `.unit-page`, `.unit-note-card`, `.badge-*` |
| Lecture page | 751-1050 | `.lecture-page`, `.lecture-card`, `.lecture-grid` |
| Watch page | 1051-1200 | `.watch-page`, `.player-wrapper` |
| Profile page | 1201-1400 | `.profile-*`, `.metric-card` |
| Admin panel | 1401-2100 | `.admin-*`, `.admin-login-*`, `.admin-note-card` |
| Upload page | 2101-2500 | `.upload-*`, `.upload-card` |
| Bookmark page | 2501-2700 | `.bookmark-*` |
| PDF viewer | 2701-2900 | `.pdf-viewer`, `.pdf-toolbar` |
| Notes tree | 2901-3100 | `.notes-tree-*` |
| Site nav (bottom tab bar) | 3101-3300 | `.site-nav`, `.nav-link`, `.nav-link.active` |
| Toast notifications | 3301-3380 | `.toast`, `.toast--offline`, `.toast--online` |
| PWA install steps | 3381-3420 | `.pwa-steps`, `.pwa-step`, `.pwa-step-num` |
| Share QR code | 3421-3440 | `.share-qr-wrap` |
| Legal content | 3441-3460 | `.legal-content` |
| Route progress bar | 3461-3480 | `.route-progress` |
| Bottom sheet (notifications) | 3481-3540 | `.bottom-sheet`, `.sheet-handle`, `.sheet-header` |
| Reduced motion | 3541-3560 | `@media (prefers-reduced-motion: reduce)` |

---

## 2. Complete Directory Map

### 🔗 Full File Tree with Connections

```
src/
├── app/  ◄── Next.js App Router (pages + API)
│   │
│   ├── layout.tsx  ◄── ROOT LAYOUT (server component)
│   │   ├── ThemeProvider (next-themes)
│   │   ├── AppHeader (logo, YouTube badge, theme toggle)
│   │   ├── OfflineBanner (detects navigator.onLine)
│   │   ├── SiteNav (bottom tab bar: Home, Subjects, Lectures, Bookmarks, Profile)
│   │   ├── ServiceWorkerRegister (SW registration, update toast, push)
│   │   ├── GTM Script (beforeInteractive)
│   │   ├── GA4 Script (beforeInteractive)
│   │   └── JSON-LD (WebSite structured data)
│   │
│   ├── page.tsx  ◄── HOME PAGE (client)
│   │   ├── WelcomeHero (stats: X semesters, Y subjects, Z units, W lectures)
│   │   ├── SemesterScroller (pill buttons for each semester)
│   │   └── Subject cards (static from content/subjects)
│   │   └── Links to: /subjects/[semester], /lectures, /watch/[videoId]
│   │
│   ├── subjects/
│   │   ├── page.tsx  ◄── ALL SEMESTERS (server, SSG)
│   │   │   └── Links to: /subjects/[semester], /subjects/entrance
│   │   │
│   │   ├── [semester]/page.tsx  ◄── SEMESTER DETAIL (server, SSG, generateStaticParams)
│   │   │   └── Links to: /subjects/[semester]/[subject]
│   │   │
│   │   ├── [semester]/[subject]/page.tsx  ◄── SUBJECT DETAIL (server, SSG)
│   │   │   └── Links to: /notes/[semester]/[subject]/[unit], /notes/[semester]/[subject]/lab-reports
│   │   │
│   │   └── entrance/page.tsx  ◄── ENTRANCE PREP HUB (client)
│   │       └── Links to: /questions, /mock-test
│   │
│   ├── notes/
│   │   ├── page.tsx  ◄── REDIRECT → /bookmark
│   │   │
│   │   ├── [semester]/[subject]/page.tsx  ◄── (redirects to unit list)
│   │   │
│   │   ├── [semester]/[subject]/[unit]/page.tsx  ◄── UNIT NOTES (server, force-dynamic)
│   │   │   ├── FETCHES: content/subjects (static unit data)
│   │   │   ├── FETCHES: Supabase DB (notes table, filtered by semester+subject+unit)
│   │   │   ├── FETCHES: Supabase Storage (list files in bucket path)
│   │   │   ├── MERGES: static notes + DB records + storage files
│   │   │   ├── CompletionToggle (localStorage)
│   │   │   └── RelatedLectures (fetches /api/lectures, filters by semester)
│   │   │
│   │   └── [semester]/[subject]/lab-reports/page.tsx  ◄── LAB REPORTS (server, force-dynamic)
│   │       ├── FETCHES: Supabase DB (notes table, unit_slug="lab-reports")
│   │       ├── FETCHES: Supabase Storage (list {sem}/{sub}/lab-reports/)
│   │       ├── MERGES: DB records + storage files
│   │       └── Renders: PDF links to /view-pdf
│   │
│   ├── questions/page.tsx  ◄── ENTRANCE QUESTIONS (client)
│   │   ├── FETCHES: /api/entrance/pdfs (entrance study materials)
│   │   └── Renders: PDF cards with view/download
│   │
│   ├── mock-test/
│   │   ├── page.tsx  ◄── MOCK TEST CONFIG (client)
│   │   │   └── Selects: subject (english/math/gk/all), question count (10/20/30)
│   │   │
│   │   └── [subject]/page.tsx  ◄── MOCK TEST QUIZ ENGINE (client, 535 lines)
│   │       ├── FETCHES: /api/entrance/questions (Supabase API)
│   │       ├── FALLBACK: local questionBank.ts (offline-first)
│   │       ├── Timer, question navigation dots, submit
│   │       ├── Results: grade, topic breakdown, answer review with explanations
│   │       └── Shuffle: randomized question order per attempt
│   │
│   ├── lectures/page.tsx  ◄── LECTURES GRID (server shell + client component)
│   │   ├── LectureGrid (client component)
│   │   │   ├── FETCHES: /api/lectures (YouTube API proxy)
│   │   │   ├── FETCHES: /api/notes (linked note PDFs)
│   │   │   └── Renders: searchable, filterable lecture cards with linked notes
│   │   └── Links to: /watch/[videoId], /view-pdf?url=...
│   │
│   ├── watch/[videoId]/
│   │   ├── layout.tsx  ◄── DYNAMIC METADATA (server, reads lectureVideos[])
│   │   │   └── Generates: title, description, open graph from static data
│   │   │
│   │   └── page.tsx  ◄── VIDEO PLAYER (client)
│   │       ├── YouTube IFrame API (YT.Player)
│   │       ├── VideoNotes component (fetches /api/notes by video_id)
│   │       ├── JSON-LD VideoObject structured data
│   │       └── Links to: /view-pdf?url=... (for each note)
│   │
│   ├── view-pdf/
│   │   ├── layout.tsx  ◄── force-dynamic, metadata
│   │   ├── page.tsx  ◄── PDF VIEWER ENTRY (client, dynamic import)
│   │   │   └── Reads query params: url, title, semester, subject, unit
│   │   └── pdf-viewer.tsx  ◄── CORE PDF COMPONENT (client, 256 lines)
│   │       ├── react-pdf (Document + Page components)
│   │       ├── IntersectionObserver lazy page loading
│   │       ├── Download progress bar (streaming ReadableStream)
│   │       ├── IndexedDB save on download complete
│   │       ├── Bookmark toggle (IndexedDB)
│   │       ├── Anti-copy: right-click disabled, user-select: none
│   │       └── Offline render: blob URL from IndexedDB
│   │
│   ├── bookmark/page.tsx  ◄── BOOKMARKS (client, 135 lines)
│   │   ├── Reads: IndexedDB (getBookmarkedPDFs)
│   │   ├── Groups by: semester → subject
│   │   ├── Shows: thumbnail icon, title, semester, subject, unit
│   │   ├── Actions: remove bookmark, delete offline copy
│   │   └── Links to: /view-pdf?url=... (using stored PDF id)
│   │
│   ├── profile/page.tsx  ◄── PROFILE (client)
│   │   ├── ProgressDashboard (reads localStorage completed units)
│   │   ├── Study Metrics grid (semesters, total units, completed, bookmarks)
│   │   ├── Community links (Facebook, WhatsApp)
│   │   ├── Install App (PWA) instructions (Android + iOS)
│   │   ├── Share (QR code image)
│   │   ├── Admin links (/admin, /upload)
│   │   └── Legal links (Privacy Policy, Terms)
│   │
│   ├── admin/page.tsx  ◄── ADMIN PANEL (client, 481 lines)
│   │   ├── Auth gate (password → POST /api/auth/login)
│   │   ├── Dashboard: list all notes with filters
│   │   ├── Sync button (POST /api/storage/sync)
│   │   ├── Link video panel (thumbnail grid selector)
│   │   └── Links to: /upload, /view-pdf
│   │
│   ├── upload/page.tsx  ◄── UPLOAD FORM (client, 645 lines)
│   │   ├── Auth gate (same as admin)
│   │   ├── Target: notes bucket or lectures bucket
│   │   ├── Subject notes: select semester → subject → unit
│   │   ├── Lecture notes: select lecture video from merged list
│   │   ├── File picker (PDF only)
│   │   ├── Upload: POST /api/storage/upload → PUT signed URL
│   │   ├── Sync button (POST /api/storage/sync for lectures)
│   │   └── YouTube PubSubHubbub subscribe/unsubscribe
│   │
│   ├── privacy-policy/  ◄── STATIC LEGAL
│   ├── terms-and-conditions/  ◄── STATIC LEGAL
│   ├── offline/page.tsx  ◄── REDIRECT → /bookmark
│   ├── not-found.tsx  ◄── 404 page
│   ├── sitemap.ts  ◄── Dynamic sitemap (covers all static routes)
│   ├── robots.ts  ◄── Dynamic robots.txt
│   └── globals.css  ◄── 3560 lines of app styles
│
├── components/  ◄── SHARED UI COMPONENTS
│   ├── app-header.tsx  ◄── TOP HEADER
│   │   ├── Logo image (logo.jpg) + "BCA Nepal" title
│   │   ├── Notification bell icon (opens NotificationPanel)
│   │   └── ThemeToggle (moon/sun)
│   │
│   ├── site-nav.tsx  ◄── BOTTOM TAB BAR (smart navigation)
│   │   ├── 5 tabs: Home, Subjects, Lectures, Bookmarks, Profile
│   │   ├── Icons: bx-home-alt, bx-layer, bx-video, bx-bookmark, bx-user
│   │   ├── Active route detection (usePathname)
│   │   ├── Smart back-navigation (remembers last subjects path)
│   │   ├── Default semester preference (jumps to selected semester)
│   │   └── Dimmed state on /view-pdf page
│   │
│   ├── back-nav.tsx  ◄── BREADCRUMB (Link + chevron + label)
│   │
│   ├── notification-panel.tsx  ◄── BOTTOM SHEET NOTIFICATIONS (client, 242 lines)
│   │   ├── Welcome notification (shown once, localStorage tracked)
│   │   ├── Latest video notification (fetches /api/lectures)
│   │   ├── Default "Notes Updated" notification
│   │   └── Bottom sheet UI with backdrop, drag/touch handling
│   │
│   ├── route-progress.tsx  ◄── ROUTE TRANSITION BAR (client)
│   │   ├── Shows animated progress bar at top during navigation
│   │   ├── Uses usePathname to detect route changes
│   │   └── Animates: 30% → 65% → 85% → 100% → hide
│   │
│   ├── lecture-grid.tsx  ◄── LECTURE BROWSER (client, 231 lines)
│   │   ├── FETCHES: /api/lectures (YouTube API)
│   │   ├── FETCHES: /api/notes?limit=200 (linked PDFs)
│   │   ├── Matches: notes by unit_slug "lecture-{videoId}"
│   │   ├── Search + semester filter
│   │   └── Links to: /watch/[videoId], /view-pdf
│   │
│   ├── video-notes.tsx  ◄── NOTES ON WATCH PAGE (client, 121 lines)
│   │   ├── FETCHES: /api/notes?video_id={id} (primary)
│   │   ├── FALLBACK: /api/notes?semester={key}&subject={slug} (all subject notes)
│   │   ├── Groups by: unit_title
│   │   └── Links to: /view-pdf
│   │
│   ├── related-lectures.tsx  ◄── ON UNIT PAGES (client, 68 lines)
│   │   ├── FETCHES: /api/lectures
│   │   ├── Filters by: semesterKey
│   │   ├── Shows: max 4 lecture cards
│   │   └── Links to: /watch/[videoId]
│   │
│   ├── notes-tree.tsx  ◄── ALL NOTES BROWSER (client, 157 lines)
│   │   ├── Uses: getAllNotes() from content/notes.ts (static, no API)
│   │   ├── Search + semester filter
│   │   ├── Groups by: semester → subject
│   │   ├── Shows: unit title, summary, PDF/handwritten badges
│   │   └── Links to: /notes/[semester]/[subject]/[unit]
│   │
│   ├── entrance-card.tsx  ◄── ENTRANCE HUB CARD (simple Link card)
│   │   └── Links to: /subjects/entrance
│   │
│   ├── entrance-mock-test.tsx  ◄── STANDALONE MOCK TEST (client, 477 lines)
│   │   ├── Config + quiz + results in one component
│   │   └── Earlier iteration (route-based pages preferred)
│   │
│   ├── completion-toggle.tsx  ◄── UNIT COMPLETION (client)
│   │   ├── Reads/Writes: localStorage (bca-nepal-completed-units[])
│   │   ├── Dispatches: custom event "local-storage-update"
│   │   └── Used by: unit notes page, tracked by ProgressDashboard
│   │
│   ├── progress-dashboard.tsx  ◄── PROFILE PROGRESS (client)
│   │   ├── Reads: localStorage completed units
│   │   ├── Calculates: completion % (completed / total * 100)
│   │   ├── Listens for: "local-storage-update" event
│   │   └── Renders: progress bar + metrics grid
│   │
│   ├── service-worker-register.tsx  ◄── PWA CORE (client)
│   │   ├── Registers: /sw.js
│   │   ├── Handles: SW update detection → "New version" toast
│   │   ├── Handles: PWA install prompt (beforeinstallprompt)
│   │   ├── Handles: push subscription
│   │   ├── Context menu protection (right-click disabled)
│   │   ├── Copy protection (copy event blocked)
│   │   ├── Persistent storage request
│   │   └── Periodic sync registration
│   │
│   ├── theme-provider.tsx  ◄── WRAPS next-themes ThemeProvider
│   ├── theme-toggle.tsx  ◄── Sun/Moon toggle (hydration-safe)
│   ├── offline-banner.tsx  ◄── "You're offline" banner (navigator.onLine)
│   ├── welcome-hero.tsx  ◄── Home hero with stats (server component)
│   ├── dashboard-card.tsx  ◄── Semester summary card (server)
│   ├── semester-scroller.tsx  ◄── Semester pill buttons (server)
│   ├── pdf-error-boundary.tsx  ◄── ErrorBoundary for PDF (react-error-boundary)
│   ├── json-ld.tsx  ◄── JSON-LD structured data
│   └── ui-utils.ts  ◄── routeTitle() — kebab-case to Title Case
│
├── content/  ◄── STATIC CONTENT (bundled at build time)
│   ├── subjects/
│   │   ├── types.ts  ◄── Semester, Subject, Unit, NoteItem, SemesterKey types (includes labReports field)
│   │   ├── index.ts  ◄── Aggregates semesters[], exports getSemester/getSubject/getUnit
│   │   ├── semester-1/index.ts  ◄── 6 subjects, 38 units + lab reports
│   │   └── semester-2/index.ts  ◄── 6 subjects, 48 units + lab reports
│   ├── entrance/
│   │   ├── index.ts  ◄── entranceTopics[] (mathematics, english, computer-gk)
│   │   └── questionBank.ts  ◄── ~439 lines of offline question data (121 English, 121 Math, ~52 GK)
│   ├── lectures.ts  ◄── 10 static LectureVideo objects (fallback for YouTube API)
│   └── notes.ts  ◄── getAllNotes() — flattens all subjects/units for search
│
├── lib/  ◄── SHARED UTILITIES
│   ├── supabase.ts  ◄── getSupabaseClient() (singleton), getSupabaseServer() (service_role)
│   ├── admin-auth.ts  ◄── validateAdminRequest() — checks cookie + header
│   ├── db.ts  ◄── IndexedDB client (228 lines): savePDF, getPDF, bookmark, sync queue
│   ├── database.types.ts  ◄── NoteRow, NoteInsert, NoteUpdate, EntranceQuestionRow, EntrancePDFRow types
│   ├── storage-url.ts  ◄── getPublicObjectUrl, getNotesPdfUrl, getLecturesPdfUrl
│   ├── storage.ts  ◄── ensureStorageBuckets() — idempotent bucket creation
│   ├── progress.ts  ◄── ProgressState, getTotalUnits()
│   └── utils.ts  ◄── cn() = clsx + tailwind-merge
│
├── proxy.ts  ◄── Security headers: nosniff, DENY framing, Permissions-Policy
└── middleware.ts  ◄── (NOT PRESENT — proxy.ts is standalone)
```

### 🔗 Sidebar: What Links Where

```
HOME        → /subjects, /lectures, /watch/[videoId]
SUBJECTS    → /subjects/[semester] → /subjects/[semester]/[subject]
            → /subjects/entrance → /questions, /mock-test
            → /notes/[semester]/[subject]/[unit]
            → /notes/[semester]/[subject]/lab-reports
NOTES       → /view-pdf?url=&title=&semester=&subject=&unit=
LECTURES    → /watch/[videoId], /view-pdf?url=...
WATCH       → /view-pdf?url=... (for linked notes)
PROFILE     → /admin, /upload, /privacy-policy, /terms-and-conditions
ADMIN       → /upload, /view-pdf (preview notes)
BOOKMARKS   → /view-pdf?url=... (opens stored PDF)
ENTRANCE    → /questions (PDFs), /mock-test/[subject] (quiz)
```

---

## 3. Data Flow & Cold Loading

### 🧊 Cold Loading Sequence (First Visit)

```
┌──────────────────────────────────────────────────────────────────┐
│  1. USER ENTERS https://bcanepal.netlify.app                     │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  2. SERVER RENDERS ROOT LAYOUT (layout.tsx)                      │
│     ├── Static HTML with:                                        │
│     │   ├── <html> with Geist font CSS                           │
│     │   ├── ThemeProvider script                                  │
│     │   ├── GTM + GA4 scripts (<Script beforeInteractive>)       │
│     │   ├── AppHeader (logo, title, subscribe badge, theme btn)  │
│     │   ├── Page content (depends on route)                      │
│     │   ├── OfflineBanner (hidden unless offline)                 │
│     │   └── SiteNav (bottom tab bar)                             │
│     └── Sends: Full HTML to browser                              │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  3. BROWSER LOADS PAGE                                           │
│     ├── Fetches: JS bundles (React, next.js chunks)              │
│     ├── Fetches: CSS (globals.css with Tailwind)                 │
│     ├── Fetches: Boxicons CDN (icon set)                         │
│     ├── Fetches: Google Fonts (Geist)                            │
│     └── Hydrates: React components                               │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  4. SERVICE WORKER INSTALLS (SW register in ServiceWorkerRegister)│
│     ├── Precaches: 28 URLs (home, subjects, lectures, admin,     │
│     │               offline.html, icons, manifest, etc.)         │
│     ├── Activates: Takes control of all pages                    │
│     └── Ready for: offline fallback, API caching                 │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  5. CLIENT COMPONENTS FETCH DATA                                 │
│                                                                  │
│  ┌────────── HOME PAGE ──────────┐                               │
│  │ Reads: content/subjects (bundled, instant)                   │
│  │ Renders: semester pills + subject cards                      │
│  │ No API calls needed                                          │
│  └──────────────────────────────┘                               │
│                                                                  │
│  ┌────────── SUBJECTS ───────────┐                               │
│  │ SSG pages (pre-built HTML)                                   │
│  │ No client-side fetch needed                                  │
│  └──────────────────────────────┘                               │
│                                                                  │
│  ┌────────── LECTURES ───────────┐                               │
│  │ Fetches: GET /api/lectures    │ ← YouTube API proxy          │
│  │ Fetches: GET /api/notes?limit=200 │ ← Supabase notes         │
│  │ Renders: lecture cards + linked notes                        │
│  └──────────────────────────────┘                               │
│                                                                  │
│  ┌────────── UNIT NOTES ─────────┐                               │
│  │ SSR: Server fetches Supabase DB + Storage on every request   │
│  │ Merges with static content                                   │
│  │ Client: RelatedLectures fetches /api/lectures                │
│  └──────────────────────────────┘                               │
│                                                                  │
│  ┌────────── BOOKMARKS ──────────┐                               │
│  │ Reads: IndexedDB (getBookmarkedPDFs)                         │
│  │ No server fetch needed                                       │
│  └──────────────────────────────┘                               │
│                                                                  │
│  ┌────────── PROFILE ────────────┐                               │
│  │ Reads: localStorage (completed units)                        │
│  │ Reads: IndexedDB (bookmark count)                            │
│  │ No server fetch needed                                       │
│  └──────────────────────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
```

### 📡 Rendering Strategy by Route

| Route | Strategy | Data Source | First Load Speed |
|---|---|---|---|
| `/` (Home) | Client + bundled static | `content/` | Instant |
| `/subjects` | **SSG** (static HTML) | `content/` | Instant |
| `/subjects/[sem]` | **SSG** (generateStaticParams) | `content/` | Instant |
| `/subjects/[sem]/[sub]` | **SSG** (generateStaticParams) | `content/` | Instant |
| `/subjects/entrance` | Client | Static markup | Instant |
| `/questions` | Client | `/api/entrance/pdfs` | Wait for API |
| `/mock-test` | Client | Static markup | Instant |
| `/mock-test/[subject]` | Client | `/api/entrance/questions` + fallback | Wait for API |
| `/notes/[sem]/[sub]/[unit]` | **SSR** (force-dynamic) | Static + Supabase DB + Storage | Wait for DB |
| `/notes/[sem]/[sub]/lab-reports` | **SSR** (force-dynamic) | Supabase DB + Storage | Wait for DB |
| `/lectures` | Server shell + client fetch | `/api/lectures` + `/api/notes` | Fast shell, wait for API |
| `/watch/[id]` | Server metadata + client page | `lectureVideos[]` + `/api/notes` | Fast shell, wait for API |
| `/view-pdf` | Client (dynamic import) | Query params + IndexedDB | Wait for react-pdf |
| `/bookmark` | Client | IndexedDB | Instant (local) |
| `/profile` | Client | localStorage + IndexedDB | Instant (local) |
| `/admin` | Client | `/api/notes` (after auth) | Wait for API |
| `/upload` | Client | `/api/lectures` (after auth) | Wait for API |

### 🔄 SW Caching Strategies

```
Navigation (pages)  →  Stale-while-revalidate (instant cache, background refresh)
/api/ endpoints     →  Network-first, cache fallback (10 min TTL)
PDFs / Supabase     →  Cache-first with refresh (30 day max age)
YouTube thumbnails  →  Cache-first with refresh
JS/CSS/images       →  Cache-first with refresh
PDF.js worker       →  Cache-first (unpkg.com CDN)
Analytics (GA/GTM)  →  BYPASSED (never intercepted)
```

---

## 4. API Routes Deep Dive

### 📍 Route Map

```
/api/
├── auth/
│   ├── login/route.ts     POST  (no auth)  → Validate password, set cookie
│   └── logout/route.ts    POST  (no auth)  → Clear cookie
│
├── notes/
│   ├── route.ts           GET   (no auth)  → List notes with filters + URL health check
│   └── [id]/route.ts      GET   (no auth)  → Get single note
│                          PATCH (admin)    → Update title/format/video_id
│                          DELETE (admin)   → Delete note + storage file
│
├── lectures/route.ts      GET   (no auth)  → Proxy YouTube API, infer metadata
│
├── entrance/
│   ├── questions/route.ts GET   (no auth)  → List questions with topic filter
│   │                      POST  (admin)    → Insert new question
│   └── pdfs/route.ts      GET   (no auth)  → List entrance PDFs (DB + storage scan)
│                          POST  (admin)    → Create signed upload URL + DB record
│
├── storage/
│   ├── upload/route.ts    POST  (admin)    → Create signed URL + insert DB record
│   ├── delete/route.ts    DELETE (admin)   → Remove file from storage
│   ├── list/route.ts      GET   (no auth)  → List files in bucket/folder
│   ├── init/route.ts      POST  (no auth)  → Create storage buckets
│   └── sync/route.ts      POST  (admin)    → Find orphans, insert DB records
│
├── db/init/route.ts       POST  (no auth)  → Check/return SQL for notes table
│
└── youtube/
    ├── subscribe/route.ts POST  (admin)    → PubSubHubbub subscribe/unsubscribe
    └── pubsub/route.ts    GET   (no auth)  → Hub challenge verification
                       POST  (no auth)  → Receive new video notifications
```

### 🔍 Deep Dive: Key API Endpoints

#### `GET /api/notes` — List Notes

```
Request:  GET /api/notes?semester=semester-2&subject=microprocessor&limit=100

Flow:
  1. Parse query params: semester, subject, unit, format, video_id, limit, offset
  2. Query Supabase: supabase.from("notes").select("*")
     → Filters: .eq("semester_key", ...), .eq("subject_slug", ...), etc.
     → Order: created_at DESC
     → Range: 0 to limit (default 200)
  3. URL Health Check (batch, concurrency=10, timeout=3s):
     → For each note, HEAD request to public_url
     → Return only notes with HTTP 200
  4. Return: { notes: NoteRow[], count: number }

Response:
  {
    "notes": [
      {
        "id": "uuid",
        "title": "Chapter 1 Notes",
        "file_name": "chapter1.pdf",
        "file_path": "semester-2/microprocessor/chapter-1/chapter1.pdf",
        "format": "pdf",
        "bucket": "notes",
        "semester_key": "semester-2",
        "subject_slug": "microprocessor",
        "unit_slug": "chapter-1",
        "public_url": "https://.../public/notes/semester-2/.../chapter1.pdf",
        "lecture_video_id": null,
        "created_at": "2026-01-15T...",
        "updated_at": "2026-01-15T..."
      }
    ],
    "count": 1
  }

Used by:
  - admin/page.tsx (list all notes for management)
  - lecture-grid.tsx (find notes linked to lectures)
  - video-notes.tsx (find notes by video_id or semester+subject)
  - unit notes page (server-side fetch)
```

#### `POST /api/storage/upload` — Upload PDF

```
Request:  POST /api/storage/upload
Headers:  Cookie: admin_session=... (or x-admin-key: ...)
Body:     {
            "folder": "semester-2/microprocessor/chapter-1",
            "bucket": "notes",
            "title": "Chapter 1 Complete Notes",
            "fileName": "chapter1.pdf",
            "fileSize": 2048576,
            "fileType": "application/pdf",
            "format": "pdf"
          }

Flow:
  1. validateAdminRequest(request) → check cookie or header
  2. Build filePath: "semester-2/microprocessor/chapter-1/chapter1.pdf"
  3. Create signed upload URL:
     → supabase.storage.from("notes").createSignedUploadUrl(filePath)
  4. Insert DB record with all metadata
  5. Return signed URL + public URL

Response:
  {
    "signedUrl": "https://.../storage/v1/object/upload/...",
    "path": "semester-2/microprocessor/chapter-1/chapter1.pdf",
    "publicUrl": "https://.../public/notes/semester-2/.../chapter1.pdf",
    "token": "...",
    "fileName": "chapter1.pdf"
  }

Upload flow (client-side after getting signed URL):
  → PUT signedUrl with file body (binary)
  → File is stored in Supabase Storage bucket

Used by: upload/page.tsx
```

#### `GET /api/lectures` — YouTube API Proxy

```
Request:  GET /api/lectures

Flow:
  1. Fetch YouTube playlist items (UUBvTTBLD1wD1jTQs0OeBZ4Q uploads playlist)
     → Paginate through ALL pages (could be hundreds)
  2. Batch fetch video durations + view counts (50 per batch)
     → GET videos?part=contentDetails,statistics&id=id1,id2,...,id50
  3. For each video, infer metadata from title:
     → inferSemester(title): matches "1st sem", "semester 2", "bca 1", etc.
     → inferSubject(title, semester): matches keywords:
         "discrete" / "set theory"       → "Discrete Mathematics"
         "microprocessor" / "controller" → "Microprocessor and Computer Architecture"
         "database" / "sql" / "dbms"    → "Database"
         "math" / "calculus" / "limit"  → "Mathematics I" or "II" (by semester)
         ... (15+ subject patterns)
     → inferTag(title, position): "Tutorial", "Concept", "Exam Prep", "New", "Video"
     → formatDuration(iso): "PT29M46S" → "29:46"
     → formatViewCount(views): "804" → "804 views", "1500" → "1.5K views"
     → computeTimeAgo(publishedAt): "2 hours ago", "3 days ago", "1 month ago"
  4. Return sorted array (by publish date, newest first)

Response:
  {
    "videos": [
      {
        "id": "sdOX85zZfUc",
        "title": "Limits of Trigonometric Functions ...",
        "duration": "29:46",
        "meta": "15 views • 2 hours ago",
        "tag": "New",
        "semester": "Semester 2",
        "subject": "Mathematics II",
        "semesterKey": "semester-2",
        "thumbnail": "https://i.ytimg.com/vi/sdOX85zZfUc/hqdefault.jpg"
      }
    ]
  }

Used by:
  - lecture-grid.tsx (lecture browser page)
  - video-notes.tsx (watch page notes panel)
  - related-lectures.tsx (unit page sidebar)
  - admin/page.tsx (video linking selector)
  - upload/page.tsx (lecture dropdown)
```

---

## 5. Auth System

### 🔐 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                      │
│                                                          │
│  Login:                                                  │
│  ┌──────────┐   POST /api/auth/login    ┌─────────────┐ │
│  │ Password │ ───────────────────────>  │   Server    │ │
│  │  Input   │   { password: "..." }     │  Validates  │ │
│  └──────────┘                           │   ADMIN_KEY │ │
│        │                                └──────┬──────┘ │
│        │                                       │        │
│        │  <─────────────────────────────────────┘        │
│        │  200 + Set-Cookie: admin_session=<key>          │
│        │  HttpOnly; Secure; SameSite=Lax; Max-Age=86400 │
│        ▼                                                 │
│  ┌──────────────┐                                       │
│  │ Authenticated │  (React state: true)                  │
│  └──────────────┘                                       │
│                                                          │
│  Subsequent requests:                                     │
│  ┌────────┐   POST /api/storage/upload                  │
│  │ Cookie │ ──────────────────────────>  Server reads    │
│  │ Auto   │   (credentials: "include")  cookie, matches  │
│  │ Sent   │                              ADMIN_KEY      │
│  └────────┘                            Process request  │
│                                                          │
│  Logout:                                                 │
│  ┌────────┐   POST /api/auth/logout    ┌─────────────┐ │
│  │ Logout │ ───────────────────────>  │ Clear cookie │ │
│  │ Button │                           │ Max-Age: 0  │ │
│  └────────┘                           └─────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 🔑 Auth-Gated Routes

| Endpoint | Validation | Purpose |
|---|---|---|
| `POST /api/storage/upload` | ✅ `validateAdminRequest()` | Upload PDFs |
| `DELETE /api/storage/delete` | ✅ `validateAdminRequest()` | Delete files |
| `POST /api/storage/sync` | ✅ `validateAdminRequest()` | Sync orphans |
| `PATCH /api/notes/[id]` | ✅ `validateAdminRequest()` | Link/unlink videos |
| `DELETE /api/notes/[id]` | ✅ `validateAdminRequest()` | Delete notes |
| `POST /api/entrance/questions` | ✅ `validateAdminRequest()` | Add entrance questions |
| `POST /api/entrance/pdfs` | ✅ `validateAdminRequest()` | Upload entrance PDFs |
| `POST /api/youtube/subscribe` | ✅ `validateAdminRequest()` | PubSubHubbub mgmt |

### 🛡️ `validateAdminRequest()` Logic

```
validateAdminRequest(request):
  1. Check x-admin-key header
     → If present AND === ADMIN_KEY → return true
  2. Check admin_session cookie
     → Parse Cookie header, extract admin_session value
     → If value === ADMIN_KEY → return true
  3. Otherwise → return false (401 Unauthorized)
```

---

## 6. PDF Handling — End to End

### 📄 Complete PDF Pipeline

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        UPLOAD (Admin)                                     │
│                                                                          │
│  Upload Page                                                             │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │ 1. User selects: semester → subject → unit                  │        │
│  │ 2. Picks PDF file                                            │        │
│  │ 3. POST /api/storage/upload → Server creates:               │        │
│  │    a. Signed upload URL via Supabase Storage API              │        │
│  │    b. DB record in notes table                                │        │
│  │ 4. Client PUTs file to signed URL                             │        │
│  │ 5. Result: PDF in Supabase Storage + metadata in DB           │        │
│  └─────────────────────────────────────────────────────────────┘        │
│                                                                          │
│  Storage Path Convention:                                                 │
│  notes/{semester-key}/{subject-slug}/{unit-slug}/{filename}.pdf          │
│  lectures/{semester-key}/{subject-slug}/lecture-{videoId}/{filename}.pdf │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        VIEW (Student)                                    │
│                                                                          │
│  View PDF Page (view-pdf/pdf-viewer.tsx)                                 │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │ 1. Receives URL as query param                               │        │
│  │ 2. Checks IndexedDB first: isPDFStored(url)?                 │        │
│  │    ├── YES → Create blob URL, render from offline cache      │        │
│  │    └── NO  → Continue...                                     │        │
│  │ 3. fetch(url) with ReadableStream reader                     │        │
│  │ 4. Track download % via Content-Length + chunks received     │        │
│  │ 5. Show progress bar during download                         │        │
│  │ 6. On complete: savePDF(url, blob) → IndexedDB               │        │
│  │ 7. Render PDF via react-pdf:                                 │        │
│  │    a. <Document file={data}>                                 │        │
│  │    b. <Page> with IntersectionObserver lazy loading           │        │
│  │    c. Scroll tracking with current page display              │        │
│  │ 8. Bookmark toggle: updateBookmark(url, true/false)          │        │
│  │ 9. Anti-copy: right-click disabled, user-select: none        │        │
│  └─────────────────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        OFFLINE (PWA)                                     │
│                                                                          │
│  IndexedDB (bca-nepal-offline v3)                                        │
│  ┌─────────────────────────────────────────────────────────────┐        │
│  │ Store: pdfs (keyed by URL)                                   │        │
│  │ {                                                             │        │
│  │   id: "https://.../public/notes/semester-2/.../file.pdf",   │        │
│  │   title: "Chapter 1 Notes",                                  │        │
│  │   url: "https://.../file.pdf",                               │        │
│  │   semester: "semester-2",                                    │        │
│  │   subject: "microprocessor",                                 │        │
│  │   unit: "chapter-1",                                         │        │
│  │   blob: Blob { size: 2048576, type: "application/pdf" },    │        │
│  │   savedAt: 1705312345678,                                    │        │
│  │   bookmarked: true                                           │        │
│  │ }                                                             │        │
│  │                                                               │        │
│  │ Service Worker also caches PDFs in:                           │        │
│  │ Cache: bca-nepal-pdf-v7 (cache-first, 30-day TTL)            │        │
│  └─────────────────────────────────────────────────────────────┘        │
│                                                                          │
│  SUPABASE PUBLIC URL (always accessible):                                │
│  https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/     │
│    {bucket}/{semester-key}/{subject-slug}/{unit-slug}/{filename}         │
└──────────────────────────────────────────────────────────────────────────┘
```

### 📚 `react-pdf` Configuration

```typescript
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// CDN worker (not bundled)
pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
```

- **Document** loads the PDF file (from URL or blob URL)
- **Page** renders individual pages with text layer + annotation layer
- **Lazy Loading**: Each page uses `IntersectionObserver` with `rootMargin: "200px"`
- **Progress Tracking**: `requestAnimationFrame` scroll listener updates current page number
- **Download**: Streaming via `ReadableStream`, progress = `(loaded / total) * 100`

### 📁 Storage URL Builders (lib/storage-url.ts)

```typescript
getPublicObjectUrl({ bucket, path })
  → `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`

getNotesPdfUrl({ semesterKey, subjectSlug, unitSlug, filename })
  → `.../public/notes/${semesterKey}/${subjectSlug}/${unitSlug}/${filename}`

getLecturesPdfUrl({ semesterKey, subjectSlug, unitSlug, filename })
  → `.../public/lectures/${semesterKey}/${subjectSlug}/${unitSlug}/${filename}`
```

---

## 7. Lecture System — End to End

### 🎬 Complete Lecture Pipeline

```
┌───────────────────────────────────────────────────────────────────────┐
│                     YOUTUBE DATA SOURCES                               │
│                                                                       │
│    YouTube Channel (UCBvTTBLD1wD1jTQs0OeBZ4Q)                        │
│           │                                                           │
│           ▼                                                           │
│    Uploads Playlist (UUBvTTBLD1wD1jTQs0OeBZ4Q)                      │
│           │                                                           │
│           ├──► /api/lectures (server route, paginated)                │
│           │     ├── Fetch ALL playlist items (all pages)              │
│           │     ├── Batch fetch durations + stats (50/batch)          │
│           │     ├── Infer semester + subject + tag from title          │
│           │     └── Return { videos: VideoItem[] }                    │
│           │                                                           │
│           └──► Static lectureVideos[] (content/lectures.ts, 10 entries│
│                 ├── Curated subset (fallback metadata)                 │
│                 ├── Used for: watch page metadata, initial render      │
│                 └── Merged with API data (deduplicated by video ID)   │
└───────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│   LECTURES PAGE          │   │   WATCH PAGE                  │
│   (/lectures)            │   │   (/watch/[videoId])          │
│                          │   │                               │
│   LectureGrid component  │   │   layout.tsx: metadata from   │
│   ├── Fetch /api/lectures│   │   lectureVideos[] (SEO)       │
│   ├── Fetch /api/notes   │   │                               │
│   ├── Search + filter    │   │   page.tsx:                   │
│   ├── Thumbnail cards    │   │   ├── YouTube IFrame Player   │
│   ├── Linked notes below │   │   ├── fetch note metadata     │
│   └── Link → /watch/[id] │   │   └── VideoNotes component   │
└──────────────────────────┘   └──────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                       VIDEO NOTES (video-notes.tsx)                   │
│                                                                       │
│  On watch page, shows PDF notes related to the current video:         │
│                                                                       │
│  1. PRIMARY: Fetch /api/notes?video_id={videoId}                     │
│     → Queries notes table WHERE lecture_video_id = videoId           │
│     → These are notes explicitly linked by admin                     │
│                                                                       │
│  2. FALLBACK: If no linked notes found:                               │
│     a. Find video's semester + subject from lectureVideos[]          │
│     b. Convert subject title to slug via subjectTitleToSlug map       │
│     c. Fetch /api/notes?semester={semKey}&subject={slug}             │
│     d. Show ALL notes for that subject                                │
│                                                                       │
│  3. Groups notes by unit_title, renders each as link to /view-pdf    │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                   RELATED LECTURES (related-lectures.tsx)             │
│                                                                       │
│  On unit notes pages, suggests relevant lecture videos:               │
│                                                                       │
│  1. Fetch /api/lectures                                               │
│  2. Filter by semesterKey matching current unit's semester            │
│  3. Limit to 4 results                                                │
│  4. Render thumbnail cards linking to /watch/[videoId]                │
└───────────────────────────────────────────────────────────────────────┘
```

### 🔗 Lecture ↔ Note Connection Methods

| Method | How it works | Where | Admin Tooling |
|---|---|---|---|
| **`lecture_video_id` column** | Notes table has `lecture_video_id` nullable field. Query by `eq("lecture_video_id", id)` | `video-notes.tsx` (primary), admin panel | Admin can set via PATCH in admin panel |
| **`unit_slug` convention** | Notes with `unit_slug = "lecture-{videoId}"` are matched by slicing prefix | `lecture-grid.tsx` | Upload page creates this slug when uploading lecture notes |
| **Semester+Subject fallback** | If no direct link, all notes for the same semester+subject are shown | `video-notes.tsx` (fallback) | No admin action needed |

---

## 8. Entrance Preparation System

### 🎓 Architecture Overview

```
┌───────────────────────────────────────────────────────────────────────┐
│                    ENTRANCE PREP FLOW                                  │
│                                                                       │
│    Subjects Page (/subjects)                                          │
│           │                                                           │
│           ▼                                                           │
│    Entrance Hub (/subjects/entrance)                                  │
│           │                                                           │
│           ├──► Questions (/questions)                                  │
│           │     ├── Fetches: /api/entrance/pdfs                       │
│           │     ├── Scans: entrance Supabase Storage bucket           │
│           │     └── Renders: PDF cards with view/download             │
│           │                                                           │
│           └──► Mock Test (/mock-test)                                 │
│                 ├── Config: subject + question count                  │
│                 └── Quiz Engine (/mock-test/[subject])                │
│                       ├── Primary: /api/entrance/questions (Supabase) │
│                       ├── Fallback: questionBank.ts (offline)         │
│                       └── Results: grade + topic breakdown            │
└───────────────────────────────────────────────────────────────────────┘
```

### 📚 Question Bank (Offline-First)

```
content/entrance/questionBank.ts
├── rawQuestionBank: RawQuestion[]
│   ├── 121 English questions
│   ├── 121 Mathematics questions
│   └── ~52 Computer GK questions
├── toMockQuestion(): converts RawQuestion → MockQuestion
└── MockQuestion type: { question, options[], correctAnswer, explanation, topic }

Two-tier data loading:
  1. TRY: /api/entrance/questions?topic={subject}&limit={count}
     → Queries entrance_questions table in Supabase
  2. CATCH: Use local questionBank.ts data
     → Shuffle + slice to requested count
     → Works fully offline
```

### 🗂️ Entrance PDFs Storage

```
Bucket: entrance (public)
├── Root files (PDFs directly in bucket root)
└── entrance_pdfs/
    └── {filename}.pdf

API: /api/entrance/pdfs
├── GET: Merges DB records + storage scan (finds orphans)
├── POST: Creates signed upload URL + DB record (admin only)
└── Returns: { pdfs: EntrancePDFRow[] }
```

### 📊 Mock Test Flow

```
Config Page (/mock-test):
  ┌─────────────────────────────────────────┐
  │  Select Subject:                         │
  │  [English] [Mathematics] [GK] [All]     │
  │                                          │
  │  Number of Questions:                    │
  │  [10] [20] [30]                          │
  │                                          │
  │  [Start Mock Test →]                     │
  └─────────────────────────────────────────┘
                    │
                    ▼
Quiz Engine (/mock-test/[subject]?count=20):
  ┌─────────────────────────────────────────┐
  │  Q 3/20           ⏱ 14:32              │
  │                                          │
  │  What is the capital of Nepal?           │
  │                                          │
  │  A. Pokhara      B. Kathmandu ✓         │
  │  C. Chitwan      D. Lalitpur            │
  │                                          │
  │  [← Prev]  [Next →]                     │
  │  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐                │
  │  │1│2│●│4│5│6│7│8│9│10│  (dots)         │
  │  └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘                │
  │                                          │
  │  [Submit Test]                           │
  └─────────────────────────────────────────┘
                    │
                    ▼
Results:
  ┌─────────────────────────────────────────┐
  │  Score: 15/20 (75%)    Grade: B+        │
  │                                          │
  │  Topic Breakdown:                        │
  │  ├── English: 8/10 (80%)                │
  │  └── Mathematics: 7/10 (70%)            │
  │                                          │
  │  [Review Answers]                        │
  └─────────────────────────────────────────┘
```

### 🗄️ Entrance Database Tables

```sql
-- entrance_questions table
entrance_questions
├── id              UUID DEFAULT gen_random_uuid() PRIMARY KEY
├── topic           TEXT CHECK (topic IN ('mathematics', 'english', 'computer-gk'))
├── question        TEXT NOT NULL
├── options         JSONB NOT NULL  -- ["option1", "option2", "option3", "option4"]
├── correct_answer  INTEGER NOT NULL  -- index of correct option (0-based)
├── explanation     TEXT NULLABLE
└── created_at      TIMESTAMPTZ DEFAULT NOW()

-- entrance_pdfs table
entrance_pdfs
├── id              UUID DEFAULT gen_random_uuid() PRIMARY KEY
├── title           TEXT NOT NULL
├── file_name       TEXT NOT NULL
├── file_path       TEXT NOT NULL
├── file_size       BIGINT NULLABLE
├── mime_type       TEXT DEFAULT 'application/pdf'
├── public_url      TEXT NOT NULL
├── year            TEXT NULLABLE
└── created_at      TIMESTAMPTZ DEFAULT NOW()
```

---

## 9. Lab Reports System

### 🔬 Architecture Overview

```
Subject Detail Page (/subjects/[semester]/[subject])
│
├── Shows "Lab Reports" link when subject.labReports.length > 0
│
└──► Lab Reports Page (/notes/[semester]/[subject]/lab-reports)
    ├── Server-rendered (force-dynamic)
    ├── FETCHES: Supabase DB (notes WHERE unit_slug = "lab-reports")
    ├── FETCHES: Supabase Storage (list {semester}/{subject}/lab-reports/)
    ├── MERGES: DB records + storage files (deduped by path)
    └── Renders: PDF links to /view-pdf
```

### 📁 Storage Path Convention

```
Bucket: notes (public)
└── {semester-key}/{subject-slug}/lab-reports/
    ├── lab-report-1.pdf
    ├── lab-report-2.pdf
    └── ...
```

### 🗄️ Database Integration

```
Lab reports are stored in the existing notes table:
  - semester_key: "semester-1"
  - subject_slug: "c-programming"
  - unit_slug: "lab-reports"  ← special marker

The page also scans Supabase Storage directly for any files
in the lab-reports folder that may not have DB records.
```

---

## 10. Linking Between Nodes

### 🕸️ Complete Node Connection Map

```
                        ┌─────────────┐
                        │    HOME     │
                        │  (page.tsx) │
                        └──────┬──────┘
                               │
               ┌───────────────┼────────────────┐
               ▼               ▼                 ▼
        ┌──────────┐   ┌────────────┐   ┌──────────────┐
        │ SUBJECTS │   │  LECTURES  │   │   PROFILE    │
        │ (SSG)    │   │ (client)   │   │  (client)    │
        └────┬─────┘   └─────┬──────┘   └──────┬───────┘
             │               │                  │
             ▼               │                  ├────────────┐
     ┌──────────────┐        │                  │            │
     │ SEMESTER     │        │                  ▼            ▼
     │ (SSG)        │        │             ┌────────┐ ┌──────────┐
     └──────┬───────┘        │             │ ADMIN  │ │  UPLOAD  │
            │                │             │(client)│ │ (client) │
            ▼                │             └────────┘ └──────────┘
     ┌──────────────┐        │
     │  SUBJECT     │        │
     │  (SSG)       │        │
     └──────┬───────┘        │
            │                │
            ├────────────────┼──────────────────┐
            │                │                  │
            ▼                ▼                  ▼
     ┌──────────────┐ ┌───────────┐      ┌───────────────┐
     │  UNIT NOTES  │ │PDF VIEWER │      │  LAB REPORTS  │
     │(SSR+dynamic) │ │(client)   │      │(SSR+dynamic)  │
     └──────┬───────┘ │react-pdf  │      └───────────────┘
            │         │IndexedDB  │
            ├─────────┴───────────┘
            │
            ▼
     ┌──────────────┐        ┌──────────────────────────┐
     │  RELATED     │        │  ENTRANCE PREP           │
     │  LECTURES    │        │  (/subjects/entrance)    │
     │(related-lec) │        │  ├── Questions (/questions)│
     └──────────────┘        │  └── Mock Test (/mock-test)│
                             │      └── Quiz Engine     │
                             └──────────────────────────┘

     ┌──────────────────────────────────────────────────────────────┐
     │                    BACKEND SERVICES                           │
     │                                                               │
     │  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
     │  │  Supabase   │  │  YouTube     │  │  Static Content    │  │
     │  │  DB + Stor  │  │  Data API    │  │  (content/*)       │  │
     │  └─────────────┘  └──────────────┘  └────────────────────┘  │
     └──────────────────────────────────────────────────────────────┘
```

### 🔗 Connection Inventory

| From | To | Via | Type |
|---|---|---|---|
| Home → Subject card | `/subjects/[semester]` | `<Link>` | Static route |
| Subjects → Entrance | `/subjects/entrance` | `<Link>` | Static route |
| Entrance → Questions | `/questions` | `<Link>` | Client |
| Entrance → Mock Test | `/mock-test` | `<Link>` | Client |
| Mock Test Config → Quiz | `/mock-test/[subject]?count=N` | `<Link>` | Client |
| Subject list → Subject | `/subjects/[sem]/[sub]` | `<Link>` | Static route |
| Subject → Unit notes | `/notes/[sem]/[sub]/[unit]` | `<Link>` | SSR + dynamic data |
| Subject → Lab Reports | `/notes/[sem]/[sub]/lab-reports` | `<Link>` | SSR + dynamic data |
| Unit notes → PDF | `/view-pdf?url=...` | `<Link>` with query params | Client |
| Unit notes → Related lectures | `/watch/[videoId]` | `<Link>` | Client |
| Lectures → Watch | `/watch/[videoId]` | `<Link>` | Client |
| Lectures → PDF | `/view-pdf?url=...` | `<Link>` | Client |
| Watch → PDF (linked notes) | `/view-pdf?url=...` | `<Link>` | Client |
| Watch → Back to lectures | `/lectures` | `<Link>` | Static |
| Bookmarks → PDF | `/view-pdf?url=...` | `<Link>` | Client (blob URL) |
| Profile → Admin | `/admin` | `<Link>` | Client (auth gate) |
| Profile → Upload | `/upload` | `<Link>` | Client (auth gate) |
| Admin → Upload | `/upload` | `<Link>` | Client |
| Admin → PDF preview | `/view-pdf?url=...` | `<Link>` | Client |
| Admin → API | `/api/notes` | `fetch()` | API call |
| Admin → API | `/api/storage/sync` | `fetch()` | API call |
| Upload → API | `/api/storage/upload` | `fetch()` + `PUT` | API call |
| Upload → API | `/api/storage/sync` | `fetch()` | API call |
| LectureGrid → API | `/api/lectures` | `fetch()` | API call |
| LectureGrid → API | `/api/notes` | `fetch()` | API call |
| VideoNotes → API | `/api/notes?video_id=` | `fetch()` | API call |
| RelatedLectures → API | `/api/lectures` | `fetch()` | API call |
| Questions → API | `/api/entrance/pdfs` | `fetch()` | API call |
| Mock Test → API | `/api/entrance/questions` | `fetch()` | API call |
| Profile → localStorage | `bca-nepal-completed-units` | Direct read | Client storage |
| Profile → localStorage | `bca-nepal-default-semester` | Direct read/write | Client storage |
| Profile → IndexedDB | `getBookmarkedPDFs()` | IndexedDB | Client storage |
| Bookmarks → IndexedDB | `getBookmarkedPDFs()` | IndexedDB | Client storage |
| PDFViewer → IndexedDB | `savePDF()`, `getPDF()` | IndexedDB | Client storage |
| SiteNav → localStorage | `bca-nepal-last-subjects-path` | Direct read/write | Client storage |

---

## 11. Profile Page — In-Depth

### 👤 Profile Page Layout

```typescript
// src/app/profile/page.tsx — Client Component
// Reads from localStorage + IndexedDB (no server data)

┌─────────────────────────────────────────────────────┐
│  🔙 Profile (BackNav)                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  PROGRESS (ProgressDashboard)                   ││
│  │                                                 ││
│  │  [████████████████░░░░░░░░░] 45%                ││
│  │  18 of 40 units completed                       ││
│  │                                                 ││
│  │  Reads: localStorage bca-nepal-completed-units  ││
│  │  Listens: "local-storage-update" custom event   ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  STUDY METRICS                                   ││
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ││
│  │  │   2    │ │   12   │ │   18   │ │    5     │ ││
│  │  │Sems.  │ │Subjects│ │Units   │ │Bookmarks │ ││
│  │  └────────┘ └────────┘ └────────┘ └──────────┘ ││
│  │                                                 ││
│  │  Bookmark count from: IndexedDB getBookmarked   ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  DEFAULT SEMESTER                                ││
│  │  [Semester 1 ▼]                                  ││
│  │  → Tap Subjects tab jumps directly to this sem  ││
│  │  → Writes to localStorage                       ││
│  │  → Dispatches "default-semester-change" event   ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  COMMUNITY                                       ││
│  │  🔗 Facebook Group (external link)              ││
│  │  🔗 WhatsApp Community (external link)          ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  INSTALL APP (PWA)                               ││
│  │  [+ Show Android instructions]                   ││
│  │  [+ Show iOS instructions]                       ││
│  │  (iOS detection via user agent)                  ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  SHARE                                           ││
│  │  [QR Code Image]                                 ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  ADMIN                                           ││
│  │  🔒 Admin Panel           → /admin              ││
│  │  📤 Upload Notes          → /upload             ││
│  └─────────────────────────────────────────────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────────┐│
│  │  LEGAL                                           ││
│  │  📄 Privacy Policy       → /privacy-policy      ││
│  │  📄 Terms & Conditions  → /terms-and-conditions ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### 📊 Progress Tracking System

```
Storage: localStorage key "bca-nepal-completed-units"
Format:  string[] of unit slugs e.g. ["chapter-1", "chapter-2", ...]

CompletionToggle (on unit page):
  → Check if unit slug is in the array
  → Toggle: add/remove from array
  → Dispatch "local-storage-update" event

ProgressDashboard (on profile page):
  → Read array from localStorage
  → getTotalUnits() from content/subjects (static, 86 total)
  → Calculate: (completed.length / totalUnits) * 100
  → Render progress bar + "X of Y completed"
  → Listen for "local-storage-update" to update in real-time

Total Units: 38 (sem-1) + 48 (sem-2) = 86 units
```

---

## 12. Admin Panel — In-Depth

### 🔧 Admin Panel Layout

```typescript
// src/app/admin/page.tsx — Client Component (481 lines)

┌─────────────────────────────────────────────────────────────────────┐
│  NOT AUTHENTICATED (auth gate):                                      │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  🔙 Profile                                                    │  │
│  │                                                                │  │
│  │              🛡️ Admin Panel                                    │  │
│  │        Enter the admin key to manage PDFs.                     │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │  Admin Key                                               │  │  │
│  │  │  [••••••••••••••••••••]                                  │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │  [🔓 Login]                                                    │  │
│  │                                                                │  │
│  │  Login sends: POST /api/auth/login { password }               │  │
│  │  On success: cookie set, authenticated = true                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  AUTHENTICATED:                                                     │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  🔙 Profile                                                    │  │
│  │                                                                │  │
│  │  Admin Panel         [📤 Upload] [🚪 Logout]                  │  │
│  │  Manage all uploaded PDFs                                      │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Filters:                                                      │  │
│  │  [Semester ▼]  [Subject ▼]  [Format ▼]       [🔄 Sync]       │  │
│  │                                   42 PDFs                      │  │
│  │                                                                │  │
│  │  Sync: POST /api/storage/sync { bucket: "notes" }             │  │
│  │  → Scans bucket for orphaned files, creates DB entries        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  📂 Semester 2 › Microprocessor and Computer Architecture     │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ 📄 Chapter 1 Notes              │ 🔗 Linked             │  │  │
│  │  │ Unit: Introduction              │ Change | Unlink       │  │  │
│  │  │ [PDF] [Jan 15, 2026]            │                       │  │  │
│  │  │ [👁 View] [🔗 Change]           │                       │  │  │
│  │  │                                  │                       │  │  │
│  │  │  ┌── LINK PANEL (open) ───────┐ │                       │  │  │
│  │  │  │ Select a lecture video     │ │                       │  │  │
│  │  │  │ ┌─────┐ ┌─────┐ ┌─────┐   │ │                       │  │  │
│  │  │  │ │🖼️   │ │🖼️   │ │🖼️   │   │ │                       │  │  │
│  │  │  │ │Math │ │Micro│ │Disc │   │ │                       │  │  │
│  │  │  │ └─────┘ └─────┘ └─────┘   │ │                       │  │  │
│  │  │  │ [💾 Save] [Cancel]        │ │                       │  │  │
│  │  │  └───────────────────────────┘ │                       │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

Link Panel Data Source (allVideos useMemo):
  → API videos first (from /api/lectures, newest YouTube uploads)
  → Static lectureVideos[] deduplicated as fallback
  → Shows: thumbnail, subject, title
```

### 🔐 Admin API Call Pattern

```
All authenticated admin API calls use:

fetch("/api/notes/{id}", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  credentials: "include",             // ← cookie sent automatically
  body: JSON.stringify({ ... })
});

// Without cookies (legacy/fallback):
headers: { "x-admin-key": adminKey }   // ← also accepted by validateAdminRequest()
```

### 📋 Admin State Management

```typescript
State:
  password: string          // Login form input
  authenticated: boolean    // Auth gate flag
  authError: string         // Login error message
  notes: NoteRecord[]       // Fetched from /api/notes?limit=500
  loading: boolean          // Notes fetch loading
  error: string             // Notes fetch error
  filterSemester: string    // Semester filter
  filterSubject: string     // Subject filter (depends on semester)
  filterFormat: string      // Format filter (all/pdf/handwritten)
  syncing: boolean          // Sync in progress
  syncMsg: string           // Sync result message
  linkingNoteId: string|null // Which note's link panel is open
  selectedVideo: string     // Selected video ID in link panel
  refreshKey: number        // Forces notes refetch
  apiVideos: array          // Fetched from /api/lectures

Effects:
  - Fetch /api/lectures on mount (YouTube videos)
  - Fetch /api/notes when filters or refreshKey change

Memo:
  - filteredSubjects: subjects for selected semester
  - allVideos: merged API + static videos (deduplicated)
  - grouped: notes grouped by "Semester > Subject"
```

---

## 13. Notification & Progress Systems

### 🔔 Notification Panel

```
┌───────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION PANEL (bottom sheet)                   │
│                                                                       │
│  Trigger: Bell icon in AppHeader                                      │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │  ───── (drag handle)                                          │    │
│  │  🔔 Notifications                                    [×]      │    │
│  ├───────────────────────────────────────────────────────────────┤    │
│  │                                                               │    │
│  │  ┌─────────────────────────────────────────────────────────┐  │    │
│  │  │ 👋 Welcome to BCA Nepal!                                │  │    │
│  │  │ Your all-in-one study hub for TU BCA students.          │  │    │
│  │  │ (shown once, tracked via localStorage)                  │  │    │
│  │  └─────────────────────────────────────────────────────────┘  │    │
│  │                                                               │    │
│  │  ┌─────────────────────────────────────────────────────────┐  │    │
│  │  │ 🎬 Latest Video                                         │  │    │
│  │  │ [thumbnail] Limits of Trigonometric Functions            │  │    │
│  │  │             2 hours ago                                  │  │    │
│  │  │ (fetches /api/lectures, shows most recent)              │  │    │
│  │  └─────────────────────────────────────────────────────────┘  │    │
│  │                                                               │    │
│  │  ┌─────────────────────────────────────────────────────────┐  │    │
│  │  │ 📝 Notes Updated                                        │  │    │
│  │  │ New notes and study materials have been uploaded.        │  │    │
│  │  │ 1 week ago                                              │  │    │
│  │  └─────────────────────────────────────────────────────────┘  │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  Features:                                                            │
│  - Bottom sheet with backdrop overlay                                 │
│  - Drag/touch handling for swipe-to-dismiss                          │
│  - Scroll locking when open                                          │
│  - Welcome notification shown once (localStorage bca-nepal-welcome-seen)│
└───────────────────────────────────────────────────────────────────────┘
```

### 📊 Route Progress Bar

```
┌───────────────────────────────────────────────────────────────────────┐
│                    ROUTE PROGRESS BAR                                  │
│                                                                       │
│  Position: Fixed at top of viewport                                   │
│  Trigger: Any route change (usePathname)                              │
│                                                                       │
│  Animation sequence:                                                  │
│  ├── 0ms:    Show bar at 30% width                                   │
│  ├── 200ms:  Advance to 65%                                          │
│  ├── 500ms:  Advance to 85%                                          │
│  ├── 700ms:  Complete to 100%                                        │
│  └── 950ms:  Fade out and hide                                       │
│                                                                       │
│  CSS: .route-progress (fixed, top: 0, animated width)                │
└───────────────────────────────────────────────────────────────────────┘
```

### 📡 Smart Site Navigation

```
┌───────────────────────────────────────────────────────────────────────┐
│                    SMART SITE NAV                                      │
│                                                                       │
│  Features:                                                            │
│  ├── Remembers last subjects path in localStorage                    │
│  │   Key: bca-nepal-last-subjects-path                               │
│  │                                                                    │
│  ├── Default semester preference                                      │
│  │   Key: bca-nepal-default-semester                                  │
│  │   → Tap Subjects tab jumps directly to selected semester          │
│  │   → Listens for "default-semester-change" custom event            │
│  │                                                                    │
│  ├── Smart back-navigation                                           │
│  │   → Level 0: /subjects (top level)                                │
│  │   → Level 1: /subjects/semester-2 (semester view)                 │
│  │   → Level 2: /subjects/semester-2/microprocessor (subject view)   │
│  │   → Level 3: /notes/* or /view-pdf (deep view)                   │
│  │   → On deep pages, tapping Subjects goes back one level           │
│  │                                                                    │
│  └── Dimmed state on /view-pdf page                                  │
│      → Reduces visual prominence during PDF viewing                  │
└───────────────────────────────────────────────────────────────────────┘
```

### 🔄 Offline Banner (Toast System)

```
┌───────────────────────────────────────────────────────────────────────┐
│                    OFFLINE BANNER (toast-based)                        │
│                                                                       │
│  Offline detection:                                                   │
│  ├── Shows toast notification when going offline                     │
│  ├── Stored in sessionStorage (dismiss once per session)             │
│  └── Swipe-right to dismiss                                          │
│                                                                       │
│  Online recovery:                                                     │
│  ├── Shows "Back online!" toast for 3 seconds                       │
│  └── Auto-dismisses                                                  │
│                                                                       │
│  CSS: .toast--offline, .toast--online                                │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 14. Database & Storage Schema

### 🗄️ Supabase Database — `notes` Table

```sql
notes
├── id                UUID DEFAULT gen_random_uuid()    PRIMARY KEY
├── title             TEXT                              NOT NULL
├── file_name         TEXT                              NOT NULL
├── file_path         TEXT                              NOT NULL
├── file_size         BIGINT                            NULLABLE
├── mime_type         TEXT                              DEFAULT 'application/pdf'
├── format            TEXT                              NOT NULL CHECK (format IN ('pdf', 'handwritten'))
├── bucket            TEXT                              NOT NULL DEFAULT 'notes'
├── semester_key      TEXT                              NOT NULL
├── subject_slug      TEXT                              NOT NULL
├── unit_slug         TEXT                              NOT NULL
├── public_url        TEXT                              NOT NULL
├── lecture_video_id  TEXT                              NULLABLE  ← links note to YouTube video
├── created_at        TIMESTAMPTZ                       DEFAULT NOW()
└── updated_at        TIMESTAMPTZ                       DEFAULT NOW()

Indexes:
  idx_notes_folder      ON (semester_key, subject_slug, unit_slug)
  idx_notes_created_at  ON (created_at DESC)

Row Level Security:
  → SELECT: public (anyone can read notes)
  → INSERT/UPDATE/DELETE: service_role only (admin API uses service role key)
```

### 🗄️ Supabase Database — `entrance_questions` Table

```sql
entrance_questions
├── id              UUID DEFAULT gen_random_uuid() PRIMARY KEY
├── topic           TEXT CHECK (topic IN ('mathematics', 'english', 'computer-gk'))
├── question        TEXT NOT NULL
├── options         JSONB NOT NULL  -- ["option1", "option2", "option3", "option4"]
├── correct_answer  INTEGER NOT NULL  -- index of correct option (0-based)
├── explanation     TEXT NULLABLE
└── created_at      TIMESTAMPTZ DEFAULT NOW()

Row Level Security:
  → SELECT: public (anyone can read)
  → INSERT/UPDATE/DELETE: service_role only
```

### 🗄️ Supabase Database — `entrance_pdfs` Table

```sql
entrance_pdfs
├── id              UUID DEFAULT gen_random_uuid() PRIMARY KEY
├── title           TEXT NOT NULL
├── file_name       TEXT NOT NULL
├── file_path       TEXT NOT NULL
├── file_size       BIGINT NULLABLE
├── mime_type       TEXT DEFAULT 'application/pdf'
├── public_url      TEXT NOT NULL
├── year            TEXT NULLABLE
└── created_at      TIMESTAMPTZ DEFAULT NOW()

Row Level Security:
  → SELECT: public (anyone can read)
  → INSERT/UPDATE/DELETE: service_role only
```

### 📦 Supabase Storage — Buckets

```
Bucket: notes (public)
├── semester-1/
│   ├── computer-fundamentals/
│   │   ├── intro-to-computer/
│   │   └── ...
│   ├── c-programming/
│   ├── digital-logic/
│   ├── mathematics-i/
│   ├── professional-communication/
│   └── hardware-workshop/
└── semester-2/
    ├── discrete-mathematics/
    ├── microprocessor/
    ├── oop-java/
    ├── mathematics-ii/
    ├── ux-ui-design/
    └── principles-of-management/

Bucket: lectures (public)
└── semester-2/
    ├── mathematics-ii/
    │   └── lecture-{videoId}/
    │       └── notes.pdf
    └── microprocessor/
        └── lecture-{videoId}/
            └── notes.pdf

Bucket: entrance (public)
├── Root files (PDFs directly in bucket root)
└── entrance_pdfs/
    └── {filename}.pdf

Settings:
  - public: true
  - file_size_limit: 50MB (52428800 bytes)
  - allowed_mime_types: ["application/pdf", "image/jpeg", "image/png", "image/webp"]
```

---

## 15. PWA & Offline Architecture

### 📱 PWA Setup

```json
// manifest.json (root)
{
  "name": "BCA Nepal - TU BCA Study Hub",
  "short_name": "BCA Nepal",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": ["icon-48x48.png" ... "icon-512x512.png"]
}

// Root layout.tsx PWA meta tags:
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">
```

### 💾 Storage Layers

```
┌───────────────────────────────────────────────────────────────┐
│                    STORAGE HIERARCHY                            │
│                                                                │
│  Level 1: Server (always authoritative)                        │
│  ├── Supabase DB    → notes table (metadata)                   │
│  │                 → entrance_questions table                   │
│  │                 → entrance_pdfs table                        │
│  └── Supabase Stor. → notes/ bucket                            │
│                    → lectures/ bucket                           │
│                    → entrance/ bucket                           │
│                                                                │
│  Level 2: Cache Storage (Service Worker v9)                    │
│  ├── bca-nepal-v9            → Navigation pages                │
│  ├── bca-nepal-static-v9     → JS, CSS, images                 │
│  ├── bca-nepal-api-v9        → API responses (10 min TTL)      │
│  ├── bca-nepal-pdf-v9        → PDFs (30 day TTL)               │
│  └── bca-nepal-lecture-v9    → Lecture pages                   │
│                                                                │
│  Level 3: IndexedDB (persistent)                                │
│  ├── pdfs (store)          → Full PDF blobs for offline        │
│  └── sync-queue (store)    → Pending bookmark/progress changes │
│                                                                │
│  Level 4: localStorage (ephemeral)                              │
│  ├── bca-nepal-completed-units → Unit completion tracking      │
│  ├── bca-nepal-last-subjects-path → Smart nav memory          │
│  ├── bca-nepal-default-semester → Default semester pref        │
│  └── bca-nepal-welcome-seen → Notification welcome flag        │
└───────────────────────────────────────────────────────────────┘
```

### 🔄 Service Worker Strategies (v9)

| Pattern | Cache Name | Strategy | Max Age | Used For |
|---|---|---|---|---|
| Navigation | `bca-nepal-v9` | Stale-while-revalidate | Immediate | All pages |
| API calls | `bca-nepal-api-v9` | Network-first | 10 min | `/api/*` endpoints |
| PDFs | `bca-nepal-pdf-v9` | Cache-first with refresh | 30 days | Supabase storage PDFs |
| Thumbnails | `bca-nepal-pdf-v9` | Cache-first with refresh | 30 days | YouTube `i.ytimg.com` |
| Static assets | `bca-nepal-static-v9` | Cache-first with refresh | — | JS, CSS, fonts, icons |
| RSC payloads | `bca-nepal-v9` | Stale-while-revalidate | — | Next.js RSC data |
| View-PDF | `bca-nepal-pdf-v9` | Network-first | 30 days | PDF viewer page |
| PDF.js worker | `bca-nepal-static-v9` | Cache-first | — | unpkg.com CDN worker |
| Analytics | — | Bypass (not intercepted) | — | GTM, GA4 |

### 📡 Background Sync

```javascript
// Service Worker listens for:
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-bookmarks") {
    // Post message to all clients → sync IndexedDB bookmarks
  }
  if (event.tag === "sync-progress") {
    // Post message to all clients → sync localStorage progress
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-updates") {
    // HEAD /api/notes → check for content updates
    // Sends CONTENT_UPDATED message to clients
  }
});

// Client message handling (service-worker-register.tsx):
// - SYNC_BOOKMARKS: Triggers bookmark sync
// - SYNC_PROGRESS: Triggers progress sync
// - CONTENT_UPDATED: Dispatches custom event for UI update
```

### 📤 Offline Queue

```
IndexedDB Store: sync-queue

When user is offline:
  1. Bookmark/progress changes saved to sync-queue store
  2. Service Worker registers a background sync event
  3. When online, sync event fires:
     → Read pending items from sync-queue
     → Process each (update IndexedDB/bookmark state)
     → Mark as synced or retry

Service Worker messages:
  - SYNC_BOOKMARKS: Triggers bookmark sync from clients
  - SYNC_PROGRESS: Triggers progress sync from clients
  - CONTENT_UPDATED: Notifies clients of new content
```

---

## 16. Environment Variables

| Variable | Required | Used In | Secret? | Purpose |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | `lib/supabase.ts`, `lib/storage-url.ts` | ❌ Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | `lib/supabase.ts` | ❌ Public | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | For writes | `lib/supabase.ts` | 🔴 **Secret** | Bypasses RLS for admin ops |
| `ADMIN_KEY` | For admin | `lib/admin-auth.ts`, `api/auth/login` | 🔴 **Secret** | Shared admin password |
| `YOUTUBE_API_KEY` | For lectures | `api/lectures/route.ts` | 🔴 **Secret** | YouTube Data API v3 |
| `PUBSUB_CALLBACK_URL` | For YouTube | `api/youtube/subscribe/route.ts` | ❌ Public | PubSubHubbub callback URL |
| `PUBSUB_SECRET` | For YouTube | `api/youtube/pubsub/route.ts` | 🔴 **Secret** | PubSubHubbub verification |
| `NEXT_PUBLIC_SITE_URL` | Recommended | `layout.tsx`, `sitemap.ts`, `robots.ts` | ❌ Public | Canonical site URL |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Sentry config | ❌ Public | Sentry error reporting |
| `NEXT_PUBLIC_VAPID_KEY` | Optional | `service-worker-register.tsx` | ❌ Public | Push notifications |
| `VERCEL_URL` | Auto (Vercel) | `layout.tsx`, `sitemap.ts` | ❌ Auto | Vercel deployment URL |

---

## Appendix: Quick Reference

### 📂 Key File Line Counts

| File | Lines | Type |
|---|---|---|
| `src/app/globals.css` | 3560 | Styles |
| `src/app/mock-test/[subject]/page.tsx` | 535 | Client component (quiz engine) |
| `src/app/upload/page.tsx` | 645 | Client component |
| `src/app/admin/page.tsx` | 481 | Client component |
| `src/components/entrance-mock-test.tsx` | 477 | Client component (standalone) |
| `public/sw.js` | 473+ | Service Worker (v9) |
| `src/app/view-pdf/pdf-viewer.tsx` | 256 | Client component |
| `src/components/notification-panel.tsx` | 242 | Client component |
| `src/components/lecture-grid.tsx` | 231 | Client component |
| `src/lib/db.ts` | 228 | IndexedDB library |
| `src/app/api/lectures/route.ts` | 175 | API route |
| `src/components/notes-tree.tsx` | 157 | Client component |
| `src/app/notes/[semester]/[subject]/lab-reports/page.tsx` | 153 | Server component |
| `src/app/api/entrance/pdfs/route.ts` | 126 | API route |
| `src/app/bookmark/page.tsx` | 135 | Client component |
| `src/app/watch/[videoId]/page.tsx` | 123 | Client component |
| `src/components/video-notes.tsx` | 121 | Client component |
| `src/content/entrance/questionBank.ts` | 439 | Offline question data |

### 🎨 CSS Stats

| Metric | Value |
|---|---|
| Total CSS lines | 3560 |
| Custom CSS variables | ~40 (`--bg-app`, `--text`, `--accent`, etc.) |
| Dark mode overrides | ~40 properties |
| Tailwind CSS version | 4 |
| Icon library | Boxicons CDN (bx-* set) |
| Animation classes | Custom (`.admin-note-card`, `.upload-progress`, etc.) |
| New CSS sections | Toast notifications, bottom-sheet, PWA steps, route progress, legal content |
| Responsive breakpoints | Mobile-first (implicit via flex/grid layouts) |
| Accessibility | `@media (prefers-reduced-motion: reduce)` support |

### 🚀 Performance Characteristics

| Aspect | Detail |
|---|---|
| First load (home) | Instant — no API calls, bundled static content |
| First load (lectures) | Fast shell + wait for `/api/lectures` + `/api/notes` |
| First load (unit notes) | SSR — waits for Supabase DB query |
| First load (mock test) | Wait for `/api/entrance/questions` or local fallback |
| PDF rendering | On-demand, lazy page loading via IntersectionObserver |
| Offline capability | Full — all pages cached, PDFs in IndexedDB, question bank local fallback |
| Bundle size | Next.js app router chunks (code-split by route) |
| Image optimization | Next.js Image component for YouTube thumbnails |
| Route transitions | Animated progress bar via RouteProgress component |
| Smart navigation | SiteNav remembers last path, supports default semester preference |
