import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

let initialized = false;

async function initializeDatabase(): Promise<void> {
  if (initialized) return;
  
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        neighborhood VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        avatar_url VARCHAR(500),
        bio TEXT,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create needs table
    await sql`
      CREATE TABLE IF NOT EXISTS needs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        neighborhood VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP
      )
    `;

    // Create helpers table
    await sql`
      CREATE TABLE IF NOT EXISTS helpers (
        id SERIAL PRIMARY KEY,
        need_id INTEGER NOT NULL REFERENCES needs(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'assigned',
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(need_id, user_id)
      )
    `;

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_needs_user_id ON needs(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_needs_neighborhood ON needs(neighborhood)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_needs_status ON needs(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_helpers_need_id ON helpers(need_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_helpers_user_id ON helpers(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)`;

    initialized = true;
    console.log('[v0] Database initialized successfully');
  } catch (error) {
    console.error('[v0] Database initialization error:', error);
    throw error;
  }
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  neighborhood: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Need {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'completed';
  neighborhood: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface Helper {
  id: number;
  need_id: number;
  user_id: number;
  status: 'assigned' | 'completed';
  message?: string;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

// User operations
export async function getUserById(id: number): Promise<User | null> {
  await initializeDatabase();
  const result = await sql<User[]>`SELECT * FROM users WHERE id = ${id}`;
  return result[0] || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await initializeDatabase();
  const result = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
  return result[0] || null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  fullName: string,
  neighborhood: string,
  phone?: string,
  role: 'user' | 'admin' = 'user'
): Promise<User> {
  await initializeDatabase();
  const result = await sql<User[]>`
    INSERT INTO users (email, password_hash, full_name, neighborhood, phone, role)
    VALUES (${email}, ${passwordHash}, ${fullName}, ${neighborhood}, ${phone || null}, ${role})
    RETURNING *
  `;
  return result[0];
}

// Need operations
export async function getNeedsByNeighborhood(neighborhood: string): Promise<Need[]> {
  await initializeDatabase();
  return sql<Need[]>`
    SELECT * FROM needs 
    WHERE neighborhood = ${neighborhood} AND status != 'completed'
    ORDER BY created_at DESC
  `;
}

export async function getNeedById(id: number): Promise<Need | null> {
  const result = await sql<Need[]>`SELECT * FROM needs WHERE id = ${id}`;
  return result[0] || null;
}

export async function createNeed(
  userId: number,
  title: string,
  description: string,
  category: string,
  neighborhood: string,
  expiresAt?: string
): Promise<Need> {
  await initializeDatabase();
  const result = await sql<Need[]>`
    INSERT INTO needs (user_id, title, description, category, neighborhood, expires_at)
    VALUES (${userId}, ${title}, ${description}, ${category}, ${neighborhood}, ${expiresAt || null})
    RETURNING *
  `;
  return result[0];
}

export async function updateNeedStatus(
  needId: number,
  status: 'open' | 'in_progress' | 'completed'
): Promise<Need> {
  const result = await sql<Need[]>`
    UPDATE needs 
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${needId}
    RETURNING *
  `;
  return result[0];
}

// Helper operations
export async function assignHelperToNeed(
  needId: number,
  userId: number,
  message?: string
): Promise<Helper> {
  await initializeDatabase();
  const result = await sql<Helper[]>`
    INSERT INTO helpers (need_id, user_id, message)
    VALUES (${needId}, ${userId}, ${message || null})
    RETURNING *
  `;
  return result[0];
}

export async function getHelpersForNeed(needId: number): Promise<Helper[]> {
  return sql<Helper[]>`
    SELECT * FROM helpers 
    WHERE need_id = ${needId}
    ORDER BY created_at DESC
  `;
}

// Session operations
export async function createSession(
  userId: number,
  expiresAt: string
): Promise<Session> {
  await initializeDatabase();
  const sessionId = `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const result = await sql<Session[]>`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${sessionId}, ${userId}, ${expiresAt})
    RETURNING *
  `;
  return result[0];
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const result = await sql<Session[]>`
    SELECT * FROM sessions 
    WHERE id = ${sessionId} AND expires_at > CURRENT_TIMESTAMP
  `;
  return result[0] || null;
}

export async function deleteSession(sessionId: string): Promise<void> {
  await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
}

export async function getPasswordHash(userId: number): Promise<string | null> {
  const result = await sql<Array<{ password_hash: string }>>`
    SELECT password_hash FROM users WHERE id = ${userId}
  `;
  return result[0]?.password_hash || null;
}
