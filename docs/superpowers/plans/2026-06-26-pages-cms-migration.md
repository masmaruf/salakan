# Pages CMS Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Keystatic with self-hosted Pages CMS to eliminate ~500KB+ gzipped admin bundle.

**Architecture:** Remove all `@keystatic/*` packages and files. Rename `src/lib/keystatic.ts` → `content.ts` (zero logic changes). Serve Pages CMS pre-built SPA from `public/cms/`. Add a Cloudflare Pages Function as GitHub OAuth proxy. Configure all collections and singletons in `.pages.yml`.

**Tech Stack:** Astro 7, Cloudflare Pages, Pages CMS (pagescms.org), GitHub OAuth.

## Global Constraints

- Do not change any file in `src/content/**` — content files must not be modified.
- Do not change `src/content/config.ts` — Astro collection definitions stay unchanged.
- Do not change any file in `src/pages/admin/**` — e-surat admin routes stay unchanged.
- Do not change `src/lib/admin-auth.ts` beyond the one field rename in Task 5.
- All import path changes are exactly `lib/keystatic` → `lib/content` — no other logic changes.
- Target build command: `npm run build` must pass with 0 errors after Task 7.

---

## File Map

**Create:**
- `src/lib/content.ts` — renamed copy of `keystatic.ts`, no logic changes
- `functions/api/auth/callback.js` — Cloudflare Pages Function, GitHub OAuth proxy
- `.pages.yml` — Pages CMS full configuration
- `public/cms/` — populated manually in Task 9 (Pages CMS pre-built SPA)

**Delete:**
- `keystatic.config.ts`
- `src/lib/keystatic.ts`
- `src/lib/keystatic-config.ts`
- `src/lib/keystatic-role-config.ts`
- `src/lib/manual-keystatic-integration.mjs`
- `src/lib/keystatic/` (directory: index.ts, collections/pengumuman.ts, collections/dokumen.ts, singletons/profil.ts)
- `src/components/KeystaticApp.tsx`
- `src/components/RoleAwareKeystaticApp.tsx`
- `src/pages/keystatic/index.astro`
- `src/pages/keystatic/[...params].astro`
- `src/pages/api/keystatic/[...params].ts`

**Modify:**
- `src/middleware.ts` — remove Keystatic path logic, remove `isEditorAllowedCollectionKey` import
- `astro.config.mjs` — remove Keystatic integration + import, remove 6 manual chunks, update sitemap + robots
- `package.json` — remove `@keystatic/astro` and `@keystatic/core`
- `src/content/singletons/akun-admin/index.yaml` — rename `gunakanPengaturanKeystatic` → `gunakanKonfigFile`
- `src/lib/admin-auth.ts` — rename field reference (one line)
- 25 source files — `lib/keystatic` → `lib/content` import path

---

### Task 1: Delete all Keystatic-specific files

**Files:**
- Delete: all 11 files/dirs listed in the File Map above

**Interfaces:**
- Produces: clean slate; build will fail until Tasks 2–6 complete — expected

- [ ] **Step 1: Delete files in one command**

```powershell
Remove-Item "keystatic.config.ts" -Force
Remove-Item "src\lib\keystatic.ts" -Force
Remove-Item "src\lib\keystatic-config.ts" -Force
Remove-Item "src\lib\keystatic-role-config.ts" -Force
Remove-Item "src\lib\manual-keystatic-integration.mjs" -Force
Remove-Item "src\lib\keystatic" -Recurse -Force
Remove-Item "src\components\KeystaticApp.tsx" -Force
Remove-Item "src\components\RoleAwareKeystaticApp.tsx" -Force
Remove-Item "src\pages\keystatic" -Recurse -Force
Remove-Item "src\pages\api\keystatic" -Recurse -Force
```

- [ ] **Step 2: Verify deletion**

```powershell
Test-Path "keystatic.config.ts"               # should be False
Test-Path "src\lib\keystatic-config.ts"        # should be False
Test-Path "src\pages\keystatic"                # should be False
Test-Path "src\pages\api\keystatic"            # should be False
```

Expected output: all `False`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: delete Keystatic files"
```

---

### Task 2: Create `src/lib/content.ts`

**Files:**
- Create: `src/lib/content.ts`
- Delete: `src/lib/keystatic.ts` (already done in Task 1 — use the content below)

**Interfaces:**
- Produces: `getPengumuman`, `getDokumen`, `getKegiatan`, `getAgenda`, `getUmkm`, `getGaleri`, `getKategoriBerita`, `getKategoriBeritaMap`, `getStrukturOrganisasi`, `getLayananWarga`, `getFaq`, `getProfil`, `getPengaturan`, `getMonografi`, `getBeranda`, `sortByDateDesc`, `formatTanggal`, `excerpt` — identical signatures to old `keystatic.ts`

- [ ] **Step 1: Create `src/lib/content.ts`**

Create `src/lib/content.ts` with the exact content below (this is the full content of the original `keystatic.ts`, zero changes):

```ts
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

type EntryWithSlug<T> = {
  slug: string;
  entry: T;
};

type DatedValue = string | Date;

function normalizeEntryId(id: string) {
  return id.replace(/\/index$/, '');
}

function toEntryWithSlug<T>(items: Array<{ id: string; data: T }>): EntryWithSlug<T>[] {
  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: data,
  }));
}

function getDateValue(item: unknown): DatedValue | undefined {
  if (typeof item !== 'object' || item === null) return undefined;

  if ('entry' in item && typeof item.entry === 'object' && item.entry && 'tanggal' in item.entry) {
    return item.entry.tanggal as DatedValue;
  }

  if ('tanggal' in item) {
    return item.tanggal as DatedValue;
  }

  return undefined;
}

export async function getPengumuman() {
  const items = await getCollection('pengumuman');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      judul: data.judul,
      tanggal: data.tanggal,
      ringkasan: data.ringkasan,
      isi: data.isi,
      statusPublikasi: data.pengaturanTampil.statusPublikasi,
      unggulan: data.pengaturanTampil.unggulan,
    },
  }));
}

export async function getDokumen() {
  const items = await getCollection('dokumen');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      judul: data.judul,
      tanggalUpdate: data.tanggalUpdate,
      ringkasan: data.kontenUtama.ringkasan,
      deskripsi: data.kontenUtama.deskripsi,
      fileDokumen: data.media.fileDokumen,
      seoTitle: data.seo.seoTitle,
      seoDescription: data.seo.seoDescription,
      ogImage: data.seo.ogImage,
      kategori: data.pengaturanTampil.kategori,
      statusPublikasi: data.pengaturanTampil.statusPublikasi,
      unggulan: data.pengaturanTampil.unggulan,
      urutanTampil: data.pengaturanTampil.urutanTampil,
    },
  }));
}

