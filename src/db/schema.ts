import { pgTable, uuid, varchar, integer, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gamesTable = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  releaseYear: integer("release_year").notNull(),
  gamingStudio: varchar("gaming_studio", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewsTable = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id").notNull().references(() => gamesTable.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  rating: integer("rating").notNull(), // Rating from 1 to 5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
