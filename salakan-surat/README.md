# Surat Pengantar — DK V Salakan

Sistem pengajuan Surat Pengantar online berbasis **Astro + Astro DB (Turso) + Keystatic**.

---

## Stack

| Layer | Teknologi | Keterangan |
|-------|-----------|------------|
| Framework | Astro 4 (SSR) | Output server + API routes |
| Database | Astro DB / libsql (Turso) | Simpan pengajuan warga — gratis tier |
| CMS / Config | Keystatic | Kelola data RT, nama ketua, dll |
| Hosting | Vercel / Netlify / VPS | Kompatibel semua adapter |

---

## Struktur File

```
src/
├── pages/
│   ├── surat-pengantar.astro     ← Form publik untuk warga
│   ├── admin/
│   │   └── pengajuan.astro       ← Dashboard admin (lihat & kelola)
│   └── api/
│       ├── pengajuan.ts          ← POST (terima) + GET (list)
│       └── pengajuan/[id].ts     ← PATCH (update status)
├── content/
│   ├── config.ts                 ← Zod schema untuk Keystatic
│   ├── pengaturan/
│   │   └── index.json            ← Nama dukuh, kalurahan, dll
│   └── rt/
│       ├── rt-01.json            ← Data RT 01
│       └── rt-05.json            ← Data RT 05 (Ma'ruf Cahyadi)
db/
└── config.ts                     ← Skema tabel Astro DB
keystatic.config.tsx              ← Konfigurasi Keystatic UI
astro.config.mjs                  ← Astro integrations
```

---

## Setup Awal

### 1. Install dependencies

```bash
npm install
```

### 2. Setup Astro DB (Turso)

```bash
# Login ke Astro Studio (sekali)
npx astro login

# Push skema ke database
npm run db:push
```

Untuk **production** dengan Turso langsung:
```bash
# Install Turso CLI
curl -sSfL https://get.turso.tech/install.sh | bash

# Buat database
turso db create salakan-surat

# Ambil URL & token
turso db show salakan-surat --url
turso db tokens create salakan-surat
```

Tambahkan ke `.env`:
```
ASTRO_DB_REMOTE_URL=libsql://salakan-surat-xxx.turso.io
ASTRO_DB_APP_TOKEN=eyJhbGci...
```

### 3. Jalankan dev server

```bash
npm run dev
```

Akses:
- Form warga → http://localhost:4321/surat-pengantar
- Admin pengajuan → http://localhost:4321/admin/pengajuan
- Keystatic CMS → http://localhost:4321/keystatic

---

## Menambah / Edit Data RT

1. Buka `/keystatic` di browser
2. Klik **Daftar RT** → **Tambah RT baru**
3. Isi: ID RT, Nomor RT, Nama Ketua, No. HP
4. Simpan → otomatis tersimpan ke `src/content/rt/`

File JSON RT bisa juga diedit langsung:

```json
// src/content/rt/rt-05.json
{
  "rt_id": "rt-05",
  "nomor_rt": "05",
  "nama_ketua": "Ma'ruf Cahyadi",
  "no_hp_ketua": "0812...",
  "aktif": true,
  "catatan": ""
}
```

---

## Format Nomor Surat

```
001/RT-05/DkV/2025
 ↑     ↑    ↑   ↑
 │     │    │   Tahun
 │     │    Kode dukuh (dari pengaturan)
 │     Nomor RT
 Urutan (reset tiap tahun, per RT)
```

Counter nomor urut tersimpan di tabel `NomorUrut` di database.
Setiap RT punya counter sendiri yang reset otomatis tiap tahun baru.

---

## Deploy ke Vercel

```bash
# Ganti adapter di astro.config.mjs:
# import vercel from '@astrojs/vercel/serverless';
# adapter: vercel()

npm run build
vercel deploy
```

Set environment variables di Vercel dashboard:
- `ASTRO_DB_REMOTE_URL`
- `ASTRO_DB_APP_TOKEN`

---

## Catatan Keamanan

Halaman `/admin/pengajuan` saat ini **tidak ada autentikasi**.
Untuk production, tambahkan middleware Astro:

```ts
// src/middleware.ts
export function onRequest({ request, redirect }) {
  const url = new URL(request.url);
  if (url.pathname.startsWith('/admin')) {
    // Cek session / cookie / basic auth
  }
}
```

Atau gunakan Netlify/Vercel password protection untuk path `/admin/*`.
