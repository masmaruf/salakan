import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import node from '@astrojs/node';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react'; // dibutuhkan Keystatic

export default defineConfig({
  output: 'server',           // SSR — wajib untuk Astro DB & API routes
  adapter: node({ mode: 'standalone' }),

  integrations: [
    db(),
    react(),
    keystatic(),
  ],
});
