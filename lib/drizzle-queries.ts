import { db } from './drizzle';
import { users, needs, helpers, sessions } from './schema';
import { eq } from 'drizzle-orm';

// Users
export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] ?? null;
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] ?? null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  fullName: string,
  neighborhood: string,
  phone?: string,
  role: 'user' | 'admin' = 'user'
) {
  const [created] = await db
    .insert(users)
    .values({
      email,
      password_hash: passwordHash,
      full_name: fullName,
      neighborhood,
      phone: phone ?? null,
      role,
    })
    .returning();
  return created;
}

// Needs
export async function getNeedsByNeighborhood(neighborhood: string) {
  return db
    .select()
    .from(needs)
    .where(eq(needs.neighborhood, neighborhood))
    .orderBy(needs.created_at.desc());
}

export async function createNeed(
  userId: number,
  title: string,
  description: string,
  category: string,
  neighborhood: string,
  expiresAt?: string
) {
  const [created] = await db
    .insert(needs)
    .values({
      user_id: userId,
      title,
      description,
      category,
      neighborhood,
      expires_at: expiresAt ?? null,
    })
    .returning();
  return created;
}

export async function updateNeedStatus(needId: number, status: string) {
  const [updated] = await db
    .update(needs)
    .set({ status })
    .where(eq(needs.id, needId))
    .returning();
  return updated;
}

// Helpers
export async function assignHelperToNeed(needId: number, userId: number, message?: string) {
  const [created] = await db
    .insert(helpers)
    .values({ need_id: needId, user_id: userId, message: message ?? null })
    .returning();
  return created;
}

export async function getHelpersForNeed(needId: number) {
  return db.select().from(helpers).where(eq(helpers.need_id, needId)).orderBy(helpers.created_at.desc());
}

// Sessions
export async function createSession(userId: number, expiresAt: string) {
  const sessionId = `${userId}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const [created] = await db
    .insert(sessions)
    .values({ id: sessionId, user_id: userId, expires_at: expiresAt })
    .returning();
  return created;
}

export async function getSession(sessionId: string) {
  const result = await db.select().from(sessions).where(eq(sessions.id, sessionId));
  const s = result[0] ?? null;
  if (!s) return null;
  // let the caller check expiration if needed
  return s;
}

export async function deleteSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export default db;
