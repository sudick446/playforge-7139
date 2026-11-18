import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export * from './auth-schema';
export const scores = sqliteTable('scores', {
 id: integer('id').primaryKey({autoIncrement:true}),
 userId: text('user_id').notNull(), game: text('game').notNull(),
 value: integer('value').notNull(), createdAt: text('created_at').notNull(),
});

/**
 * Define your database schema here, then apply it with `bun run db:push`
 * (from packages/web). Re-export any generated schema from this file
 * (e.g. Better Auth's auth-schema.ts) so drizzle generates complete migrations.
 * Table patterns and conventions: skills/app/references/api.md
 */
