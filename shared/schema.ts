import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const rooms = sqliteTable("rooms", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  color: text("color").notNull().default("#FF6600"),
});

export const bins = sqliteTable("bins", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  roomId: text("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
});

export const items = sqliteTable("items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  quantity: integer("quantity").notNull().default(1),
  value: real("value").notNull().default(0),
  photoUrl: text("photo_url"),
  binId: text("bin_id").notNull().references(() => bins.id, { onDelete: "cascade" }),
});

export const roomsRelations = relations(rooms, ({ many }) => ({
  bins: many(bins),
}));

export const binsRelations = relations(bins, ({ one, many }) => ({
  room: one(rooms, {
    fields: [bins.roomId],
    references: [rooms.id],
  }),
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  bin: one(bins, {
    fields: [items.binId],
    references: [bins.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
});

export const insertBinSchema = createInsertSchema(bins).omit({
  id: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

export type InsertBin = z.infer<typeof insertBinSchema>;
export type Bin = typeof bins.$inferSelect;

export type InsertItem = z.infer<typeof insertItemSchema>;
export type Item = typeof items.$inferSelect;
