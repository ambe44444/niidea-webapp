import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_COOKIE = 'niidea_admin_session';
const SESSION_HOURS = 24;

function signingKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    `${process.env.CRON_SECRET ?? ''}|${process.env.ADMIN_PASSWORD ?? ''}|niidea`
  );
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', signingKey()).update(payload).digest('hex');
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!value) return false;

  const [expiresRaw, signature] = value.split('.');
  if (!expiresRaw || !signature) return false;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  return safeEqual(signature, sign(expiresRaw));
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = String(expires);
  cookieStore.set(ADMIN_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