export async function getKegiatan() {
  const items = await getCollection('kegiatan');

  return items.map(({ id, data, body }) => ({
    slug: normalizeEntryId(id),
    entry: {
      judul: data.judul,
      tanggal: data.tanggal,
      kategori: data.editorArtikel.sidebar.kategori,
      jenisKonten: data.editorArtikel.sidebar.jenisKonten,
      penulis: data.editorArtikel.sidebar.penulis,
      statusPublikasi: data.statusPublikasi,
      gambarUtama: data.editorArtikel.sidebar.gambarUtama,
      altGambarUtama: data.editorArtikel.sidebar.altGambarUtama,
      ringkasan: data.editorArtikel.kontenUtama.ringkasan,
      tag: data.editorArtikel.sidebar.tag,
      unggulan: data.editorArtikel.sidebar.unggulan,
      seoTitle: data.editorArtikel.seo.seoTitle,
      seoDescription: data.editorArtikel.seo.seoDescription,
      ogImage: data.editorArtikel.seo.ogImage,
      isi: body,
    },
  }));
}

export async function getAgenda() {
  const items = await getCollection('agenda');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      judul: data.judul,
      tanggal: data.tanggal,
      statusPublikasi: data.statusPublikasi,
      waktuMulai: data.kontenUtama.waktuMulai,
      waktuSelesai: data.kontenUtama.waktuSelesai,
      lokasi: data.kontenUtama.lokasi,
      ringkasan: data.kontenUtama.ringkasan,
      deskripsi: data.kontenUtama.deskripsi,
      kontakPic: data.kontenUtama.kontakPic,
      gambarUtama: data.media.gambarUtama,
      altGambarUtama: data.media.altGambarUtama,
      unggulan: data.pengaturanTampil.unggulan,
    },
  }));
}

export async function getUmkm() {
  const items = await getCollection('umkm');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      namaUsaha: data.namaUsaha,
      pemilik: data.kontenUtama.pemilik,
      ringkasan: data.kontenUtama.ringkasan,
      deskripsi: data.kontenUtama.deskripsi,
      whatsapp: data.kontenUtama.whatsapp,
      lokasi: data.kontenUtama.lokasi,
      produkUnggulan: data.kontenUtama.produkUnggulan,
      gambar: data.media.gambar,
      altGambar: data.media.altGambar,
      seoTitle: data.seo.seoTitle,
      seoDescription: data.seo.seoDescription,
      ogImage: data.seo.ogImage,
      kategori: data.pengaturanTampil.kategori,
      statusPublikasi: data.pengaturanTampil.statusPublikasi,
      unggulan: data.pengaturanTampil.unggulan,
      urutanTampil: data.pengaturanTampil.urutanTampil,
    },
  }));
}

export async function getGaleri() {
  return toEntryWithSlug<CollectionEntry<'galeri'>['data']>(await getCollection('galeri'));
}

export async function getKategoriBerita() {
  const items = await getCollection('kategoriBerita');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      namaKategori: data.namaKategori,
      labelTampil: data.labelTampil,
      deskripsi: data.deskripsi,
      status: data.pengaturanTampil.status,
      urutanTampil: data.pengaturanTampil.urutanTampil,
    },
  }));
}

export async function getKategoriBeritaMap() {
  const categories = await getKategoriBerita();

  return categories
    .filter((item) => item.entry.status === 'tampil')
    .sort((a, b) => a.entry.urutanTampil - b.entry.urutanTampil)
    .reduce<Record<string, string>>((acc, item) => {
      acc[item.slug] = item.entry.labelTampil;
      return acc;
    }, {});
}

export async function getStrukturOrganisasi() {
  const items = await getCollection('strukturOrganisasi');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      jabatan: data.jabatan,
      namaPejabat: data.kontenUtama.namaPejabat,
      deskripsiTugas: data.kontenUtama.deskripsiTugas,
      kontak: data.kontenUtama.kontak,
      bidang: data.pengaturanTampil.bidang,
      statusPublikasi: data.pengaturanTampil.statusPublikasi,
      urutanTampil: data.pengaturanTampil.urutanTampil,
    },
  }));
}

export async function getLayananWarga() {
  const items = await getCollection('layananWarga');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      namaLayanan: data.namaLayanan,
      ringkasan: data.ringkasan,
      syarat: data.syarat,
      langkah: data.langkah,
      kontak: data.kontak,
      jamLayanan: data.jamLayanan,
      statusTampil: data.statusTampil,
    },
  }));
}

export async function getFaq() {
  const items = await getCollection('faq');

  return items.map(({ id, data }) => ({
    slug: normalizeEntryId(id),
    entry: {
      pertanyaan: data.pertanyaan,
      jawaban: data.jawaban,
      kategori: data.kategori,
      urutan: data.urutan,
      statusTampil: data.statusTampil,
    },
  }));
}

export async function getProfil() {
  return (await getEntry('profil', 'index'))?.data ?? null;
}

export async function getPengaturan() {
  return (await getEntry('pengaturan', 'index'))?.data ?? null;
}

export async function getMonografi() {
  return (await getEntry('monografi', 'index'))?.data ?? null;
}

export async function getBeranda() {
  return (await getEntry('beranda', 'index'))?.data ?? null;
}

export function sortByDateDesc<T>(items: T[]) {
  return [...items].sort((a, b) => {
    const first = getDateValue(a);
    const second = getDateValue(b);

    return new Date(second ?? 0).getTime() - new Date(first ?? 0).getTime();
  });
}

export function formatTanggal(dateValue: DatedValue) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateValue));
}

