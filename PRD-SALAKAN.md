# Product Requirements Document (PRD): Salakan.id

## 1. Product Overview

**Nama Produk:** Portal Informasi Padukuhan Salakan (salakan.id)

**Visi Produk:** Menjadi pusat informasi digital yang transparan, interaktif, dan mudah diakses bagi warga Salakan dan masyarakat luas, serta menjadi ruang pameran potensi dan program padukuhan.

---

## 2. Target Pengguna (User Personas)

### Warga Salakan
- **Kebutuhan:** Mencari informasi jadwal kegiatan (ronda, posyandu, pertemuan RT), membaca berita terkini, dan melihat transparansi program kerja
- **Karakteristik:** Umumnya mengakses melalui smartphone, membutuhkan informasi yang cepat dan mudah dipahami

### Masyarakat Luar / Pihak Eksternal
- **Kebutuhan:** Mengetahui profil padukuhan, potensi desa, dan dokumentasi kegiatan (berguna untuk pelaporan ke tingkat Kalurahan/Kabupaten)
- **Karakteristik:** Membutuhkan informasi resmi yang terverifikasi

### Admin (Pak Dukuh & Pengurus)
- **Kebutuhan:** Memperbarui konten, jadwal, dan berita secara berkala melalui dashboard (CMS sederhana)
- **Karakteristik:** Tidak selalu melek teknologi, membutuhkan interface yang intuitif

---

## 3. Fitur Utama (Core Features)

### 3.1 Berita & Artikel
- Sistem publikasi berita (CMS-driven) tentang pengumuman, liputan kegiatan, dan informasi penting
- Kategori: Pengumuman, Liputan Kegiatan, Opini/Artikel
- Search dan filter berdasarkan kategori dan tanggal

### 3.2 Profil "Pak Dukuh" & Aparatur
- Halaman khusus yang menampilkan sambutan, profil Dukuh, dan jajaran pengurus
- Foto resmi dan deskripsi tugas masing-masing pengurus
- Kontak langsung (WhatsApp/Telepon)

### 3.3 Struktur Organisasi & Lembaga
- Informasi mengenai RT, RW, PKK, Karang Taruna, dan lembaga tingkat padukuhan lainnya
- Bagan organisasi yang responsif
- Profil masing-masing lembaga

### 3.4 Program & Pembangunan
- Tracker atau etalase program kerja padukuhan
- Contoh: update pembangunan talud RT 03, progres "Kampung Berdaya"
- Status: Rencana, Berjalan, Selesai
- Anggaran dan sumber dana (jika transparan)

### 3.5 Jadwal Masyarakat (Agenda)
- Kalender kegiatan interaktif
- Menampilkan jadwal posyandu, pertemuan warga, gotong royong, dll
- Notifikasi/reminder (melalui website)
- Integrasi dengan WhatsApp group

### 3.6 Galeri Visual
- Menampilkan foto dan dokumentasi kegiatan padukuhan
- Kategori: Kegiatan, Infrastruktur, Potensi Desa
- Album terorganisir berdasarkan acara/kegiatan

---

## 4. Spesifikasi Teknologi (Tech Stack)

### 4.1 Frontend
- **Framework:** Astro (SSR / Hybrid mode)
- **Rationale:** Sangat optimal untuk website content-heavy dan memastikan SEO maksimal
- **Styling:** Tailwind CSS
- **Rationale:** Untuk UI yang mobile-friendly dan rapid prototyping

### 4.2 Backend & Database
- **Database:** Cloudflare D1 (Serverless SQLite)
- **Rationale:** Cocok untuk relasional data seperti Berita, Jadwal, dan Struktur Pengurus
- **Note:** JANGAN simpan file foto di D1

### 4.3 Storage
- **Rekomendasi:** Cloudflare R2 (Object Storage)
- **Rationale:** Catatan penting: Gunakan R2 untuk menyimpan aset foto Galeri dan Berita agar performa D1 tetap optimal

### 4.4 Deployment & Hosting
- **Platform:** Cloudflare Pages
- **Rationale:** Terintegrasi langsung dengan GitHub/GitLab

---

## 5. Struktur Website (Sitemap)

Struktur ini dibuat agar warga bisa menemukan informasi dengan maksimal 2-3 kali klik.

```
🏠 Beranda (Home)
├── Hero Banner (Foto ikonik Salakan + Tagline)
├── Highlight Berita Terbaru (3 post terakhir)
├── Quick Access: Jadwal Minggu Ini & Pengumuman Penting
└── Sekilas Profil & Sambutan Pak Dukuh

📖 Profil
├── Sejarah & Visi Misi
├── Profil Pak Dukuh (Sambutan, Tugas, & Fungsi)
├── Struktur Pengurus (Bagan Organisasi)
└── Lembaga (RT, RW, PKK, Karang Taruna, dll)

📰 Kabar Salakan (Berita)
├── List Berita / Blog
└── Kategori: Pengumuman, Liputan Kegiatan, Opini/Artikel

🗓️ Agenda & Layanan
├── Jadwal Kegiatan Masyarakat (Tampilan List/Kalender)
└── Informasi Layanan Administrasi (Syarat bikin pengantar, dll)

🚀 Program Kerja
└── Daftar program berjalan & selesai (Infrastruktur, Pemberdayaan, dll)

📸 Galeri
└── Grid Foto kegiatan padukuhan

📞 Kontak & Pengaduan
├── Lokasi (Embed Google Maps Dukuh Salakan)
└── Formulir Kontak / Link ke WhatsApp Pelayanan
```

