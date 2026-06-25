# Style Guide — Padukuhan Salakan

Panduan desain untuk menjaga konsistensi tampilan di seluruh halaman website portal Padukuhan Salakan. Berdasarkan **Material You (M3)** design system yang diadaptasi untuk Tailwind CSS v4 + DaisyUI v5.

---

## Warna (Color Tokens)

Warna didefinisikan di `src/styles/global.css` dalam blok `@theme`. Gunakan nama token Tailwind, bukan hex langsung.

### Surface & Background

| Token | Tailwind Class | Kegunaan |
|-------|---------------|----------|
| `surface` | `bg-surface` | Background utama body |
| `surface-container-lowest` | `bg-surface-container-lowest` | Card utama, elemen menonjol |
| `surface-container-low` | `bg-surface-container-low` | Section background alternatif |
| `surface-container` | `bg-surface-container` | Container level sedang |
| `surface-container-high` | `bg-surface-container-high` | Icon background, dot, divider kuat |

### Text

| Token | Tailwind Class | Kegunaan |
|-------|---------------|----------|
| `on-surface` | `text-on-surface` | Heading, teks utama |
| `on-surface-variant` | `text-on-surface-variant` | Body text, deskripsi |
| `outline` | `text-outline` | Teks sekunder (tanggal, meta) |

### Primary (Biru)

| Token | Tailwind Class | Kegunaan |
|-------|---------------|----------|
| `m3-primary` | `text-m3-primary`, `bg-m3-primary` | Link, icon aksen, button solid |
| `on-primary` | `text-on-primary` | Teks di atas bg-m3-primary |
| `primary-container` | `bg-primary-container` | Badge, chip, icon bg soft |
| `on-primary-container` | `text-on-primary-container` | Teks di atas primary-container |

### Error (Merah)

| Token | Tailwind Class | Kegunaan |
|-------|---------------|----------|
| `m3-error` | `text-m3-error`, `bg-m3-error` | Status error, timeline dot pengumuman |
| `error-container` | `bg-error-container` | Badge pengumuman |
| `on-error-container` | `text-on-error-container` | Teks badge pengumuman |

### Border

| Token | Tailwind Class | Kegunaan |
|-------|---------------|----------|
| `outline-variant` | `border-outline-variant` | Border card, divider ringan |
| `outline-variant/40` | `border-outline-variant/40` | Divider sangat ringan (separator dalam card) |

> **Catatan:** Gunakan `m3-primary`, `m3-secondary`, `m3-tertiary`, `m3-error` untuk menghindari konflik dengan warna DaisyUI bawaan.

---

## Tipografi

Font utama: **Plus Jakarta Sans** → Inter → sans-serif.

### Heading

| Ukuran | Class | Konteks |
|--------|-------|---------|
| 28px/36px | `text-[28px] font-bold leading-[36px] text-on-surface` | Page title (h1) |
| 24px/32px | `text-[24px] font-bold leading-[32px] text-on-surface` | Section title (h2) |
| 20px | `text-[20px] font-bold text-on-surface` | Subsection title |
| 16–18px | `text-base font-bold text-on-surface sm:text-lg` | Card title (h3) |

### Body

| Class | Konteks |
|-------|---------|
| `text-base text-on-surface-variant` | Deskripsi halaman, paragraf |
| `text-sm text-on-surface-variant` | Body card, ringkasan |
| `text-[12px] font-medium text-outline` | Meta (tanggal, ID, label kecil) |

---

## Layout

### Container

```html
<div class="container-premium">...</div>
```

Max width: `1200px`, padding inline: `1rem` (mobile: `0.75rem`). Selalu gunakan `container-premium`, bukan `.container`.

### Page Structure

```html
<!-- Page Header -->
<div class="container-premium pt-8 pb-4">
  <h1 class="text-[28px] font-bold leading-[36px] text-on-surface">Judul Halaman</h1>
  <p class="text-base text-on-surface-variant mt-1">Deskripsi singkat.</p>
</div>

<!-- Content Section -->
<section class="container-premium py-8">
  ...konten...
</section>

<!-- Alt Background Section -->
<section class="py-10 bg-surface-container-low/40">
  <div class="container-premium">
    ...konten...
  </div>
</section>
```

