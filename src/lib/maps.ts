function extractIframeSrc(embedHtml?: string) {
  if (!embedHtml) return '';

  const match = embedHtml.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
  return match?.[1]?.trim() ?? '';
}

function isTrustedMapHost(value: string) {
  try {
    const url = new URL(value);
    return ['maps.google.com', 'www.google.com', 'google.com'].includes(url.hostname) || url.hostname.endsWith('.google.com');
  } catch {
    return false;
  }
}

export function resolveMapEmbedSrc(params: { embedHtml?: string; fallbackUrl?: string }) {
  const iframeSrc = extractIframeSrc(params.embedHtml);
  const candidate = iframeSrc || params.fallbackUrl?.trim() || '';

  if (!candidate) return '';
  return isTrustedMapHost(candidate) ? candidate : '';
}