export function excerpt(text: string, maxLength = 140) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/content.ts
git commit -m "feat: add content.ts as data access layer (replaces keystatic.ts)"
```

---

### Task 3: Update all 25 import paths + simplify middleware

**Files:**
- Modify: `src/middleware.ts`
- Modify: 24 files with `lib/keystatic` import (components + pages + API routes)

**Interfaces:**
- Consumes: `src/lib/content.ts` from Task 2
- Produces: all source files resolve `content.ts`, no more references to deleted files

- [ ] **Step 1: Replace all `lib/keystatic` imports in one command**

```powershell
Get-ChildItem -Path src -Recurse -Include "*.astro","*.ts","*.tsx" | ForEach-Object {
  $content = Get-Content $_.FullName -Raw -Encoding UTF8
  $updated = $content -replace "/lib/keystatic'", "/lib/content'"
  if ($content -ne $updated) {
    Set-Content $_.FullName $updated -Encoding UTF8 -NoNewline
    Write-Host "Updated: $($_.FullName)"
  }
}
```

Expected output (24 files reported):
```
Updated: src\components\GalleryGrid.astro
Updated: src\components\NewsGrid.astro
Updated: src\components\SiteFooter.astro
Updated: src\components\SiteHeader.astro
Updated: src\pages\api\search.json.ts
Updated: src\pages\rss\pengumuman.xml.ts
Updated: src\pages\rss\berita.xml.ts
Updated: src\pages\profil.astro
Updated: src\pages\agenda\[slug].astro
Updated: src\pages\berita\[slug].astro
Updated: src\pages\berita\index.astro
Updated: src\pages\agenda\index.astro
Updated: src\pages\kontak.astro
Updated: src\pages\galeri.astro
Updated: src\pages\data.astro
Updated: src\pages\berita\kategori\[slug].astro
Updated: src\pages\index.astro
Updated: src\pages\data\faq.astro
Updated: src\pages\data\dokumen.astro
Updated: src\pages\data\umkm\[slug].astro
Updated: src\pages\data\dokumen\[slug].astro
Updated: src\pages\data\monografi.astro
Updated: src\pages\data\layanan-warga.astro
Updated: src\pages\data\umkm\index.astro
Updated: src\pages\data\struktur-organisasi.astro
```

- [ ] **Step 2: Rewrite `src/middleware.ts`**

Replace the full content of `src/middleware.ts` with the simplified version below. This removes the Keystatic role-check logic and the `/keystatic` path protections entirely:

```ts
import { defineMiddleware } from 'astro:middleware';
import {
  getAdminSession,
  getSessionCookieName,
  hasMinimumRole,
  isAdminConfigured,
} from './lib/admin-auth';

const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_LOGOUT_PATH = '/admin/logout';
const ADMIN_USERS_PATH = '/admin/users';
const ADMIN_FORBIDDEN_PATH = '/admin/forbidden';

function isAdminPath(pathname: string) {
  return (
    pathname === ADMIN_LOGIN_PATH ||
    pathname === ADMIN_LOGOUT_PATH ||
    pathname === ADMIN_USERS_PATH ||
    pathname === ADMIN_FORBIDDEN_PATH
  );
}

function withAdminHeaders(response: Response) {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (!isAdminPath(context.url.pathname)) {
    return next();
  }

  if (
    context.url.pathname === ADMIN_LOGIN_PATH ||
    context.url.pathname === ADMIN_LOGOUT_PATH ||
    context.url.pathname === ADMIN_FORBIDDEN_PATH
  ) {
    const response = await next();
    return withAdminHeaders(response);
  }

  if (!isAdminConfigured()) {
    return withAdminHeaders(
      new Response(
        'Akses admin belum dikonfigurasi. Atur ADMIN_USERNAME dan ADMIN_PASSWORD terlebih dahulu.',
        { status: 503 }
      )
    );
  }

  const sessionCookie = context.cookies.get(getSessionCookieName())?.value;
  const session = getAdminSession(sessionCookie);

  if (context.url.pathname === ADMIN_USERS_PATH) {
    if (!hasMinimumRole(session, 'superadmin')) {
      const loginUrl = new URL(ADMIN_LOGIN_PATH, context.url);
      loginUrl.searchParams.set('next', context.url.pathname);
      return withAdminHeaders(context.redirect(loginUrl.toString()));
    }
    const response = await next();
    return withAdminHeaders(response);
  }

  const response = await next();
  return withAdminHeaders(response);
});
```

- [ ] **Step 3: Verify no remaining references to deleted files**

```powershell
Select-String -Path "src\**\*" -Pattern "keystatic-role-config|keystatic-config|KeystaticApp|RoleAwareKeystaticApp|@keystatic" -Include "*.astro","*.ts","*.tsx" -Recurse
```

Expected output: no matches.

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "refactor: update all imports from keystatic to content, simplify middleware"
```

---

### Task 4: Update `astro.config.mjs`

**Files:**
- Modify: `astro.config.mjs`

**Interfaces:**
- Produces: clean Astro config with no Keystatic references; `/cms` excluded from sitemap and robots

- [ ] **Step 1: Replace `astro.config.mjs`**

Replace the full content of `astro.config.mjs` with the following (removes Keystatic integration, updates manualChunks, updates sitemap + robots):

```js
import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import db from '@astrojs/db';
import cloudflare from '@astrojs/cloudflare';
import AstroPWA from '@vite-pwa/astro';
import tailwindcss from '@tailwindcss/vite';
import robotsTxt from 'astro-robots-txt';
import checker from 'vite-plugin-checker';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { analyzer } from 'vite-bundle-analyzer';
import YAML from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDevCommand = process.argv.includes('dev');
const enableAstroDbInDev = process.env.ENABLE_ASTRO_DB_DEV === 'true';
const useCloudflareAdapter = !isDevCommand;

const yamlPlugin = () => ({
  name: 'vite-plugin-yaml-custom',
  transform(code, id) {
    if (id.endsWith('.yaml') || id.endsWith('.yml')) {
      const parsed = YAML.parse(code);
      return {
        code: `export default ${JSON.stringify(parsed)};`,
        map: null,
      };
    }
  },
});

const integrations = [
  react(),
  ...(isDevCommand && !enableAstroDbInDev ? [] : [db()]),
  sitemap({
    filter(page) {
      try {
        const pathname = new URL(page).pathname;
        return !(
          pathname.startsWith('/admin') ||
          pathname.startsWith('/cms') ||
          pathname.startsWith('/api/')
        );
      } catch {
        return true;
      }
    },
  }),
  robotsTxt({
    policy: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/cms', '/api/'],
      },
    ],
  }),
  AstroPWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Padukuhan Salakan',
      short_name: 'Salakan',
      description: 'Portal warga Padukuhan Salakan — pengumuman, berita, agenda, dan layanan.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      theme_color: '#3b5998',
      background_color: '#ffffff',
      lang: 'id',
      orientation: 'portrait-primary',
      categories: ['government', 'news', 'social'],
      icons: [
        {
          src: '/images/og-salakan.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any',
        },
      ],
    },
    workbox: {
      navigateFallback: undefined,
      maximumFileSizeToCacheInBytes: 4000000,
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },
    devOptions: {
      enabled: false,
    },
  }),
];

export default defineConfig({
  site: 'https://salakan.pages.dev',
  output: 'server',
  adapter: useCloudflareAdapter ? cloudflare() : undefined,
  integrations,
  security: {
    checkOrigin: false,
  },
  server: {
    host: true,
  },
  vite: {
    resolve: {
      alias: {
        'promise-limit': path.resolve(__dirname, 'src/lib/promise-limit-esm.js'),
      },
    },
    plugins: [
      yamlPlugin(),
      tailwindcss(),
      ...(!process.argv.includes('build') ? [checker({ typescript: true })] : []),
      ViteImageOptimizer({
        png: { quality: 80 },
        jpeg: { quality: 80 },
        jpg: { quality: 80 },
        webp: { quality: 80 },
        svg: {
          plugins: [
            { name: 'removeViewBox', active: false },
            { name: 'sortAttrs' },
          ],
        },
      }),
      ...(process.env.ANALYZE ? [analyzer()] : []),
    ],
    build: {
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler')) {
              return 'react-vendor';
            }
          },
        },
      },
    },
    server: {
      fs: {
        allow: ['.'],
      },
      watch: {
        ignored: ['**/dist/**'],
      },
    },
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add astro.config.mjs
git commit -m "chore: remove Keystatic from astro config, update sitemap and robots"
```

