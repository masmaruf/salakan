import { readFileSync, writeFileSync, existsSync, cpSync } from 'node:fs';

const configPath = 'dist/server/wrangler.json';
if (!existsSync(configPath)) {
  console.log('[fix-wrangler-config] No generated wrangler.json found, skipping.');
  process.exit(0);
}

const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// ASSETS is auto-provisioned — declaring it causes "reserved name" error
delete config.assets;

// Pages does not support these Worker-only fields
delete config.main;
delete config.rules;
delete config.images;
delete config.no_bundle;
delete config.dev;
delete config.previews;
delete config.definedEnvironments;
delete config.ai_search_namespaces;
delete config.ai_search;
delete config.agent_memory;
delete config.secrets_store_secrets;
delete config.artifacts;
delete config.unsafe_hello_world;
delete config.flagship;
delete config.worker_loaders;
delete config.ratelimits;
delete config.vpc_services;
delete config.vpc_networks;
delete config.python_modules;

// Remove SESSION KV binding if it has no id (adapter auto-adds it without id)
if (Array.isArray(config.kv_namespaces)) {
  config.kv_namespaces = config.kv_namespaces.filter((kv) => kv.id);
  if (config.kv_namespaces.length === 0) delete config.kv_namespaces;
}

// Same for previews section
if (config.previews) {
  if (Array.isArray(config.previews.kv_namespaces)) {
    config.previews.kv_namespaces = config.previews.kv_namespaces.filter((kv) => kv.id);
    if (config.previews.kv_namespaces.length === 0) delete config.previews.kv_namespaces;
  }
  if (Object.keys(config.previews).length === 0) delete config.previews;
}

writeFileSync(configPath, JSON.stringify(config));

// Copy static assets from dist/client/ to dist/ so Pages can serve them
cpSync('dist/client', 'dist', { recursive: true });

// Create _worker.js in pages output so Pages can find the SSR entry
const workerPath = 'dist/_worker.js';
writeFileSync(workerPath, `export { default } from './server/entry.mjs';\n`);

console.log('[fix-wrangler-config] Patched config, copied static assets, and created _worker.js.');
