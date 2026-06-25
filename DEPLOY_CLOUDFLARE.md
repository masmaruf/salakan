# Deploy ke Cloudflare Pages

Panduan singkat ini dipakai untuk mendeploy website Padukuhan Salakan ke Cloudflare Pages.

## 1. Persiapan Database (Astro DB) di Production

Cloudflare Pages berjalan pada serverless environment dengan sistem file read-only saat runtime.
Agar fitur **Pengajuan Surat** (yang menggunakan Astro DB) dapat menyimpan data di production:

1. **Gunakan Turso / LibSQL**: Buat database SQLite/LibSQL managed gratis di [Turso](https://turso.tech/).
2. Dapatkan **Database URL** dan **App Token** dari Turso.
3. Anda akan memasukkan nilai ini ke environment variable Cloudflare Pages (lihat langkah di bawah).
4. Saat build, Astro secara otomatis mendeteksi variabel ini dan menghubungkan query production ke Turso.

*Catatan: Jika Anda tidak mengatur database remote, Astro DB akan menggunakan database lokal saat build, namun tidak dapat menyimpan data pengajuan baru karena sistem file read-only saat runtime.*

---

## 2. Hubungkan Repo ke Cloudflare Pages

1. Masuk ke dashboard Cloudflare > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Pilih repositori GitHub Anda.
3. Di bagian **Build settings**:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build:remote`
   - **Build output directory**: `dist`

   > **Penting**: Gunakan `npm run build:remote` (bukan `npm run build`). Flag `--remote` memastikan Astro DB terhubung ke database Turso saat build, bukan menggunakan file lokal yang tidak didukung oleh environment Cloudflare.
4. Klik **Save and Deploy**.

---

## 3. Atur Environment Variables

Masuk ke dashboard Cloudflare Pages Anda, buka **Settings** > **Environment variables** > **Production** (dan Preview), tambahkan variabel berikut:

| Key | Value | Keterangan |
|---|---|---|
| `NODE_VERSION` | `20` (atau lebih tinggi) | Wajib untuk memastikan kompatibilitas build Astro |
| `ASTRO_DB_REMOTE_URL` | *`libsql://...`* | URL database Turso Anda |
| `ASTRO_DB_APP_TOKEN` | *`ey...`* | Token autentikasi database Turso |
| `SKIP_KEYSTATIC` | `false` | Set ke `true` jika ingin mematikan panel CMS admin |
| `ADMIN_USERS_JSON` | *`[{"username":"...","password":"...","role":"superadmin"}]`* | Rekomendasi akun admin login (format JSON array) |

### Alternatif Single-user Login (jika tidak menggunakan ADMIN_USERS_JSON):
- `ADMIN_USERNAME` = `admin`
- `ADMIN_PASSWORD` = *`ganti-dengan-password-sangat-kuat`*
- `ADMIN_ROLE` = `superadmin`

---

## 4. Konfigurasi Keystatic CMS

Saat ini storage Keystatic diatur ke mode `local`.
Artinya:
- Website dan panel admin bisa tampil dan diakses.
- Namun data konten yang diedit lewat CMS di production tidak akan tersimpan secara permanen karena keterbatasan serverless Cloudflare (read-only filesystem).

Untuk CMS production yang benar-benar persisten, langkah berikutnya adalah mengubah storage mode Keystatic di `src/lib/keystatic-config.ts` dari `local` menjadi:
- `github` mode (menyimpan langsung ke commit git di Github), atau
- Keystatic `cloud` mode.

---

## 5. Checklist Setelah Deploy

Buka alamat `<project-name>.pages.dev` dan periksa halaman berikut:
- Halaman Utama `/`
- Halaman Berita `/berita`
- Halaman Agenda `/agenda`
- Halaman Data `/data`
- Halaman Login Admin `/admin/login`
- Halaman CMS Keystatic `/keystatic`
- Feed RSS `/rss/berita.xml` dan `/rss/pengumuman.xml`
- Sitemap `/sitemap-index.xml`
