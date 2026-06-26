# Pages CMS Migration — Replacing Keystatic

**Date:** 2026-06-26  
**Status:** Approved  
**Goal:** Remove Keystatic to reduce bundle size; replace with self-hosted Pages CMS backed by GitHub.

---

## Background

The current Astro project uses Keystatic as its CMS. Keystatic adds ~500KB+ gzipped to the admin panel bundle (prosemirror, codemirror, slate, spectrum, markdown chunks). The project stores content as YAML/MD files in `src/content/`, read via `astro:content`. The CMS is accessed at `/keystatic/`.

The migration goal is to strip Keystatic entirely and serve Pages CMS as a self-hosted SPA at `/cms/`, backed by GitHub OAuth.

---

## Architecture

### What gets removed

| Target | Notes |
|---|---|
| `@keystatic/astro`, `@keystatic/core` | npm packages — primary bundle source |
| `keystatic.config.ts` | Entry point |
| `src/lib/keystatic-config.ts` | Full schema config (~1400 lines) |
| `src/lib/keystatic-role-config.ts` | Role-based config logic |
| `src/lib/manual-keystatic-integration.mjs` | Vite integration hook |
| `src/components/KeystaticApp.tsx` | SPA wrapper component |
| `src/components/RoleAwareKeystaticApp.tsx` | Role-aware SPA wrapper |
| `src/pages/keystatic/index.astro` | Route |
| `src/pages/keystatic/[...params].astro` | Route |
| Vite `manualChunks` for Keystatic | 6 chunk entries in `astro.config.mjs` |
| `SKIP_KEYSTATIC` env var handling in `astro.config.mjs` | |
| `/keystatic` from sitemap filter and robots.txt | |

### What gets added

| Target | Notes |
|---|---|
| `.pages.yml` | Pages CMS config at repo root — defines all collections and singletons |
| `public/cms/` | Pages CMS pre-built SPA — served as static files by Cloudflare Pages |
| `functions/api/auth/callback.js` | Cloudflare Pages Function — GitHub OAuth token exchange proxy |

### What stays unchanged

- `src/content/**` — all YAML/MD content files, no changes
- `src/content/config.ts` — Astro content collection definitions
- `src/pages/admin/**` — e-surat admin routes
- `src/lib/admin-auth.ts` — custom session auth (e-surat still needs it)

### What gets renamed/updated

- `src/lib/keystatic.ts` → `src/lib/content.ts` (logic identical; only uses `astro:content`, zero Keystatic dependency)
- All files that `import from '../lib/keystatic'` → `import from '../lib/content'`
- `astro.config.mjs` — remove Keystatic integration, manual chunks, sitemap/robots filters
- Field `gunakanPengaturanKeystatic` in `src/content/singletons/akun-admin/index.yaml` → `gunakanKonfigFile`; same in `admin-auth.ts`

---

## Pages CMS Deployment

### Serving the SPA

Pages CMS is a Vite/React SPA. The self-hosted build process:

```bash
git clone https://github.com/pages-cms/pages-cms.git
cd pages-cms
npm install
VITE_GITHUB_CLIENT_ID=<your-client-id> npm run build
# Copy dist output to Astro project
cp -r dist/* ../salakanid/public/cms/
```

The built files in `public/cms/` are served as static assets by Cloudflare Pages. No Astro processing needed — they are invisible to the Astro build.

When Pages CMS updates, rebuild and re-copy. This is a manual step (no automation needed for a village website).

### GitHub OAuth App Setup (one-time manual step)

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. **Homepage URL**: `https://salakan.pages.dev`
3. **Authorization callback URL**: `https://salakan.pages.dev/api/auth/callback`
4. Save Client ID and Client Secret → add to Cloudflare Pages dashboard as:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

### Cloudflare Pages Function — OAuth Proxy

File: `functions/api/auth/callback.js`

```js
export async function onRequest({ request, env }) {
  const code = new URL(request.url).searchParams.get('code');
  if (!code) return new Response('Missing code', { status: 400 });

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const { access_token, error } = await res.json();
  const msg = error
    ? `authorization:github:error:${JSON.stringify({ error })}`
    : `authorization:github:success:${JSON.stringify({ token: access_token, provider: 'github' })}`;

  return new Response(
    `<!doctype html><html><body><script>
      (window.opener || window.parent).postMessage(${JSON.stringify(msg)}, '*');
      window.close();
    </script></body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