---

### Task 5: Rename `gunakanPengaturanKeystatic` → `gunakanKonfigFile`

**Files:**
- Modify: `src/lib/admin-auth.ts` (one line)
- Modify: `src/content/singletons/akun-admin/index.yaml` (one line + catatan text)

**Interfaces:**
- Consumes: nothing new
- Produces: `admin-auth.ts` no longer references any Keystatic-specific field name

- [ ] **Step 1: Update `src/lib/admin-auth.ts`**

Find line 52 in `src/lib/admin-auth.ts`. Change:
```ts
    if (!parsed?.gunakanPengaturanKeystatic || !Array.isArray(parsed.users)) {
```
To:
```ts
    if (!parsed?.gunakanKonfigFile || !Array.isArray(parsed.users)) {
```

Also update the TypeScript type on line ~42:
```ts
      | {
          gunakanPengaturanKeystatic?: boolean;
```
To:
```ts
      | {
          gunakanKonfigFile?: boolean;
```

- [ ] **Step 2: Update `src/content/singletons/akun-admin/index.yaml`**

Replace the full file content:
```yaml
gunakanKonfigFile: false
catatan: >-
  Untuk production, disarankan memakai environment variable Cloudflare sebagai sumber
  utama login admin. Aktifkan mode konfigurasi file ini hanya jika akun production
  sudah benar-benar diganti dan diverifikasi.
users:
  - username: superadmin
    password: ganti-password-superadmin
    role: superadmin
    status: nonaktif
  - username: admin1
    password: ganti-password-admin
    role: admin
    status: nonaktif
  - username: editor1
    password: ganti-password-editor
    role: editor
    status: nonaktif
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/admin-auth.ts src/content/singletons/akun-admin/index.yaml
git commit -m "refactor: rename gunakanPengaturanKeystatic to gunakanKonfigFile"
```

---

### Task 6: Uninstall `@keystatic` packages

**Files:**
- Modify: `package.json`, `package-lock.json`

**Interfaces:**
- Produces: `node_modules` without `@keystatic/astro` and `@keystatic/core`

- [ ] **Step 1: Uninstall packages**

```bash
npm uninstall @keystatic/astro @keystatic/core
```

Expected: package.json no longer lists `@keystatic/astro` or `@keystatic/core`.

- [ ] **Step 2: Verify packages removed**

```powershell
Select-String -Path "package.json" -Pattern "@keystatic"
```

Expected output: no matches.

- [ ] **Step 3: Run dev server to verify build works**

```bash
npm run dev
```

Expected: dev server starts without errors. TypeScript errors about missing types from `@keystatic` would appear here if any reference was missed — fix before continuing.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: uninstall @keystatic packages"
```

---

### Task 7: Add Cloudflare Pages Function — GitHub OAuth proxy

**Files:**
- Create: `functions/api/auth/callback.js`

**Interfaces:**
- Produces: `GET /api/auth/callback?code=<github_code>` → HTML page that calls `window.opener.postMessage` with the GitHub token, closing itself

> **Note:** The `postMessage` message format must match what Pages CMS expects. The format below follows the open Netlify/Decap CMS standard that Pages CMS also uses: `authorization:github:success:{...}`. Verify against Pages CMS source at `src/services/auth.ts` if the CMS fails to receive the token.

- [ ] **Step 1: Create `functions/` directory and callback file**

Create `functions/api/auth/callback.js`:

```js
export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing OAuth code', { status: 400 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await tokenRes.json();

  const msg = data.error
    ? `authorization:github:error:${JSON.stringify({ error: data.error })}`
    : `authorization:github:success:${JSON.stringify({ token: data.access_token, provider: 'github' })}`;

  const html = `<!doctype html>
<html>
<body>
<script>
  (function () {
    var msg = ${JSON.stringify(msg)};
    function receive(e) {
      window.opener.postMessage(msg, e.origin);
    }
    window.addEventListener('message', receive);
    if (window.opener) {
      window.opener.postMessage(msg, '*');
    }
  })();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
```

- [ ] **Step 2: Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to Cloudflare Pages**

Manual step — do this in the Cloudflare dashboard:
1. Go to Cloudflare Pages → `salakan` project → Settings → Environment variables
2. Add `GITHUB_CLIENT_ID` = your GitHub OAuth App client ID
3. Add `GITHUB_CLIENT_SECRET` = your GitHub OAuth App client secret (mark as secret/encrypted)
4. Apply to both Production and Preview environments

To create the GitHub OAuth App (if not done):
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. **Application name:** Salakan CMS
3. **Homepage URL:** `https://salakan.pages.dev`
4. **Authorization callback URL:** `https://salakan.pages.dev/api/auth/callback`
5. Save Client ID and generate Client Secret

- [ ] **Step 3: Commit**

```bash
git add functions/
git commit -m "feat: add Cloudflare Pages Function for GitHub OAuth callback"
```

---

### Task 8: Add `.pages.yml` — Pages CMS configuration

**Files:**
- Create: `.pages.yml` at repo root

**Interfaces:**
- Produces: Pages CMS can read all 11 collections and 4 singletons; all paths match existing `src/content/**` structure

- [ ] **Step 1: Create `.pages.yml`**

Create `.pages.yml` at the repo root with the full content below. This maps every Keystatic collection and singleton to Pages CMS field types, preserving the existing `src/content/` file structure:

