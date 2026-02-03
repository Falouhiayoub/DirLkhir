import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = neon(process.env.DATABASE_URL);

// Export a Drizzle instance for use across the app
export const db = drizzle(client);

export default db;
