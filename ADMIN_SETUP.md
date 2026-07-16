# Admin CMS + Supabase — Setup

The app works **without** any backend (falls back to bundled defaults). To enable the
admin CMS, activity management, and usage tracking, connect a Supabase project.

## 1. Create a Supabase project
Go to <https://supabase.com>, create a project. From **Project Settings → API** copy:
- Project URL
- `anon` public key
- `service_role` key (secret)

## 2. Run the schema
Open **SQL Editor** in the Supabase dashboard, paste the contents of
[`supabase/schema.sql`](supabase/schema.sql), and run it. This creates the tables
(`content`, `activities`, `invites`, `invite_events`), RLS policies, the
`get_invite` function, the public `activity-art` storage bucket, and seeds all
copy + the 4 default activities.

## 3. Admin password + session secret
```bash
# hash your chosen admin password
node scripts/hash-password.mjs "your-admin-password"

# generate a session secret
openssl rand -hex 32
```

## 4. Environment
Copy `.env.local.example` → `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD_HASH=<from step 3>
ADMIN_SESSION_SECRET=<from step 3>
```
Restart `npm run dev` after editing env.

## 5. Use it
- `/` — the receiver invitation (reads copy + activities from Supabase)
- `/buat` — sender builds an invite; **Buat Link** now saves it and produces a
  tracked `/?i=<id>` link (falls back to self-contained `/?d=` if Supabase is down)
- `/admin` — password-gated dashboard:
  - **Wording** — edit the key strings (per-screen title, subtitle, primary
    button, + page metadata). Other micro-copy stays in code; add its key to the
    `content` seed in `supabase/schema.sql` to make it editable too.
  - **Aktivitas** — add/edit/disable activities (label, lucide icon, uploaded image, color, order)
  - **Pengguna** — who created invites, whether opened, and whether they answered YA + their choices

## Notes
- Adding the backend means the app is **no longer static-exportable** — deploy to a
  Node runtime (Vercel, etc.). API routes + middleware require it.
- The `service_role` key is used only in server-side admin API routes; it is never
  shipped to the browser. Public pages use the `anon` key with RLS.
- Activity icons: the admin picks from a curated lucide set (see
  `src/lib/iconRegistry.js`); add more names there if needed.
