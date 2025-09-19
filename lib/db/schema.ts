import { integer, pgTable, serial, text, timestamp, varchar, PgEnum, pgEnum } from 'drizzle-orm/pg-core';

export const userSystemEnum = pgEnum('user_system_enum', ['assistant', 'user']);

export const chats = pgTable('chats', {
    id: serial('id').primaryKey(),
    pdfName: text('pdf_name').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    userId: varchar('user_id', {length: 256}).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    fileKey: text('file_key').notNull()
});

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    chatId: integer('chat_id').references(() => chats.id).notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    role: userSystemEnum('role').notNull()
})

export type DrizzleMessages = typeof messages.$inferSelect;
