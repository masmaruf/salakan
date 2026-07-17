import { defineMiddleware } from 'astro:middleware';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
} as const;

const ONE_DAY = 60 * 60 * 24;

function isPublicMetadataPath(pathname: string) {
  return (
    pathname === '/robots.txt' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/sitemap-index.xml' ||
    /^\/sitemap-\d+\.xml$/.test(pathname)
  );
}

export const onRequest = defineMiddleware(async ({ request, url }, next) => {
  const response = await next();

  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }

  response.headers.append('Vary', 'Accept-Encoding');

  if (request.method === 'GET' && isPublicMetadataPath(url.pathname) && !response.headers.has('Cache-Control')) {
    response.headers.set(
      'Cache-Control',
      `public, max-age=3600, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_DAY}`,
    );
  }

  return response;
});
