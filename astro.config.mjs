import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import db from '@astrojs/db';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import manualKeystatic from './src/lib/manual-keystatic-integration.mjs';

const integrations = [
  react(),
  db(),
  sitemap({
    filter(page) {
      try {
        const pathname = new URL(page).pathname;
        return !(
          pathname.startsWith('/admin') ||
          pathname.startsWith('/keystatic') ||
          pathname.startsWith('/api/keystatic')
        );
      } catch {
        return true;
      }
    },
  }),
];

if (process.env.SKIP_KEYSTATIC !== 'true') {
  integrations.push(manualKeystatic());
}

export default defineConfig({
  site: 'https://salakan-rose.vercel.app',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations,
  security: {
    checkOrigin: false,
  },
  server: {
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      chunkSizeWarningLimit: 1800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            if (
              id.includes('@keystatic') ||
              id.includes('@codemirror') ||
              id.includes('/codemirror/') ||
              id.includes('prosemirror') ||
              id.includes('crelt')
            ) {
              return 'keystatic-core';
            }
            if (
              id.includes('@react-aria') ||
              id.includes('@react-stately') ||
              id.includes('@internationalized')
            ) {
              return 'keystatic-spectrum';
            }
            if (
              id.includes('remark') ||
              id.includes('rehype') ||
              id.includes('micromark') ||
              id.includes('mdast') ||
              id.includes('hast') ||
              id.includes('unist')
            ) {
              return 'keystatic-markdown';
            }
            if (id.includes('slate')) {
              return 'keystatic-slate';
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
        ignored: ['**/dist/**', '**/.vercel/**'],
      },
    },
  },
});
