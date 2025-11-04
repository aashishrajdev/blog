import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Article table (formerly Video table)
export const articles = pgTable("articles", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  description: text("description").notNull(),
  coverImageUrl: text("cover_image_url"),
  categoryIds: text("category_ids"), // JSON array of category IDs, e.g., '["id1","id2"]'
  authorId: text("author_id").notNull(),
  authorName: text("author_name"),
  authorEmail: text("author_email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Category table
export const categories = pgTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  color: text("color").notNull(), // Hex color code for the category
  isPredefined: text("is_predefined").notNull().default("false"), // "true" or "false" as text
  createdById: text("created_by_id"), // null for predefined categories
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Comment table
export const comments = pgTable("comments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  articleId: text("article_id").notNull(),
  userId: text("user_id").notNull(),
  userName: text("user_name"),
  userEmail: text("user_email").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports for use in the application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

// Zod schemas derived from Drizzle tables
export const userInsertSchema = createInsertSchema(users, {
  email: z.string().email(),
  password: z.string().min(8),
});

export const userSelectSchema = createSelectSchema(users);

export const articleInsertSchema = createInsertSchema(articles, {
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  description: z.string().min(1).max(500),
  coverImageUrl: z.string().url().optional().nullable(),
  categoryIds: z.string().optional().nullable(), // JSON string of array
  authorId: z.string().min(1),
  authorName: z.string().optional().nullable(),
  authorEmail: z.string().email(),
});

export const articleSelectSchema = createSelectSchema(articles);

export const categoryInsertSchema = createInsertSchema(categories, {
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  isPredefined: z.string().optional(),
  createdById: z.string().optional().nullable(),
});

export const categorySelectSchema = createSelectSchema(categories);

export const commentInsertSchema = createInsertSchema(comments, {
  articleId: z.string().min(1),
  userId: z.string().min(1),
  userName: z.string().optional().nullable(),
  userEmail: z.string().email(),
  content: z.string().min(1).max(1000),
});

export const commentSelectSchema = createSelectSchema(comments);
