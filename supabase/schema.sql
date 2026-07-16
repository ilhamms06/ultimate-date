-- ============================================================
--  ultimate-date — Supabase schema
--  Run this in the Supabase dashboard → SQL Editor.
--  Safe to re-run (idempotent-ish: uses IF NOT EXISTS / upserts).
-- ============================================================

-- ---------- tables ----------
create table if not exists public.content (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id         text primary key,
  label      text not null,
  icon_name  text not null default 'Heart',
  image_url  text,
  bg         text not null default 'bg-linear-to-br from-pink-100 via-white to-rose-100',
  sort_order int  not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.invites (
  id         text primary key,
  to_name    text not null default '',
  config     jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.invite_events (
  id         uuid primary key default gen_random_uuid(),
  invite_id  text references public.invites(id) on delete cascade,
  type       text not null check (type in ('open','answer')),
  payload    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists invite_events_invite_id_idx on public.invite_events(invite_id);

-- ---------- row level security ----------
alter table public.content       enable row level security;
alter table public.activities    enable row level security;
alter table public.invites       enable row level security;
alter table public.invite_events enable row level security;

-- content: public read
drop policy if exists content_read on public.content;
create policy content_read on public.content for select to anon, authenticated using (true);

-- activities: public read of active rows only
drop policy if exists activities_read on public.activities;
create policy activities_read on public.activities for select to anon, authenticated using (active = true);

-- invites: anon may INSERT (id is generated client-side, no read-back needed).
-- Direct SELECT is intentionally NOT granted (prevents enumeration of names).
drop policy if exists invites_insert on public.invites;
create policy invites_insert on public.invites for insert to anon, authenticated with check (true);

-- invite_events: anon may INSERT only.
drop policy if exists invite_events_insert on public.invite_events;
create policy invite_events_insert on public.invite_events for insert to anon, authenticated with check (true);

-- fetch a single invite by id without exposing the whole table
create or replace function public.get_invite(p_id text)
returns table (id text, to_name text, config jsonb, created_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select id, to_name, config, created_at from public.invites where id = p_id;
$$;

grant execute on function public.get_invite(text) to anon, authenticated;

-- ---------- storage bucket for activity art ----------
insert into storage.buckets (id, name, public)
values ('activity-art', 'activity-art', true)
on conflict (id) do nothing;

-- public read of the bucket (uploads happen via service role, which bypasses RLS)
drop policy if exists activity_art_read on storage.objects;
create policy activity_art_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'activity-art');

-- ---------- seed: activities (current in-code catalog) ----------
insert into public.activities (id, label, icon_name, image_url, bg, sort_order, active) values
  ('dinner', 'Kencan Makan Malam', 'UtensilsCrossed', '/images/icon/dinner-date.png',    'bg-linear-to-br from-amber-100 via-orange-50 to-rose-100',    1, true),
  ('movie',  'Kencan Nonton',      'Clapperboard',    '/images/icon/movie-date.png',      'bg-linear-to-br from-violet-100 via-purple-50 to-fuchsia-100', 2, true),
  ('park',   'Jalan di Taman',     'Trees',           '/images/icon/park-date.png',       'bg-linear-to-br from-lime-100 via-green-50 to-emerald-100',   3, true),
  ('coffee', 'Kencan Ngopi',       'Coffee',          '/images/icon/coffe-date.png',      'bg-linear-to-br from-amber-200 via-orange-50 to-rose-100',    4, true)
on conflict (id) do nothing;

-- ---------- seed: content (all editable copy; only inserts missing keys) ----------
insert into public.content (key, value) values
  ('meta.title',              'Maukah Kamu Pergi Kencan Denganku?'),
  ('meta.description',        'Undangan kecil yang manis, khusus untukmu'),

  ('opening.greeting',        'Hei *{name}!*'),
  ('opening.subtitle',        'Ada yang penting yang mau aku tanyakan...'),
  ('opening.promise',         'Janji jangan pergi sebelum menjawab ya'),
  ('opening.ctaButton',       'Buka Pertanyaannya'),
  ('opening.rabbitAlt',       'Kelinci lucu membawa hati'),

  ('question.title',          'Maukah {name} pergi *kencan* denganku?'),
  ('question.subtitle',       'Cuma butuh satu jawaban kok, gampang kan?'),
  ('question.yesButton',      'YA'),
  ('question.noButton',       'TIDAK'),
  ('question.rabbitAlt',      'Kelinci lucu membawa hati'),
  ('question.tooltip.1',      'Yakin nih?'),
  ('question.tooltip.2',      'Coba pikir lagi... please?'),
  ('question.tooltip.3',      'Jawaban salah terdeteksi'),
  ('question.tooltip.4',      'Hatiku agak retak nih'),
  ('question.tooltip.5',      'Tombolnya menolak ditekan'),

  ('activity.title',          'Kencan seperti apa yang *seru*?'),
  ('activity.subtitle',       'Pilih suasana yang cocok dengan mood-mu dan mari buat tak terlupakan!'),
  ('activity.nextButton',     'Lanjut'),

  ('location.title',          'Mau *ke mana* kita?'),
  ('location.subtitle',       'Pilih tempat untuk mulai kencan kita'),
  ('location.nextButton',     'Jadi Kencan!'),

  ('datetime.title',          'Kapan kita *ketemu*?'),
  ('datetime.subtitle',       'Pilih hari, lalu waktunya.'),
  ('datetime.dayLabel',       'Pilih hari'),
  ('datetime.timeLabel',      'Pilih waktu'),
  ('datetime.today',          'Hari ini'),
  ('datetime.hint',           'Santai saja, momen yang tepat membuatnya lebih spesial.'),
  ('datetime.summaryFallback','Pilih hari & waktu'),
  ('datetime.nextButton',     'Jadi Kencan!'),

  ('final.title',             'Yeay, kita *fix* kencan!'),
  ('final.subtitle',          'Tinggal cus pas harinya, gak usah ribet mikir.'),
  ('final.rowActivity',       'Aktivitas'),
  ('final.rowLocation',       'Lokasi'),
  ('final.rowTime',           'Waktu'),
  ('final.saveButton',        'Catet di Kalender'),
  ('final.saveToast',         'Tersimpan ke kalender!'),
  ('final.restartLink',       'mulai ulang'),
  ('final.icsSummary',        'Kencan Kita - {activityLabel}'),
  ('final.icsDescription',    '{activityLabel} di {locationLabel}. Tidak sabar!'),

  ('setup.title',             'Bikin undangan *kencan*'),
  ('setup.subtitle',          'Atur pilihannya, lalu kirim link ke dia.'),
  ('setup.stepLabel',         'Langkah {step}'),
  ('setup.step1.title',       'Buat siapa nih?'),
  ('setup.step1.subtitle',    'Nama yang bakal muncul di undangannya.'),
  ('setup.step1.placeholder', 'Nama penerima…'),
  ('setup.step2.title',       'Pilihan aktivitas'),
  ('setup.step2.subtitle',    'Aktivitas apa aja yang bisa dia pilih.'),
  ('setup.step3.title',       'Tempatnya di mana?'),
  ('setup.step3.subtitle',    'Isi pilihan lokasi untuk tiap aktivitas.'),
  ('setup.step3.placeholder', 'Nama tempat…'),
  ('setup.step3.addButton',   'Tambah tempat'),
  ('setup.step3.removeAria',  'Hapus tempat'),
  ('setup.step4.todayShort',  'Ini'),
  ('setup.step4.title',       'Kapan kamu bisa?'),
  ('setup.step4.subtitle',    'Pilih hari & jam yang kamu available.'),
  ('setup.step4.dayLabel',    'Hari'),
  ('setup.step4.timeLabel',   'Jam'),
  ('setup.generateButton',    'Buat Link Undangan'),
  ('setup.generatingButton',  'Membuat…'),
  ('setup.missingPrefix',     'Lengkapi dulu: {list}.'),
  ('setup.result.title',      'Link siap dibagikan!'),
  ('setup.result.copy',       'Salin'),
  ('setup.result.copied',     'Tersalin!'),
  ('setup.result.share',      'Bagikan'),
  ('setup.result.preview',    'Lihat pratinjau undangan'),
  ('setup.share.title',       'Undangan Kencan'),
  ('setup.share.text',        'Hei {name}, ada sesuatu buat kamu')
on conflict (key) do nothing;
