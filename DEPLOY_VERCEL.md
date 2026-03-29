# Deploy ke Vercel

Panduan singkat ini dipakai untuk production website Padukuhan Salakan.

## 1. Hubungkan repo ke Vercel

- Import project dari GitHub/Git provider Anda.
- Framework akan terdeteksi sebagai `Astro`.
- Build command: `npm run build`
- Install command: `npm install`

## 2. Isi Environment Variables

Gunakan salah satu mode login berikut:

### Opsi A: Multi-user production

Rekomendasi untuk production:

```env
ADMIN_USERS_JSON=[{"username":"superadmin","password":"ganti-password-kuat","role":"superadmin"},{"username":"admin1","password":"ganti-password-admin","role":"admin"},{"username":"editor1","password":"ganti-password-editor","role":"editor"}]
SKIP_KEYSTATIC=false
```

### Opsi B: Single-user fallback

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ganti-dengan-password-kuat
ADMIN_ROLE=superadmin
SKIP_KEYSTATIC=false
```

## 3. Catatan penting untuk Keystatic

Saat ini storage Keystatic masih `local`.

Artinya:
- website publik aman untuk deploy
- login admin tetap bisa tampil
- tetapi editing production tidak ideal untuk dipakai jangka panjang di Vercel

Untuk CMS production yang benar-benar persisten, langkah berikutnya adalah pindah ke:
- `GitHub` storage mode, atau
- `Cloud` mode Keystatic

## 3a. Keamanan login production

- Gunakan `ADMIN_USERS_JSON` di Vercel sebagai sumber utama login.
- Data singleton `Akun Admin` sekarang tidak lagi diprioritaskan jika env admin tersedia.
- Default konten `Akun Admin` di repo sudah dibuat nonaktif agar tidak ikut terbawa sebagai akun production.
- Jangan aktifkan `Gunakan akun dari Keystatic` sebelum seluruh akun placeholder diganti.

## 4. Checklist setelah preview deploy

- Cek `/`
- Cek `/berita`
- Cek `/agenda`
- Cek `/data`
- Cek `/admin/login`
- Cek `/keystatic`
- Cek `/rss/berita.xml`
- Cek `/rss/pengumuman.xml`
- Cek `/sitemap-index.xml`

## 5. Checklist keamanan

- Pastikan password contoh sudah diganti.
- Pastikan `Akun Admin` di Keystatic tidak memakai kredensial placeholder.
- Pastikan editor hanya melihat `Editorial` dan `Data Kampung`.
- Pastikan route admin tidak masuk sitemap.