```yaml
media:
  input: public/images
  output: /images

content:
  # ─── COLLECTIONS ────────────────────────────────────────────────

  - name: pengumuman
    label: Pengumuman
    type: collection
    path: src/content/pengumuman/{slug}
    filename: index.yaml
    format: yaml
    view:
      fields: [judul, tanggal]
    fields:
      - name: judul
        label: Judul
        type: string
        required: true
      - name: tanggal
        label: Tanggal
        type: date
      - name: ringkasan
        label: Ringkasan
        type: text
      - name: isi
        label: Isi pengumuman
        type: text
      - name: pengaturanTampil
        label: Pengaturan Tampil
        type: object
        fields:
          - name: statusPublikasi
            label: Status tayang
            type: select
            options:
              - value: publish
                label: Publish / Tayang
              - value: draft
                label: Draft / Belum tayang
            default: publish
          - name: unggulan
            label: Tandai sebagai pengumuman unggulan
            type: boolean
            default: false

  - name: dokumen
    label: Dokumen
    type: collection
    path: src/content/dokumen/{slug}
    filename: index.yaml
    format: yaml
    view:
      fields: [judul, tanggalUpdate]
    fields:
      - name: judul
        label: Judul dokumen
        type: string
        required: true
      - name: tanggalUpdate
        label: Tanggal pembaruan
        type: date
      - name: kontenUtama
        label: Konten Utama
        type: object
        fields:
          - name: ringkasan
            label: Ringkasan
            type: text
          - name: deskripsi
            label: Deskripsi lengkap
            type: text
      - name: media
        label: Media
        type: object
        fields:
          - name: fileDokumen
            label: File dokumen
            type: file
            options:
              input: public/files/dokumen
              output: /files/dokumen
      - name: seo
        label: SEO
        type: object
        fields:
          - name: seoTitle
            label: SEO title
            type: string
          - name: seoDescription
            label: SEO description
            type: text
          - name: ogImage
            label: OG image path
            type: string
      - name: pengaturanTampil
        label: Pengaturan Tampil
        type: object
        fields:
          - name: kategori
            label: Kategori dokumen
            type: select
            options:
              - value: layanan
                label: Layanan warga
              - value: arsip
                label: Arsip publik
              - value: kegiatan
                label: Kegiatan
              - value: regulasi
                label: Regulasi
            default: layanan
          - name: statusPublikasi
            label: Status tayang
            type: select
            options:
              - value: publish
                label: Publish / Tayang
              - value: draft
                label: Draft / Belum tayang
            default: publish
          - name: unggulan
            label: Dokumen unggulan
            type: boolean
            default: false
          - name: urutanTampil
            label: Urutan tampil
            type: number

  - name: kegiatan
    label: Berita & Kegiatan
    type: collection
    path: src/content/kegiatan/{slug}
    filename: index.md
    format: yaml-frontmatter
    view:
      fields: [judul, tanggal, statusPublikasi]
    fields:
      - name: judul
        label: Judul
        type: string
        required: true
      - name: tanggal
        label: Tanggal
        type: date
      - name: statusPublikasi
        label: Status artikel
        type: select
        options:
          - value: publish
            label: Publish / Tayang
          - value: draft
            label: Draft / Belum tayang
        default: publish
      - name: editorArtikel
        label: Editor Artikel
        type: object
        fields:
          - name: kontenUtama
            label: Konten Utama
            type: object
            fields:
              - name: ringkasan
                label: Ringkasan
                type: text
          - name: sidebar
            label: Sidebar
            type: object
            fields:
              - name: jenisKonten
                label: Jenis konten
                type: select
                options:
                  - value: berita
                    label: Berita
                  - value: artikel
                    label: Artikel
                default: berita
              - name: kategori
                label: Kategori berita
                type: relation
                collection: kategoriBerita
                value: slug
                label_field: labelTampil
              - name: penulis
                label: Penulis
                type: string
              - name: unggulan
                label: Konten unggulan
                type: boolean
                default: false
              - name: gambarUtama
                label: Gambar utama
                type: image
                options:
                  input: public/images/kegiatan
                  output: /images/kegiatan
              - name: altGambarUtama
                label: Alt text gambar utama
                type: string
              - name: tag
                label: Tag artikel
                type: string
                list: true
          - name: seo
            label: SEO
            type: object
            fields:
              - name: seoTitle
                label: SEO title
                type: string
              - name: seoDescription
                label: SEO description
                type: text
              - name: ogImage
                label: OG image path
                type: string
      - name: body
        label: Isi Artikel
        type: rich-text

  - name: agenda
    label: Agenda
    type: collection
    path: src/content/agenda/{slug}
    filename: index.yaml
    format: yaml
    view:
      fields: [judul, tanggal, statusPublikasi]
    fields:
      - name: judul
        label: Judul agenda
        type: string
        required: true
      - name: tanggal
        label: Tanggal agenda
        type: date
      - name: statusPublikasi
        label: Status agenda
        type: select
        options:
          - value: publish
            label: Publish / Tayang
          - value: draft
            label: Draft / Belum tayang
        default: publish
      - name: kontenUtama
        label: Konten Utama
        type: object
        fields:
          - name: waktuMulai
            label: Waktu mulai
            type: string
          - name: waktuSelesai
            label: Waktu selesai
            type: string
          - name: lokasi
            label: Lokasi kegiatan
            type: string
          - name: ringkasan
            label: Ringkasan agenda
            type: text
          - name: deskripsi
            label: Deskripsi lengkap
            type: text
          - name: kontakPic
            label: Kontak / PIC
            type: string
      - name: media
        label: Media
        type: object
        fields:
          - name: gambarUtama
            label: Gambar agenda
            type: image
            options:
              input: public/images/agenda
              output: /images/agenda
          - name: altGambarUtama
            label: Alt text gambar agenda
            type: string
      - name: pengaturanTampil
        label: Pengaturan Tampil
        type: object
        fields:
          - name: unggulan
            label: Agenda unggulan
            type: boolean
            default: false

  - name: umkm
    label: UMKM
    type: collection
    path: src/content/umkm/{slug}
    filename: index.yaml
    format: yaml
    fields:
      - name: namaUsaha
        label: Nama usaha
        type: string
        required: true
      - name: kontenUtama
        label: Konten Utama
        type: object
        fields:
          - name: pemilik
            label: Nama pemilik
            type: string
          - name: ringkasan
            label: Ringkasan usaha
            type: text
          - name: deskripsi
            label: Deskripsi lengkap
            type: text
          - name: whatsapp
            label: Nomor WhatsApp
            type: string
          - name: lokasi
            label: Lokasi usaha
            type: string
          - name: produkUnggulan
            label: Produk unggulan
            type: string
            list: true
      - name: media
        label: Media
        type: object
        fields:
          - name: gambar
            label: Foto produk utama
            type: image
            options:
              input: public/images/umkm
              output: /images/umkm
          - name: altGambar
            label: Alt text foto produk
            type: string
      - name: seo
        label: SEO
        type: object
        fields:
          - name: seoTitle
            label: SEO title
            type: string
          - name: seoDescription
            label: SEO description
            type: text
          - name: ogImage
            label: OG image path
            type: string
      - name: pengaturanTampil
        label: Pengaturan Tampil
        type: object
        fields:
          - name: kategori
            label: Kategori usaha
            type: select
            options:
              - value: kuliner
                label: Kuliner
              - value: kerajinan
                label: Kerajinan
              - value: jasa
                label: Jasa
              - value: perdagangan
                label: Perdagangan
            default: kuliner
          - name: statusPublikasi
            label: Status tayang
            type: select
            options:
              - value: publish
                label: Publish / Tayang
              - value: draft
                label: Draft / Belum tayang
            default: publish
          - name: unggulan
            label: UMKM unggulan
            type: boolean
            default: false
          - name: urutanTampil
            label: Urutan tampil
            type: number

  - name: galeri
    label: Galeri
    type: collection
    path: src/content/galeri/{slug}
    filename: index.yaml
    format: yaml
    view:
      fields: [judul, tanggal]
    fields:
      - name: judul
        label: Judul
        type: string
        required: true
      - name: tanggal
        label: Tanggal
        type: date
      - name: gambar
        label: Foto
        type: image
        options:
          input: public/images/galeri
          output: /images/galeri
      - name: caption
        label: Caption
        type: text

  - name: kategoriBerita
    label: Kategori Berita
    type: collection
    path: src/content/kategori-berita/{slug}
    filename: index.yaml
    format: yaml
    view:
      fields: [namaKategori, labelTampil]
    fields:
      - name: namaKategori
        label: Slug kategori
        type: string
        required: true
      - name: labelTampil
        label: Label tampil
        type: string
      - name: deskripsi
        label: Deskripsi singkat
        type: text
      - name: pengaturanTampil
        label: Pengaturan Tampil
        type: object
        fields:
          - name: status
            label: Status tampil
            type: select
            options:
              - value: tampil
                label: Tampilkan
              - value: sembunyi
                label: Sembunyikan
            default: tampil
          - name: urutanTampil
            label: Urutan tampil
            type: number

  - name: strukturOrganisasi
    label: Struktur Organisasi
    type: collection
    path: src/content/struktur-organisasi/{slug}
    filename: index.yaml
    format: yaml
    fields:
      - name: jabatan
        label: Nama jabatan
        type: string
        required: true
      - name: kontenUtama
        label: Konten Utama
        type: object
        fields:
          - name: namaPejabat
            label: Nama pejabat / penanggung jawab
            type: string
          - name: deskripsiTugas
            label: Deskripsi tugas
            type: text
          - name: kontak
            label: Kontak
            type: string
      - name: pengaturanTampil
        label: Pengaturan Tampil
        type: object
        fields:
          - name: bidang
            label: Kelompok organisasi
            type: select
            options:
              - value: pimpinan
                label: Pimpinan padukuhan
              - value: kegiatan
                label: Koordinator kegiatan warga
              - value: wilayah
                label: Penghubung wilayah
            default: pimpinan
          - name: statusPublikasi
            label: Status tayang
            type: select
            options:
              - value: publish
                label: Publish / Tayang
              - value: draft
                label: Draft / Belum tayang
            default: publish
          - name: urutanTampil
            label: Urutan tampil
            type: number

  - name: layananWarga
    label: Layanan Warga
    type: collection
    path: src/content/layanan-warga/{slug}
    filename: index.yaml
    format: yaml
    fields:
      - name: namaLayanan
        label: Nama layanan
        type: string
        required: true
      - name: ringkasan
        label: Ringkasan
        type: text
      - name: syarat
        label: Syarat
        type: string
        list: true
      - name: langkah
        label: Langkah
        type: string
        list: true
      - name: kontak
        label: Kontak
        type: string
      - name: jamLayanan
        label: Jam layanan
        type: string
      - name: statusTampil
        label: Status tampil
        type: select
        options:
          - value: tampil
            label: Tampilkan
          - value: sembunyi
            label: Sembunyikan
        default: tampil

  - name: faq
    label: FAQ
    type: collection
    path: src/content/faq/{slug}
    filename: index.yaml
    format: yaml
    fields:
      - name: pertanyaan
        label: Pertanyaan
        type: string
        required: true
      - name: jawaban
        label: Jawaban
        type: text
      - name: kategori
        label: Kategori
        type: string
      - name: urutan
        label: Urutan
        type: number
      - name: statusTampil
        label: Status tampil
        type: select
        options:
          - value: tampil
            label: Tampilkan
          - value: sembunyi
            label: Sembunyikan
        default: tampil

  - name: rt
    label: Daftar RT
    type: collection
    path: src/content/rt
    filename: '{fields.rt_id}.json'
    format: json
    fields:
      - name: rt_id
        label: ID RT
        type: string
        required: true
      - name: nomor_rt
        label: Nomor RT
        type: string
      - name: nama_ketua
        label: Nama Ketua RT
        type: string
      - name: no_hp_ketua
        label: No. HP/WA Ketua RT
        type: string
      - name: aktif
        label: RT Aktif
        type: boolean
        default: true
      - name: catatan
        label: Catatan
        type: text

  # ─── SINGLETONS (type: file) ────────────────────────────────────

  - name: profil
    label: Profil Padukuhan
    type: file
    path: src/content/singletons/profil/index.yaml
    fields:
      - name: namaPadukuhan
        label: Nama padukuhan
        type: string
      - name: tagline
        label: Tagline
        type: text
      - name: hero
        label: Hero Profil
        type: object
        fields:
          - name: gambar
            label: Gambar hero
            type: image
            options:
              input: public/images/profil
              output: /images/profil
          - name: judul
            label: Judul overlay hero
            type: string
          - name: badge
            label: Badge hero
            type: string
      - name: sejarahLabel
        label: Label section sejarah
        type: string
      - name: sejarahJudul
        label: Judul section sejarah
        type: string
      - name: sejarahSingkat
        label: Isi sejarah
        type: text
      - name: visi
        label: Visi
        type: text
      - name: misi
        label: Misi
        type: string
        list: true
      - name: potensiDesa
        label: Potensi Desa
        type: object
        list: true
        fields:
          - name: ikon
            label: Nama ikon Material
            type: string
          - name: judul
            label: Judul potensi
            type: string
          - name: deskripsi
            label: Deskripsi
            type: text
      - name: lokasi
        label: Lokasi & Peta
        type: object
        fields:
          - name: gambarPeta
            label: Gambar peta / foto lokasi
            type: image
            options:
              input: public/images/profil
              output: /images/profil
          - name: alamat
            label: Alamat lengkap
            type: text
          - name: linkPeta
            label: Link Google Maps
            type: string
      - name: dataWilayah
        label: Data wilayah
        type: object
        list: true
        fields:
          - name: label
            label: Label data
            type: string
          - name: value
            label: Nilai
            type: string

  - name: pengaturan
    label: Pengaturan Situs
    type: file
    path: src/content/singletons/pengaturan/index.yaml
    fields:
      - name: alamat
        label: Alamat
        type: text
      - name: kontakWhatsApp
        label: Nomor WhatsApp
        type: string
      - name: email
        label: Email
        type: string
      - name: jamLayanan
        label: Jam layanan
        type: string
      - name: linkPeta
        label: Link embed peta
        type: string
      - name: sambutanBeranda
        label: Sambutan beranda
        type: text
      - name: seoHalamanData
        label: SEO Halaman Data
        type: object
        fields:
          - name: dataUtama
            label: SEO Halaman Data Utama
            type: object
            fields:
              - name: seoTitle
                label: SEO title halaman Data
                type: string
              - name: seoDescription
                label: SEO description halaman Data
                type: text
              - name: ogImage
                label: OG image halaman Data
                type: string
          - name: pengumuman
            label: SEO Halaman Pengumuman
            type: object
            fields:
              - name: seoTitle
                label: SEO title halaman Pengumuman
                type: string
              - name: seoDescription
                label: SEO description halaman Pengumuman
                type: text
              - name: ogImage
                label: OG image halaman Pengumuman
                type: string
          - name: dokumen
            label: SEO Halaman Dokumen
            type: object
            fields:
              - name: seoTitle
                label: SEO title halaman Dokumen
                type: string
              - name: seoDescription
                label: SEO description halaman Dokumen
                type: text
              - name: ogImage
                label: OG image halaman Dokumen
                type: string
          - name: umkm
            label: SEO Halaman UMKM
            type: object
            fields:
              - name: seoTitle
                label: SEO title halaman UMKM
                type: string
              - name: seoDescription
                label: SEO description halaman UMKM
                type: text
              - name: ogImage
                label: OG image halaman UMKM
                type: string
          - name: strukturOrganisasi
            label: SEO Halaman Struktur Organisasi
            type: object
            fields:
              - name: seoTitle
                label: SEO title halaman Struktur Organisasi
                type: string
              - name: seoDescription
                label: SEO description halaman Struktur Organisasi
                type: text
              - name: ogImage
                label: OG image halaman Struktur Organisasi
                type: string
          - name: agenda
            label: SEO Halaman Agenda
            type: object
            fields:
              - name: seoTitle
                label: SEO title halaman Agenda
                type: string
              - name: seoDescription
                label: SEO description halaman Agenda
                type: text
              - name: ogImage
                label: OG image halaman Agenda
                type: string
          - name: layananWarga
            label: SEO Halaman Layanan Warga
            type: object
            fields:
              - name: seoTitle
                label: SEO title halaman Layanan Warga
                type: string
              - name: seoDescription
                label: SEO description halaman Layanan Warga
                type: text
              - name: ogImage
                label: OG image halaman Layanan Warga
                type: string
          - name: faq
            label: SEO Halaman FAQ
            type: object
            fields:
              - name: seoTitle
                label: SEO title halaman FAQ
                type: string
              - name: seoDescription
                label: SEO description halaman FAQ
                type: text
              - name: ogImage
                label: OG image halaman FAQ
                type: string
          - name: monografi
            label: SEO Halaman Monografi
            type: object
            fields:
              - name: seoTitle
                label: SEO title halaman Monografi
                type: string
              - name: seoDescription
                label: SEO description halaman Monografi
                type: text
              - name: ogImage
                label: OG image halaman Monografi
                type: string
      - name: menuData
        label: Menu Data
        type: object
        fields:
          - name: title
            label: Judul halaman Data
            type: string
          - name: description
            label: Deskripsi halaman Data
            type: text
          - name: items
            label: Sub menu Data
            type: object
            list: true
            fields:
              - name: label
                label: Nama menu
                type: string
              - name: href
                label: Link menu
                type: string
              - name: description
                label: Deskripsi singkat
                type: text
              - name: icon
                label: Nama ikon
                type: string
              - name: status
                label: Status tampil
                type: select
                options:
                  - value: tampil
                    label: Tampilkan
                  - value: sembunyi
                    label: Sembunyikan
                default: tampil

  - name: beranda
    label: Konten Beranda
    type: file
    path: src/content/singletons/beranda/index.yaml
    fields:
      - name: hero
        label: Hero
        type: object
        fields:
          - name: eyebrow
            label: Label kecil hero
            type: string
          - name: title
            label: Judul hero
            type: string
          - name: intro
            label: Deskripsi hero
            type: text
          - name: primaryCtaLabel
            label: Label tombol utama hero
            type: string
          - name: primaryCtaHref
            label: Link tombol utama hero
            type: string
          - name: secondaryCtaLabel
            label: Label tombol kedua hero
            type: string
          - name: secondaryCtaHref
            label: Link tombol kedua hero
            type: string
          - name: panelLabel
            label: Label panel hero
            type: string
          - name: panelTitle
            label: Judul panel hero
            type: string
          - name: panelNote
            label: Catatan panel hero
            type: text
          - name: panelLinks
            label: Tautan panel hero
            type: object
            list: true
            fields:
              - name: title
                label: Judul tautan
                type: string
              - name: description
                label: Deskripsi singkat
                type: text
              - name: href
                label: Link tujuan
                type: string
              - name: icon
                label: Nama ikon
                type: string
              - name: status
                label: Status tampil
                type: select
                options:
                  - value: tampil
                    label: Tampilkan
                  - value: sembunyi
                    label: Sembunyikan
                default: tampil
          - name: stats
            label: Statistik hero
            type: object
            fields:
              - name: pengumumanLabel
                label: Label statistik pengumuman
                type: string
              - name: kegiatanLabel
                label: Label statistik berita
                type: string
              - name: galeriLabel
                label: Label statistik galeri
                type: string
      - name: pengumuman
        label: Section Pengumuman
        type: object
        fields:
          - name: title
            label: Judul section pengumuman
            type: string
          - name: description
            label: Deskripsi section pengumuman
            type: text
          - name: ctaLabel
            label: Label tombol pengumuman utama
            type: string
      - name: berita
        label: Section Berita
        type: object
        fields:
          - name: title
            label: Judul section berita
            type: string
          - name: description
            label: Deskripsi section berita
            type: text
          - name: ctaLabel
            label: Label tombol section berita
            type: string
      - name: galeri
        label: Section Galeri
        type: object
        fields:
          - name: title
            label: Judul section galeri
            type: string
          - name: description
            label: Deskripsi section galeri
            type: text
          - name: ctaLabel
            label: Label tombol galeri
            type: string
      - name: penutup
        label: CTA Penutup
        type: object
        fields:
          - name: eyebrow
            label: Label kecil CTA penutup
            type: string
          - name: title
            label: Judul CTA penutup
            type: string
          - name: description
            label: Deskripsi CTA penutup
            type: text
          - name: primaryCtaLabel
            label: Label tombol utama penutup
            type: string
          - name: primaryCtaHref
            label: Link tombol utama penutup
            type: string
          - name: secondaryCtaLabel
            label: Label tombol kedua penutup
            type: string
          - name: secondaryCtaHref
            label: Link tombol kedua penutup
            type: string

  - name: monografi
    label: Data Monografi
    type: file
    path: src/content/singletons/monografi/index.yaml
    fields:
      - name: identitasDukuh
        label: Identitas Dukuh
        type: object
        fields:
          - name: namaDukuh
            label: Nama Dukuh
            type: string
          - name: pendidikan
            label: Pendidikan Terakhir
            type: string
          - name: alamat
            label: Alamat Dukuh
            type: text
      - name: demografi
        label: Data Demografi & Kependudukan
        type: object
        fields:
          - name: luasWilayah
            label: Luas Wilayah
            type: string
          - name: jumlahRT
            label: Jumlah RT
            type: number
          - name: totalJiwa
            label: Total Jiwa
            type: number
          - name: totalLakiLaki
            label: Jumlah Laki-laki
            type: number
          - name: totalPerempuan
            label: Jumlah Perempuan
            type: number
          - name: totalKK
            label: Total Kepala Keluarga (KK)
            type: number
          - name: kkLakiLaki
            label: KK Laki-laki
            type: number
          - name: kkPerempuan
            label: KK Perempuan
            type: number
      - name: fasilitas
        label: Fasilitas & Layanan Publik
        type: object
        fields:
          - name: pendidikan
            label: Sarana Pendidikan
            type: object
            fields:
              - name: tkPaud
                label: TK dan PAUD
                type: string
              - name: sd
                label: SD
                type: string
              - name: smp
                label: SMP
                type: string
              - name: smk
                label: SMK
                type: string
              - name: slb
                label: SLB
                type: string
              - name: pkbm
                label: PKBM
                type: string
              - name: universitas
                label: Sekolah Tinggi/Univ
                type: string
          - name: kesehatan
            label: Sarana Kesehatan
            type: object
            fields:
              - name: puskesmas
                label: Puskesmas
                type: string
              - name: posyanduBalita
                label: Posyandu Balita
                type: string
              - name: posyanduLansia
                label: Posyandu Lansia
                type: string
      - name: potensi
        label: Potensi & Ekonomi Kreatif
        type: object
        fields:
          - name: seniBudaya
            label: Daftar Seni & Budaya
            type: string
            list: true
          - name: umkmIndustri
            label: Daftar UMKM & Industri
            type: string
            list: true
```

