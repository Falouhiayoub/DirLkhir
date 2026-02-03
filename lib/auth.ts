import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import {
  createUser,
  getUserByEmail,
  getSession,
  createSession,
  deleteSession,
  getPasswordHash,
  getUserById,
} from './db';
import type { User } from './db';

const SESSION_COOKIE_NAME = 'dir_khir_session';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  neighborhood: string,
  phone?: string,
  role: 'user' | 'admin' = 'user'
): Promise<User> {
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Validate password strength
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password);
  return createUser(email, passwordHash, fullName, neighborhood, phone, role);
}

export async function loginUser(email: string, password: string): Promise<User> {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const passwordHash = await getPasswordHash(user.id);
  if (!passwordHash) {
    throw new Error('Invalid email or password');
  }

  const isValid = await verifyPassword(password, passwordHash);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  return user;
}

export async function setSessionCookie(userId: number): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  const session = await createSession(userId, expiresAt.toISOString());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  const session = await getSession(sessionId);
  if (!session) {
    await clearSessionCookie();
    return null;
  }

  return getUserById(session.user_id);
}
