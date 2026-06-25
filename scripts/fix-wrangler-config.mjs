import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const configPath = 'dist/server/wrangler.json';
if (!existsSync(configPath)) {
  console.log('[fix-wrangler-config] No generated wrangler.json found, skipping.');
  process.exit(0);
}

const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Pages provides ASSETS automatically — declaring it causes "reserved name" error
delete config.assets;

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
console.log('[fix-wrangler-config] Patched generated wrangler.json for Pages compatibility.');