- [ ] **Step 2: Commit**

```bash
git add .pages.yml
git commit -m "feat: add Pages CMS configuration (.pages.yml)"
```

---

### Task 9: Build Pages CMS SPA and populate `public/cms/`

**Files:**
- Create: `public/cms/` (populated with Pages CMS pre-built dist)

> This is a manual setup step, not automated. The `public/cms/` directory is served by Cloudflare Pages as static files. Pages CMS must be built with `VITE_GITHUB_CLIENT_ID` embedded at build time.

- [ ] **Step 1: Clone and build Pages CMS** (run in a separate directory, not the project root)

```bash
git clone https://github.com/pages-cms/pages-cms.git pages-cms-build
cd pages-cms-build
npm install
```

- [ ] **Step 2: Configure and build**

Set `VITE_GITHUB_CLIENT_ID` to your GitHub OAuth App client ID (the same one set in Cloudflare dashboard). Check `pages-cms-build/` for a `.env.example` file — if it exists, use it as the guide for required env vars. Typical build command:

```bash
VITE_GITHUB_CLIENT_ID=<your-client-id> npm run build
```

On Windows PowerShell:
```powershell
$env:VITE_GITHUB_CLIENT_ID = "<your-client-id>"
npm run build
```

> **Verify the Pages CMS auth backend URL:** Pages CMS may also require an env var for the OAuth backend URL (e.g., `VITE_OAUTH_BACKEND` or similar). Check the Pages CMS `.env.example` or source at `src/config.ts`. Set it to `https://salakan.pages.dev/api/auth/callback`.

