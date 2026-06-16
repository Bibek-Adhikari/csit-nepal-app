n # TODO - Supabase Storage Setup Continuation

## Step 1 ✅
Fix `src/app/api/storage/upload/route.ts` to accept `bucket` and `folder` from query params in addition to multipart formData.


## Step 2 ✅
Add a helper to build Supabase public URLs (notes + lectures) using `NEXT_PUBLIC_SUPABASE_URL`.


## Step 3 ✅
Replace note `href` values in all `src/content/subjects/semester-*/index.ts` files with public Supabase URLs matching:
`notes/<semester-key>/<subject-slug>/<unit-slug>/<filename>`




## Step 4 ✅
Check lecture linking (`src/content/lectures.ts` and lecture pages). If needed, replace lecture URLs to `lectures` bucket public URLs.

## Step 5 ✅
Run `npm run build` and sanity-check:
- curl upload with query params works
- unit page PDF links open


