# Peta Style, Layout, dan Komponen

Dokumen ini menjaga arah refactor UI tetap konservatif: komponen dipakai untuk pola yang berulang, sedangkan halaman tetap fokus pada data dan komposisi konten.

## Prinsip

- `PageHero` menjadi hero standar halaman publik, kecuali beranda yang memang punya kebutuhan naratif lebih besar.
- `PageSection` menjadi wrapper section publik dengan spacing default `py-10 sm:py-14` dan header yang aman di mobile.
- `InfoCard` menjadi kartu informasi publik yang ringan dan netral.
- `DashboardPanel` menjadi panel kaca khusus dashboard agar style dashboard tidak menular ke halaman publik.
- `DashboardStatCard` menjadi kartu angka dashboard untuk kas, inventaris, profil, dan ringkasan persuratan.
- `EmptyStateCard`, `PillFilterBar`, `ActionLinkButton`, `Breadcrumbs`, dan `Badge` tetap menjadi komponen kecil lintas halaman.

## Kepemilikan Layout

- Layout publik: `MainLayout`, `SiteHeader`, `MobileNav`, `SiteFooter`, `PageHero`, `PageSection`.
- Layout dashboard: `DashboardLayout`, `DashboardPanel`, `DashboardStatCard`.
- Listing publik: `NewsGrid`, `GalleryGrid`, kartu program, kartu UMKM, dan kartu dokumen.
- Detail publik: `Breadcrumbs`, `InfoCard`, `ActionLinkButton`, `ShareActions` jika dibutuhkan lagi.
- Ikon lokal: `src/lib/icons.ts` sebagai registry tunggal untuk nama ikon Material lama ke Lucide.

## Aturan Agar Tidak Bentrok

- Jangan pakai `DashboardPanel` di halaman publik.
- Jangan pakai style kaca dashboard untuk card publik biasa.
- Jangan menambahkan class card panjang berulang jika pola sudah ada di `InfoCard`, `DashboardPanel`, atau `DashboardStatCard`.
- Jangan menambahkan ikon baru langsung di halaman tanpa mengecek `src/lib/icons.ts`.
- Untuk section publik, mulai dari `PageSection`; override `sectionClass` hanya jika ada latar atau kebutuhan spacing nyata.
- Untuk konten kosong, pakai `EmptyStateCard`.
- Untuk filter horizontal, pakai `PillFilterBar` agar overflow mobile konsisten.

## Prioritas Refactor Berikutnya

- Satukan pola kartu listing publik: berita, galeri, dokumen, UMKM, dan program.
- Ekstrak `MetaRow` atau `IconText` untuk pola ikon kecil plus teks di halaman detail.
- Audit halaman detail publik agar semua breadcrumb memakai `Breadcrumbs`.
- Pindahkan copy dashboard yang masih statis ke singleton dashboard jika memang perlu bisa diedit dari PagesCMS.
- Pertimbangkan `PublicStatCard` khusus halaman profil/data jika kartu statistik publik makin sering berulang.
