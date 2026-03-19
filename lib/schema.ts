import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const extractions = sqliteTable('extractions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  url: text('url').notNull(),
  platform: text('platform').notNull(),
  title: text('title'),
  thumbnailUrl: text('thumbnail_url'),
  videoUrl: text('video_url'),
  transcript: text('transcript'),
  contentType: text('content_type').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type Extraction = typeof extractions.$inferSelect;