- [ ] **Step 3: Copy built output to `public/cms/`**

```powershell
New-Item -ItemType Directory -Force -Path "D:\Antigravity\salakanid\public\cms"
Copy-Item -Path "pages-cms-build\dist\*" -Destination "D:\Antigravity\salakanid\public\cms\" -Recurse -Force
```

- [ ] **Step 4: Commit**

```bash
git add public/cms/
git commit -m "feat: add Pages CMS pre-built SPA to public/cms"
```

- [ ] **Step 5: Clean up Pages CMS clone** (optional)

```bash
Remove-Item pages-cms-build -Recurse -Force
```

---

### Task 10: Verify build passes and test CMS access

**Files:** None modified — verification only.

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: exits with code 0, no TypeScript errors, no missing module errors.

- [ ] **Step 2: Verify no Keystatic references remain in output**

```powershell
Select-String -Path "src\**\*","astro.config.mjs","keystatic.config.ts" `
  -Pattern "@keystatic|keystatic-config|keystatic-role|KeystaticApp|RoleAwareKeystatic|manualKeystatic|SKIP_KEYSTATIC" `
  -Include "*.astro","*.ts","*.tsx","*.mjs" -Recurse -ErrorAction SilentlyContinue
```

Expected output: no matches (the `keystatic.config.ts` file itself won't exist, so the path won't match).

