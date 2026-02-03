import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    password_hash: varchar('password_hash', { length: 255 }).notNull(),
    full_name: varchar('full_name', { length: 255 }).notNull(),
    neighborhood: varchar('neighborhood', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    avatar_url: varchar('avatar_url', { length: 500 }),
    bio: text('bio'),
    role: varchar('role', { length: 50 }).default('user').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex('users_email_idx').on(table.email),
    };
  }
);

export const needs = pgTable('needs', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).default('open').notNull(),
  neighborhood: varchar('neighborhood', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  expires_at: timestamp('expires_at'),
});

export const helpers = pgTable('helpers', {
  id: serial('id').primaryKey(),
  need_id: integer('need_id').notNull(),
  user_id: integer('user_id').notNull(),
  status: varchar('status', { length: 50 }).default('assigned').notNull(),
  message: text('message'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_id: integer('user_id').notNull(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