```

> **Note:** The exact `postMessage` format should be verified against the Pages CMS source or docs when implementing. The format above follows the pattern used by Decap CMS / Netlify CMS — Pages CMS uses the same open standard.

---

## Pages CMS Configuration (`.pages.yml`)

Root file at repo root. Maps all Keystatic collections and singletons to Pages CMS field types.

### Field type mapping

| Keystatic | Pages CMS |
|---|---|
| `fields.text` (single line) | `type: string` |
| `fields.text` (multiline) | `type: text` |
| `fields.date` | `type: date` |
| `fields.integer` / `fields.number` | `type: number` |
| `fields.select` | `type: select` |
| `fields.checkbox` | `type: boolean` |
| `fields.image` | `type: image` |
| `fields.file` | `type: file` |
| `fields.url` | `type: string` |
| `fields.array` of text | `type: string, list: true` |
| `fields.object` | nested `fields:` |
| `fields.mdx` / rich text | `type: rich-text` |
| `fields.relationship` | `type: relation` |
| `fields.slug` | `type: string` + path `{slug}` pattern |

### Collections

Path pattern: `src/content/{collection}/{slug}/index.yaml` (or `.md` for kegiatan).

- **pengumuman** — `type: collection`, `path: src/content/pengumuman/{slug}`, `filename: index.yaml`
- **dokumen** — same pattern, includes `file` field for PDF upload
- **kegiatan** — `filename: index.md`, `format: yaml-frontmatter`, body via `type: rich-text`
- **agenda** — standard YAML collection
- **umkm** — standard YAML collection
- **galeri** — standard YAML collection
- **kategoriBerita** — `path: src/content/kategori-berita/{slug}`
- **strukturOrganisasi** — `path: src/content/struktur-organisasi/{slug}`
- **layananWarga** — `path: src/content/layanan-warga/{slug}`, arrays via `list: true`
- **faq** — standard YAML collection
- **rt** — `path: src/content/rt`, `filename: {slug}.json`, `format: json`

### Singletons (type: file)

- **profil** — `path: src/content/singletons/profil/index.yaml`
- **pengaturan** — `path: src/content/singletons/pengaturan/index.yaml`
- **beranda** — `path: src/content/singletons/beranda/index.yaml`
- **monografi** — `path: src/content/singletons/monografi/index.yaml`

### Excluded from CMS

- **akunAdmin** — passwords must not be editable via CMS (security). Admin users managed via `ADMIN_USERS_JSON` env var.
- **laboratoriumFieldApi** — testing/lab singleton; uses field types not supported in Pages CMS (blocks, conditional, document, pathReference). Remove from CMS and from project.

---

## Code Changes

### `src/lib/content.ts` (renamed from `keystatic.ts`)

No logic changes. The file only uses `astro:content` (`getCollection`, `getEntry`) — zero Keystatic dependency. Only the filename and import paths change.

Files that import from `keystatic.ts` (to be updated):
- All Astro pages that call `getPengumuman()`, `getKegiatan()`, etc.
- Find via: `grep -r "from.*lib/keystatic"` 

### `astro.config.mjs` changes

- Remove `import manualKeystatic from './src/lib/manual-keystatic-integration.mjs'`
- Remove `manualKeystatic()` from integrations array
- Remove `if (process.env.SKIP_KEYSTATIC !== 'true')` block
- Remove `/keystatic` and `/api/keystatic` from sitemap filter and robots.txt
- Add `/cms` to sitemap filter and robots.txt disallow
- Remove all 6 Keystatic `manualChunks` entries

### `admin-auth.ts` changes

- Rename `gunakanPengaturanKeystatic` → `gunakanKonfigFile` in the type check
- Update the YAML file `src/content/singletons/akun-admin/index.yaml` to match

---

## What Editors See After Migration

- `/admin/login` — custom login for e-surat (unchanged)
- `/cms/` — Pages CMS, login via GitHub OAuth
- Editors with GitHub repo access can edit all content collections and singletons (except akunAdmin)
- No role separation at Pages CMS level — GitHub repo collaborator access controls who can edit

---

## Open Questions / Risks

1. **Pages CMS `postMessage` format** — verify exact format from Pages CMS source before finalizing `functions/api/auth/callback.js`
2. **Array of objects in Pages CMS** — some collections use `fields.array` of complex objects (e.g., profil → potensiDesa, beranda → panelLinks). Pages CMS supports nested lists; verify syntax.
3. **`kegiatan` existing body content** — files already are standard markdown; no content migration needed. Verify formatting is preserved.
4. **Image upload path** — Keystatic used `directory: 'public/images/...'` with `publicPath`. Pages CMS uses a global `media` config. All images need to route through the global media path or per-field overrides.
