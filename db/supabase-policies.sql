-- Policy Supabase yang aman untuk arsitektur salakanid saat ini
-- Prinsip:
-- - Browser/publishable key hanya boleh baca log publik yang statusnya publish
-- - Semua operasi tulis admin dilakukan dari server menggunakan service role key
-- - Tabel Pengajuan dan NomorUrut tidak dibuka untuk client publik

begin;

alter table public."Pengajuan" enable row level security;
alter table public."NomorUrut" enable row level security;
alter table public."LogKegiatanDukuh" enable row level security;

drop policy if exists "Public read published logs" on public."LogKegiatanDukuh";
create policy "Public read published logs"
on public."LogKegiatanDukuh"
for select
to public
using (status_publikasi = 'publish');

commit;