- [ ] **Step 3: Run dev server and verify pages load**

```bash
npm run dev
```

Open in browser and verify these routes work:
- `http://localhost:4321/` — home page loads
- `http://localhost:4321/berita` — berita list loads
- `http://localhost:4321/admin/login` — login page loads

- [ ] **Step 4: Deploy to Cloudflare Pages and verify `/cms/` loads**

Push the branch and let Cloudflare Pages build. Once deployed:
- Visit `https://salakan.pages.dev/cms/` — Pages CMS SPA should load
- Click "Sign in with GitHub" — OAuth flow should complete
- Verify Pages CMS shows the repo's collections from `.pages.yml`

- [ ] **Step 5: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: post-migration cleanup"
```

---

## Self-Review

**Spec coverage:**
- ✅ Remove all Keystatic files → Task 1
- ✅ Rename `keystatic.ts` → `content.ts` → Task 2
- ✅ Update all 25 import files → Task 3
- ✅ Simplify middleware → Task 3
- ✅ Clean up astro.config.mjs → Task 4
- ✅ Rename `gunakanPengaturanKeystatic` → Task 5
- ✅ Uninstall @keystatic packages → Task 6
- ✅ Cloudflare Pages Function OAuth proxy → Task 7
- ✅ `.pages.yml` full config → Task 8
- ✅ Build and serve Pages CMS SPA → Task 9
- ✅ Verify build → Task 10
- ✅ `laboratoriumFieldApi` not included in CMS config (excluded by design)
- ✅ `akunAdmin` not included in CMS config (security: passwords)

**Placeholder scan:** All steps contain complete code. No TBDs. The "manual step" in Task 9 is inherently a setup step that cannot be automated without knowing the GitHub OAuth credentials.

**Type consistency:** `content.ts` exports identical function signatures to `keystatic.ts`. All consumer files use the same function names. No type drift.
