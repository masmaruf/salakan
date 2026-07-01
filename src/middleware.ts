import { defineMiddleware } from 'astro:middleware';
import {
  getAdminSession,
  getSessionCookieName,
  hasMinimumRole,
  isAdminConfigured,
} from './lib/admin-auth';

const ADMIN_PREFIX = '/admin';
const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_LOGOUT_PATH = '/admin/logout';
const ADMIN_USERS_PATH = '/admin/users';
const ADMIN_FORBIDDEN_PATH = '/admin/forbidden';

function isAdminPath(pathname: string) {
  return pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
}

function withAdminHeaders(response: Response) {
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

function syncRuntimeEnvToProcess(context: any) {
  const runtimeEnv = context?.locals?.runtime?.env;
  if (!runtimeEnv || typeof runtimeEnv !== 'object') return;

  const envKeys = [
    'ADMIN_USERS_JSON',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'ADMIN_ROLE',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_KEY',
    'PUBLIC_SUPABASE_URL',
    'PUBLIC_SUPABASE_ANON_KEY',
    'CF_PAGES_URL',
  ] as const;

  for (const key of envKeys) {
    const value = runtimeEnv[key];
    if (typeof value === 'string' && value.length > 0) {
      process.env[key] = value;
    }
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  syncRuntimeEnvToProcess(context);

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
      new Response('Akses admin belum dikonfigurasi. Atur ADMIN_USERS_JSON atau ADMIN_USERNAME dan ADMIN_PASSWORD terlebih dahulu.', {
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
