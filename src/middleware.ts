import { defineMiddleware } from 'astro:middleware';
import {
  getAdminSession,
  getSessionCookieName,
  hasMinimumRole,
  isAdminConfigured,
} from './lib/admin-auth';

const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_LOGOUT_PATH = '/admin/logout';
const ADMIN_USERS_PATH = '/admin/users';
const ADMIN_FORBIDDEN_PATH = '/admin/forbidden';

const ADMIN_PATHS = [
  ADMIN_LOGIN_PATH,
  ADMIN_LOGOUT_PATH,
  ADMIN_USERS_PATH,
  ADMIN_FORBIDDEN_PATH,
];

function isAdminPath(pathname: string) {
  return ADMIN_PATHS.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
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
      new Response('Akses admin belum dikonfigurasi. Atur ADMIN_USERNAME dan ADMIN_PASSWORD terlebih dahulu.', {
        status: 503,
      })
    );
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
    const response = await next();
    return withAdminHeaders(response);
  }

  const loginUrl = new URL(ADMIN_LOGIN_PATH, context.url);
  loginUrl.searchParams.set('next', `${context.url.pathname}${context.url.search}`);

  return withAdminHeaders(context.redirect(loginUrl.toString()));
});
