# Supabase Storage Setup

## Buckets

Create two public buckets in the Supabase dashboard (`Storage`):

- `notes`
- `lectures`

Settings:
- Public bucket: enabled
- Max file size: `50 MB`
- Allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`, `image/webp`

---

## Folder structure (semester > subject > unit)

Put files in `notes` using this hierarchy:

```
notes/
  semester-1/
    programming-in-c/
      c-basics/
        pdf-unit-1.pdf
      control-and-loops/
        pdf-unit-2.pdf
      functions-pointers-files/
        handwritten-unit-3.pdf
    discrete-structure/
      ...
  semester-2/
    mathematics/
      ...
```

Path pattern:
```
notes/<semester-key>/<subject-slug>/<unit-slug>/<filename>
```

Use the existing app data (`src/content/subjects/types.ts`) as source of truth for:
- `semester-key`: `semester-1`, `semester-2`, `semester-3`, `semester-4`
- `subject-slug`: lowercased hyphenated title from `Subject.slug`
- `unit-slug`: lowercased hyphenated title from `Unit.slug`

Example path:
```
notes/semester-1/programming-in-c/functions-pointers-files/functions-notes.pdf
notes/semester-1/programming-in-c/functions-pointers-files/handwritten-class-notes.pdf
```

---

## File naming convention

- PDFs: `<topic or type>-<number if needed>.pdf`
- Prefer lowercase and hyphens
- Keep names short and semantic, e.g.:
  - `unit-1-notes.pdf`
  - `important-questions.pdf`
  - `handwritten-notes.pdf`

---

## Row Level Security (RLS)

Enable RLS on each bucket and add policies:

```sql
-- notes bucket
create policy "public-read-notes"
on storage.objects for select
to public
using ( bucket_id = 'notes' );

-- lectures bucket
create policy "public-read-lectures"
on storage.objects for select
to public
using ( bucket_id = 'lectures' );
```

Write/delete operations should be done via server-side API routes only, using service-role credentials. Do not add client-side INSERT/UPDATE/DELETE policies unless you add auth.

---

## Initialize buckets

Run once:

```bash
curl -X POST http://localhost:3000/api/storage/init
```

---

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/storage/upload?bucket=notes&folder=semester-1/programming-in-c/functions-pointers-files` | Upload |
| GET | `/api/storage/list?bucket=notes&folder=semester-1/programming-in-c/functions-pointers-files` | List files |
| DELETE | `/api/storage/delete` with JSON `{ path, bucket }` | Delete |

Upload form fields:
- `file`: the file binary
- `bucket`: `notes` or `lectures`
- `folder`: e.g. `semester-1/programming-in-c/functions-pointers-files`

---

## Upload examples

### Single PDF upload

```bash
curl -X POST "http://localhost:3000/api/storage/upload?bucket=notes&folder=semester-1/programming-in-c/functions-pointers-files" \
  -F "file=@/path/to/unit-1.pdf" \
  -F "bucket=notes" \
  -F "folder=semester-1/programming-in-c/functions-pointers-files"
```

Response:
```json
{
  "path": "semester-1/programming-in-c/functions-pointers-files/1718...-unit-1.pdf",
  "url": "https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/semester-1/programming-in-c/functions-pointers-files/1718...-unit-1.pdf",
  "name": "unit-1.pdf",
  "size": 124567,
  "type": "application/pdf"
}
```

### List uploaded files for a unit

```bash
curl "http://localhost:3000/api/storage/list?bucket=notes&folder=semester-1/programming-in-c/functions-pointers-files"
```

### Delete a file

```bash
curl -X DELETE http://localhost:3000/api/storage/delete \
  -H "Content-Type: application/json" \
  -d '{"path":"semester-1/programming-in-c/functions-pointers-files/1718...-unit-1.pdf","bucket":"notes"}'
```

---

## Frontend linking

Once uploaded, link directly to:
```
https://yrahncykruiwkiwtxjlv.supabase.co/storage/v1/object/public/notes/<semester-key>/<subject-slug>/<unit-slug>/<filename>.pdf
```

The current UI renders `NoteItem.href`, so replace existing `href` values in content with these public URLs.

---

## Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Do not expose it in browser bundles.
- Vercel and `npm run build` are working.
- `next.config.ts` already allows `yrahncykruiwkiwtxjlv.supabase.co` for image optimization.
