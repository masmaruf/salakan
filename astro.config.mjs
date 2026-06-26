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