---

## 6. Rencana UI/UX & Desain Interaksi

### 6.1 Prinsip Desain (Design Principles)

#### Mobile-First Design
- Karena 80-90% warga akan mengakses lewat smartphone (WhatsApp link sharing)
- Tap-targets (tombol) harus besar
- Ukuran font (minimal 16px) harus mudah dibaca oleh warga sepuh (lansia)

#### Clear Typography & Contrast
- Gunakan font sans-serif yang bersih (seperti Inter atau Plus Jakarta Sans)
- Kontras warna teks dan background harus tinggi
- Hierarki informasi yang jelas

#### Local yet Modern
- Bawa nuansa Bantul/Jogja (misal sentuhan motif batik tipis di footer atau warna earth-tone seperti hijau sage/terakota)
- Layout bersih ala startup
- Warna utama: Hijau (alam), Coklat (bumi), Putih (kesederhanaan)

### 6.2 Wireframe / Layouting Utama (Tampilan Mobile)

#### A. Beranda (Home)

**Header:**
- Logo Salakan.id di kiri
- Hamburger menu di kanan
- Saat di-scroll, header sticky dengan warna latar putih solid

**Hero Section:**
- Foto lebar suasana Salakan/kegiatan warga
- Teks sapaan besar: "Selamat Datang di Portal Resmi Salakan"
- Call-to-action: "Lihat Jadwal" dan "Baca Berita"

**Quick Menu (Icon Grid 2x2):**
- 4 Tombol cepat di bawah Hero
- UX pattern yang familiar untuk warga (mirip aplikasi Gojek/Pemerintah)
- Icon: Agenda, Berita, Layanan, Galeri

**Section Agenda Terdekat:**
- Card melayang menampilkan 1-2 kegiatan terdekat
- Contoh: "Jumat, 26 Juni: Kerja Bakti RT 03"
- Tombol "Lihat Semua"

**Section Kabar Terbaru:**
- Carousel/List vertikal berita terbaru
- Thumbnail di sebelah kiri
- Judul dan ringkasan di sebelah kanan

#### B. Halaman Profil & Pak Dukuh

**Profil Pak Dukuh:**
- Foto potret resmi/profesional Pak Dukuh
- Tipografi kutipan sapaan yang di-highlight
- Deskripsi tugas dan fungsi

**Struktur Pengurus:**
- Di layar mobile, hindari bagan menyamping (horizontal scroll membingungkan warga)
- Gunakan model Accordion (bisa di-klik untuk membuka detail pengurus tiap divisi/lembaga)
- Atau daftar vertikal berjenjang
- Setiap entry: Foto + Nama + Jabatan + Kontak

#### C. Halaman Agenda / Jadwal Masyarakat

**Layout:**
- Alih-alih menggunakan desain kalender kotak-kotak (grid calendar) yang sulit dibaca di HP
- Gunakan Timeline Layout atau List View berurutan berdasarkan tanggal terdekat
- Setiap item: Tanggal,Jam | Judul Kegiatan | Lokasi | Kategori

**Kategori Warna:**
- Merah = Posyandu
- Hijau = Pertemuan RT
- Biru = Kerja Bakti
- Kuning = Kegiatan Sosial
- Ungu = Acara Agama

**Filter:**
- Filter berdasarkan kategori
- Filter berdasarkan bulan
- Search kegiatan

---

## 7. Prioritas Pengembangan

### Phase 1 (MVP - 2 minggu)
1. ✅ Struktur dasar website dengan Astro
2. ✅ Halaman Beranda dengan Hero dan Quick Menu
3. ✅ Sistem Berita (CMS)
4. ✅ Halaman Profil dasar
5. ✅ Struktur Organisasi

### Phase 2 (3 minggu)
1. Agenda & Jadwal
2. Galeri Foto
3. Halaman Kontak
4. Formulir Pengaduan sederhana

### Phase 3 (2 minggu)
1. Program & Pembangunan tracker
2. Layanan Administrasi
3. Pencarian global
4. Notifikasi WhatsApp

---

## 8. Referensi & Inspirasi

- Website Desa Digital: desadigital.id
- Portal Desa Kemendesa: portal.desa.id
- Template: HTML5 UP, Tailwind UI
- Warna: Palette warna alam Jogja

---

## 9. Catatan Tambahan

- Pastikan semua teks menggunakan bahasa Indonesia yang baik dan benar
- Gunakan istilah-istilah yang familiar bagi warga (contoh: "Pak RT" bukan "Ketua RT")
- Optimalkan untuk koneksi internet lambat (lazy loading images)
- Accessibility: Pastikan website bisa diakses oleh semua kalangan

---

*Dokumen ini dibuat untuk memandu pengembangan Portal Informasi Padukuhan Salakan*
*Versi: 1.0*
*Tanggal: 24 Juni 2026*
