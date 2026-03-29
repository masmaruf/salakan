import { defineMiddleware } from 'astro:middleware';
import {
  getAdminSession,
  getSessionCookieName,
  hasMinimumRole,
  isAdminConfigured,
} from './lib/admin-auth';
import { isEditorAllowedCollectionKey } from './lib/keystatic-role-config';

const ADMIN_PATHS = ['/keystatic', '/api/keystatic'];
const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_LOGOUT_PATH = '/admin/logout';
const ADMIN_USERS_PATH = '/admin/users';
const ADMIN_FORBIDDEN_PATH = '/admin/forbidden';
function isProtectedPath(pathname: string) {
  return ADMIN_PATHS.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isAdminPath(pathname: string) {
  return (
    isProtectedPath(pathname) ||
    pathname === ADMIN_LOGIN_PATH ||
    pathname === ADMIN_LOGOUT_PATH ||
    pathname === ADMIN_USERS_PATH ||
    pathname === ADMIN_FORBIDDEN_PATH
  );
}

function getKeystaticSection(pathname: string) {
  const match = pathname.match(/^\/keystatic\/(collection|singleton)\/([^/]+)/);
  if (!match) return null;
  return { type: match[1], key: match[2] };
}

function isEditorAllowedKeystaticPath(pathname: string) {
  if (pathname === '/keystatic' || pathname === '/keystatic/') return true;

  const section = getKeystaticSection(pathname);
  if (!section) return true;

  if (section.type === 'collection') {
    return isEditorAllowedCollectionKey(section.key);
  }

  return false;
}

function withAdminHeaders(response: Response) {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (!isAdminPath(context.url.pathname)) {
    return next();
  }

  if (
    context.url.pathname === ADMIN_LOGIN_PATH ||
    context.url.pathname === ADMIN_LOGOUT_PATH ||
    context.url.pathname === ADMIN_FORBIDDEN_PATH
  ) {
    const response = await next();
    return withAdminHeaders(response);
  }

  if (!isAdminConfigured()) {
    return withAdminHeaders(
      new Response(
      'Akses admin belum dikonfigurasi. Atur ADMIN_USERNAME dan ADMIN_PASSWORD terlebih dahulu.',
      {
        status: 503,
      }
    ));
  }

  const sessionCookie = context.cookies.get(getSessionCookieName())?.value;
  const session = getAdminSession(sessionCookie);

  if (context.url.pathname === ADMIN_USERS_PATH) {
    if (!hasMinimumRole(session, 'superadmin')) {
      const loginUrl = new URL(ADMIN_LOGIN_PATH, context.url);
      loginUrl.searchParams.set('next', context.url.pathname);
      return withAdminHeaders(context.redirect(loginUrl.toString()));
    }

    const response = await next();
    return withAdminHeaders(response);
  }

  if (session) {
    if (session.role === 'editor' && context.url.pathname.startsWith('/keystatic')) {
      if (context.url.pathname === '/keystatic' || context.url.pathname === '/keystatic/') {
        return withAdminHeaders(context.redirect('/keystatic/collection/pengumuman'));
      }

      if (!isEditorAllowedKeystaticPath(context.url.pathname)) {
        const forbiddenUrl = new URL(ADMIN_FORBIDDEN_PATH, context.url);
        forbiddenUrl.searchParams.set('area', context.url.pathname);
        return withAdminHeaders(context.redirect(forbiddenUrl.toString()));
      }
    }

    const response = await next();
    return withAdminHeaders(response);
  }

  const loginUrl = new URL(ADMIN_LOGIN_PATH, context.url);
  loginUrl.searchParams.set(
    'next',
    `${context.url.pathname}${context.url.search}`
  );

  return withAdminHeaders(context.redirect(loginUrl.toString()));
});
