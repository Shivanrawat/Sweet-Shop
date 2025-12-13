import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("user"),
});

export const usersRelations = relations(users, ({ many }) => ({
  purchases: many(purchases),
}));

export const categoryEnum = pgEnum("category", [
  "chocolates",
  "gummies",
  "hard_candies",
  "lollipops",
  "caramels",
  "jellies",
  "licorice",
  "mints",
]);

export const sweets = pgTable("sweets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: categoryEnum("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  imageUrl: text("image_url"),
});

export const sweetsRelations = relations(sweets, ({ many }) => ({
  purchases: many(purchases),
}));

export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sweetId: varchar("sweet_id").notNull().references(() => sweets.id),
  quantity: integer("quantity").notNull().default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  purchasedAt: timestamp("purchased_at").notNull().default(sql`now()`),
});

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
  sweet: one(sweets, {
    fields: [purchases.sweetId],
    references: [sweets.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const registerUserSchema = insertUserSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertSweetSchema = createInsertSchema(sweets).omit({
  id: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  price: z.string().regex(/^\d+\.?\d{0,2}$/, "Invalid price format"),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
});

export const updateSweetSchema = insertSweetSchema.partial();

export const searchSweetsSchema = z.object({
  name: z.string().optional(),
  category: z.enum([
    "chocolates",
    "gummies",
    "hard_candies",
    "lollipops",
    "caramels",
    "jellies",
    "licorice",
    "mints",
  ]).optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});

export const purchaseSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const restockSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserWithoutPassword = Omit<User, "password">;

export type InsertSweet = z.infer<typeof insertSweetSchema>;
export type Sweet = typeof sweets.$inferSelect;

export type InsertPurchase = typeof purchases.$inferInsert;
export type Purchase = typeof purchases.$inferSelect;

export type Category = "chocolates" | "gummies" | "hard_candies" | "lollipops" | "caramels" | "jellies" | "licorice" | "mints";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "chocolates", label: "Chocolates" },
  { value: "gummies", label: "Gummies" },
  { value: "hard_candies", label: "Hard Candies" },
  { value: "lollipops", label: "Lollipops" },
  { value: "caramels", label: "Caramels" },
  { value: "jellies", label: "Jellies" },
  { value: "licorice", label: "Licorice" },
  { value: "mints", label: "Mints" },
];