---

## Komponen

### Card

```html
<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-md">
  ...
</div>
```

Properti kunci:
- Background: `bg-surface-container-lowest`
- Border: `border border-outline-variant`
- Radius: `rounded-xl`
- Shadow: `shadow-[0_4px_12px_rgba(15,23,42,0.05)]`
- Hover: `hover:-translate-y-0.5 hover:shadow-md`
- Active: `active:scale-[0.98]` (untuk card yang bisa diklik)

### Badge / Chip

```html
<!-- Primary -->
<span class="text-[12px] font-semibold px-2 py-1 rounded-md bg-primary-container text-on-primary-container">Label</span>

<!-- Error / Pengumuman -->
<span class="text-[12px] font-semibold px-2 py-1 rounded-md bg-error-container text-on-error-container">Pengumuman</span>

<!-- Neutral -->
<span class="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant border border-outline-variant">Tag</span>

<!-- Unggulan -->
<span class="text-[12px] font-semibold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
  <span class="material-symbols-outlined text-[12px]">star</span> Unggulan
</span>
```

### Breadcrumb

```html
<nav class="flex items-center gap-2 text-sm text-on-surface-variant mb-6" aria-label="Breadcrumb">
  <a href="/" class="hover:text-m3-primary transition-colors">Beranda</a>
  <span class="material-symbols-outlined text-[16px] text-outline-variant">chevron_right</span>
  <a href="/berita" class="hover:text-m3-primary transition-colors">Berita</a>
  <span class="material-symbols-outlined text-[16px] text-outline-variant">chevron_right</span>
  <span class="text-on-surface font-medium truncate max-w-[200px]">Judul</span>
</nav>
```

Atau gunakan komponen `<Breadcrumbs items={[...]} />` dari `src/components/ui/Breadcrumbs.astro`.

### Icon

Gunakan **Material Symbols Outlined** dari Google Fonts. Ukuran icon mengikuti konteks:

| Konteks | Class |
|---------|-------|
| Inline text (meta, label) | `text-[14px]` |
| Button, breadcrumb | `text-[16px]`–`text-[18px]` |
| Card icon (dalam circle bg) | `text-[20px]`–`text-[22px]` |
| Large decorative | `text-[48px]` |

Icon background circle:

```html
<div class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-container/30 text-m3-primary">
  <span class="material-symbols-outlined text-[20px]">description</span>
</div>
```

Varian square:

```html
<div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-container/30 text-m3-primary">
  <span class="material-symbols-outlined text-[22px]">event</span>
</div>
```

### Info Card (Key-Value)

```html
<div class="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
  <div class="flex items-center gap-2 text-on-surface-variant text-[12px] font-semibold uppercase tracking-wider mb-1.5">
    <span class="material-symbols-outlined text-[16px] text-m3-primary">calendar_today</span>
    Label
  </div>
  <p class="text-sm font-bold text-on-surface">Value</p>
</div>
```

### Button

```html
<!-- Primary (solid) -->
<a class="inline-flex items-center gap-2 rounded-xl bg-m3-primary px-5 py-3 text-sm font-semibold text-on-primary transition-all hover:-translate-y-0.5 hover:shadow-md" href="#">
  <span class="material-symbols-outlined text-[18px]">download</span> Label
</a>

<!-- Secondary (outline) -->
<a class="inline-flex items-center gap-2 rounded-xl bg-surface-container-lowest border border-outline-variant px-5 py-3 text-sm font-semibold text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors" href="#">
  <span class="material-symbols-outlined text-[18px]">arrow_back</span> Kembali
</a>

<!-- Text link -->
<a class="text-sm font-semibold text-m3-primary hover:underline transition-colors" href="#">
  Lihat semua
</a>
```

### Section Heading

