# Website Padukuhan Salakan

Website portal warga berbasis Astro dengan Keystatic CMS untuk mengelola pengumuman, berita/kegiatan, galeri, dan informasi profil padukuhan.

## Menjalankan project

```bash
npm install
npm run dev
```

Panel admin dibuka melalui `/admin/login`, lalu setelah berhasil login pengguna akan diarahkan ke `/keystatic`.

## Proteksi admin `/keystatic`

Salin `.env.example` menjadi `.env`, lalu isi kredensial admin. Untuk multi-user dengan role, gunakan `ADMIN_USERS_JSON`:

```bash
ADMIN_USERS_JSON=[{"username":"superadmin","password":"kata-sandi-superadmin","role":"superadmin"},{"username":"admin1","password":"kata-sandi-admin","role":"admin"},{"username":"editor1","password":"kata-sandi-editor","role":"editor"}]
```

Jika `ADMIN_USERS_JSON` tidak diisi, sistem akan fallback ke:

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=kata-sandi-yang-kuat
ADMIN_ROLE=superadmin
```

Proteksi ini berlaku untuk `/keystatic`, `/api/keystatic`, dan halaman admin terkait, dengan halaman login khusus di `/admin/login`. Halaman `/admin/users` hanya bisa dibuka oleh `superadmin`.

Jika ingin mengelola akun langsung dari `/keystatic`, gunakan singleton `Akun Admin`, lalu aktifkan opsi `Gunakan akun dari Keystatic`. Saat opsi ini aktif dan ada akun aktif di daftar user, sistem login akan membaca akun dari singleton tersebut. Jika tidak aktif, sistem tetap fallback ke environment variable.

## Konten yang dikelola

- `pengumuman`: info prioritas warga.
- `kegiatan`: berita dan artikel warga.
- `agenda`: agenda kegiatan mendatang.
- `galeri`: dokumentasi visual.
- `profil`: identitas dan data wilayah.
- `pengaturan`: alamat, kontak, jam layanan, dan sambutan beranda.
- `layanan-warga`: alur dan informasi layanan warga.
- `faq`: pertanyaan yang sering diajukan.

## Catatan deploy Vercel

- Untuk deploy situs publik tanpa admin lokal, set environment variable `SKIP_KEYSTATIC=true`.
- Jika CMS tetap diaktifkan di Vercel, isi `ADMIN_USERS_JSON` atau kombinasi `ADMIN_USERNAME`, `ADMIN_PASSWORD`, dan `ADMIN_ROLE` di Project Settings > Environment Variables.
- Untuk production, disarankan memakai `ADMIN_USERS_JSON` agar role `superadmin`, `admin`, dan `editor` lebih mudah dikontrol.
- Environment variable sekarang diprioritaskan di atas singleton `Akun Admin`, jadi kredensial production dari Vercel tidak akan tertimpa oleh data konten lokal.
- Jika singleton `Akun Admin` ingin dipakai, aktifkan hanya setelah akun production yang valid sudah tersimpan. Untuk production, env tetap lebih aman sebagai sumber utama.
- Jika ingin CMS aktif di environment ter-deploy, storage Keystatic perlu diganti dari `local` ke mode GitHub/Cloud sesuai kredensial yang dimiliki.
- Panduan ringkas deploy ada di [DEPLOY_VERCEL.md](C:/Users/maruf/OneDrive/Dokumenku/New%20project/DEPLOY_VERCEL.md).
