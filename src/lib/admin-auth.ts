import { createHash, timingSafeEqual } from 'node:crypto';
import adminConfig from '../content/singletons/akun-admin/index.yaml';

const SESSION_COOKIE = 'salakan_admin_session';

export type AdminRole = 'superadmin' | 'admin' | 'editor';

export interface AdminUser {
  username: string;
  password: string;
  role: AdminRole;
}

export interface AdminSession {
  username: string;
  role: AdminRole;
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function normalizeRole(value: string | undefined): AdminRole {
  if (value === 'superadmin' || value === 'admin' || value === 'editor') {
    return value;
  }
  return 'editor';
}

function getKeystaticAdminUsers(): AdminUser[] {
  try {
    const parsed = adminConfig as
      | {
          gunakanPengaturanKeystatic?: boolean;
          users?: Array<{
            username?: string;
            password?: string;
            role?: string;
            status?: string;
          }>;
        }
      | null;

    if (!parsed?.gunakanPengaturanKeystatic || !Array.isArray(parsed.users)) {
      return [];
    }

    return parsed.users
      .map((item) => ({
        username: String(item.username ?? '').trim(),
        password: String(item.password ?? ''),
        role: normalizeRole(item.role),
        status: String(item.status ?? 'aktif'),
      }))
      .filter((item) => item.username && item.password && item.status === 'aktif')
      .map(({ username, password, role }) => ({
        username,
        password,
        role,
      }));
  } catch {
    return [];
  }
}

function getRawUsersConfig() {
  return process.env.ADMIN_USERS_JSON ?? import.meta.env.ADMIN_USERS_JSON ?? '';
}

export function getConfiguredAdminUsers(): AdminUser[] {
  const rawUsers = getRawUsersConfig().trim();

  if (rawUsers) {
    const parsed = safeJsonParse<Array<Partial<AdminUser>>>(rawUsers);
    if (Array.isArray(parsed)) {
      const users = parsed
        .map((item) => ({
          username: String(item.username ?? '').trim(),
          password: String(item.password ?? ''),
          role: normalizeRole(item.role),
        }))
        .filter((item) => item.username && item.password);

      if (users.length > 0) {
        return users;
      }
    }
  }

  const username = process.env.ADMIN_USERNAME ?? import.meta.env.ADMIN_USERNAME ?? '';
  const password = process.env.ADMIN_PASSWORD ?? import.meta.env.ADMIN_PASSWORD ?? '';
  const role =
    normalizeRole(process.env.ADMIN_ROLE ?? import.meta.env.ADMIN_ROLE ?? 'superadmin');

  if (username && password) {
    return [{ username, password, role }];
  }

  const keystaticUsers = getKeystaticAdminUsers();
  if (keystaticUsers.length > 0) {
    return keystaticUsers;
  }

  return [];
}

function createUserSignature(user: AdminUser | AdminSession, password: string) {
  return sha256(
    `${user.username}:${user.role}:${password}:padukuhan-salakan-admin-session`
  );
}

function encodePart(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decodePart(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

export function isAdminConfigured() {
  return getConfiguredAdminUsers().length > 0;
}

export function validateAdminLogin(
  inputUsername: string,
  inputPassword: string
): AdminSession | null {
  const user = getConfiguredAdminUsers().find(
    (item) => item.username === inputUsername && item.password === inputPassword
  );

  if (!user) return null;

  return { username: user.username, role: user.role };
}

export function createAdminSessionValue(session: AdminSession) {
  const user = getConfiguredAdminUsers().find(
    (item) => item.username === session.username && item.role === session.role
  );

  if (!user) return '';

  const payload = `${encodePart(session.username)}.${encodePart(session.role)}`;
  const signature = createUserSignature(session, user.password);
  return `${payload}.${signature}`;
}

export function getAdminSession(input: string | undefined): AdminSession | null {
  if (!input) return null;

  const parts = input.split('.');
  if (parts.length !== 3) return null;

  const [usernamePart, rolePart, signature] = parts;

  try {
    const session = {
      username: decodePart(usernamePart),
      role: normalizeRole(decodePart(rolePart)),
    } satisfies AdminSession;

    const user = getConfiguredAdminUsers().find(
      (item) => item.username === session.username && item.role === session.role
    );

    if (!user) return null;

    const expected = createUserSignature(session, user.password);
    const inputBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (inputBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!timingSafeEqual(inputBuffer, expectedBuffer)) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function isValidAdminSession(input: string | undefined) {
  return Boolean(getAdminSession(input));
}

export function hasMinimumRole(
  session: AdminSession | null,
  minimumRole: AdminRole
) {
  if (!session) return false;

  const rank: Record<AdminRole, number> = {
    editor: 1,
    admin: 2,
    superadmin: 3,
  };

  return rank[session.role] >= rank[minimumRole];
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}