```html
<div class="flex items-center justify-between mb-6">
  <h2 class="text-[24px] font-bold leading-[32px] text-on-surface">Judul Section</h2>
  <a class="text-sm font-semibold text-m3-primary hover:underline" href="#">Lihat semua</a>
</div>
```

Atau gunakan `<SectionHeading title="..." description="..." href="..." linkLabel="..." />`.

---

## Grid & Responsif

### Card Grid

```html
<!-- 1 → 2 → 3 kolom -->
<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">...</div>

<!-- 1 → 2 kolom -->
<div class="grid gap-4 lg:grid-cols-2">...</div>
```

### Mobile Bottom Nav

File: `src/components/MobileNav.astro`. Tampil hanya di mobile (`md:hidden`). Body perlu `pb-16 md:pb-0` untuk spacing.

---

## Pattern Spesifik

### Timeline

```html
<div class="relative pl-4 sm:pl-5 border-l-2 border-surface-container-high space-y-5">
  <a class="group relative block pl-5 sm:pl-6">
    <!-- Dot -->
    <div class="absolute -left-[11px] top-2 w-4 h-4 rounded-full ring-4 ring-white bg-m3-primary"></div>
    <!-- Card -->
    <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 ...">
      ...
    </div>
  </a>
</div>
```

Warna dot:
- `bg-m3-primary` — agenda
- `bg-m3-error` — pengumuman

### Card dengan Left Border Accent

```html
<div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
  <div class="border-l-4 border-l-m3-error p-5">
    ...
  </div>
</div>
```

### Details/Accordion

```html
<details class="group bg-surface-container-lowest border border-outline-variant rounded-xl transition-all hover:shadow-sm open:shadow-md">
  <summary class="cursor-pointer p-5 flex items-start gap-4 list-none">
    ...
    <span class="material-symbols-outlined text-[20px] text-outline shrink-0 transition-transform group-open:rotate-180">expand_more</span>
  </summary>
  <div class="px-5 pb-5">
    <div class="rounded-xl bg-surface-container-low/50 border border-outline-variant/40 p-4 text-sm text-on-surface-variant">
      ...
    </div>
  </div>
</details>
```

---

## File Penting

| File | Fungsi |
|------|--------|
| `src/styles/global.css` | Semua token warna M3, premium classes, base styles |
| `src/layouts/MainLayout.astro` | Wrapper semua halaman (Header, MobileNav, Footer) |
| `src/components/MobileNav.astro` | Bottom navigation mobile |
| `src/components/SiteHeader.astro` | Header + desktop nav |
| `src/components/SiteFooter.astro` | Footer dengan kontak |
| `src/components/NewsGrid.astro` | Grid kartu berita reusable |
| `src/components/GalleryGrid.astro` | Grid kartu galeri reusable |
| `src/components/ui/Breadcrumbs.astro` | Navigasi breadcrumb |
| `src/components/ui/DataCard.astro` | Card katalog data |
| `src/components/ui/LayananCard.astro` | Card layanan administrasi |
| `src/components/ui/StatCard.astro` | Card statistik angka |
| `src/components/SectionHeading.astro` | Heading section reusable |

---

## Jangan Gunakan

Kelas-kelas berikut adalah warisan desain lama dan **tidak boleh digunakan** di halaman baru:

- `surface-card`, `glass-card` — ganti dengan card pattern di atas
- `page-title`, `section-title`, `card-title` — ganti dengan class Tailwind langsung
- `text-body-lg`, `text-body-md`, `text-body-sm` — ganti `text-base`, `text-sm`
- `hero-title`, `text-gradient` — ganti heading pattern di atas
- `badge-premium`, `badge-blue`, `badge-emerald`, `badge-amber` — ganti badge pattern di atas
- `btn-premium`, `btn-premium-outline`, `btn-premium-ghost` — ganti button pattern di atas
- `rounded-[2.5rem]`, `rounded-[3rem]` — ganti `rounded-xl`
- `font-black` — ganti `font-bold`
- `text-9xl` (decorative icons) — hapus
- `card-premium` sebagai wrapper mega — ganti card pattern standar
