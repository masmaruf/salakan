import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import manualKeystatic from './src/lib/manual-keystatic-integration.mjs';

// Constants for admin path exclusions
const ADMIN_PATHS = ['/admin', '/keystatic', '/api/keystatic'];

/**
 * Check if a page should be excluded from sitemap
 */
function isAdminPath(pathname) {
  return ADMIN_PATHS.some((path) => pathname.startsWith(path));
}

const integrations = [
  react(),
  sitemap({
    filter(page) {
      try {
        const pathname = new URL(page).pathname;
        return !isAdminPath(pathname);
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
  adapter: vercel(),
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
            if (!id.includes('node_modules')) return undefined;

            // Keystatic and editor dependencies
            if (
              id.includes('@keystatic') ||
              id.includes('@codemirror') ||
              id.includes('/codemirror/') ||
              id.includes('prosemirror') ||
              id.includes('crelt')
            ) {
              return 'keystatic-core';
            }
            // React Aria and internationalization
            if (
              id.includes('@react-aria') ||
              id.includes('@react-stately') ||
              id.includes('@internationalized')
            ) {
              return 'keystatic-spectrum';
            }
            // Markdown processing
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
            // Slate editor
            if (id.includes('slate')) {
              return 'keystatic-slate';
            }
            // React core libraries
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            
            return undefined;
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
