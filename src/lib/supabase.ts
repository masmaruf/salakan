export function getSupabaseSetupSummary() {
  return {
    localEnv: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
    cloudflareEnv: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
  };
}
