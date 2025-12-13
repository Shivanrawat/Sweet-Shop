import { 
  users, sweets, purchases,
  type User, type InsertUser, 
  type Sweet, type InsertSweet,
  type Purchase, type InsertPurchase,
  type Category
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, and, gte, lte, sql, desc } from "drizzle-orm"; // Added 'desc'

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { role?: "user" | "admin" }): Promise<User>;
  
  getAllSweets(): Promise<Sweet[]>;
  getSweetById(id: string): Promise<Sweet | undefined>;
  searchSweets(params: {
    name?: string;
    category?: Category;
    minPrice?: string;
    maxPrice?: string;
  }): Promise<Sweet[]>;
  createSweet(sweet: InsertSweet): Promise<Sweet>;
  updateSweet(id: string, sweet: Partial<InsertSweet>): Promise<Sweet | undefined>;
  deleteSweet(id: string): Promise<boolean>;
  updateSweetQuantity(id: string, quantityChange: number): Promise<Sweet | undefined>;
  
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getUserPurchases(userId: string): Promise<(Purchase & { sweet: Sweet })[]>; // Added
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser & { role?: "user" | "admin" }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        role: insertUser.role || "user",
      })
      .returning();
    return user;
  }

  async getAllSweets(): Promise<Sweet[]> {
    return db.select().from(sweets);
  }

  async getSweetById(id: string): Promise<Sweet | undefined> {
    const [sweet] = await db.select().from(sweets).where(eq(sweets.id, id));
    return sweet || undefined;
  }

  async searchSweets(params: {
    name?: string;
    category?: Category;
    minPrice?: string;
    maxPrice?: string;
  }): Promise<Sweet[]> {
    const conditions = [];
    
    if (params.name) {
      conditions.push(ilike(sweets.name, `%${params.name}%`));
    }
    if (params.category) {
      conditions.push(eq(sweets.category, params.category));
    }
    if (params.minPrice) {
      conditions.push(gte(sweets.price, params.minPrice));
    }
    if (params.maxPrice) {
      conditions.push(lte(sweets.price, params.maxPrice));
    }

    if (conditions.length === 0) {
      return this.getAllSweets();
    }

    return db.select().from(sweets).where(and(...conditions));
  }

  async createSweet(insertSweet: InsertSweet): Promise<Sweet> {
    const [sweet] = await db
      .insert(sweets)
      .values(insertSweet)
      .returning();
    return sweet;
  }

  async updateSweet(id: string, updates: Partial<InsertSweet>): Promise<Sweet | undefined> {
    const [sweet] = await db
      .update(sweets)
      .set(updates)
      .where(eq(sweets.id, id))
      .returning();
    return sweet || undefined;
  }

  async deleteSweet(id: string): Promise<boolean> {
    const result = await db.delete(sweets).where(eq(sweets.id, id)).returning();
    return result.length > 0;
  }

  async updateSweetQuantity(id: string, quantityChange: number): Promise<Sweet | undefined> {
    const [sweet] = await db
      .update(sweets)
      .set({
        quantity: sql`${sweets.quantity} + ${quantityChange}`,
      })
      .where(eq(sweets.id, id))
      .returning();
    return sweet || undefined;
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db
      .insert(purchases)
      .values(insertPurchase)
      .returning();
    return purchase;
  }

  async getUserPurchases(userId: string): Promise<(Purchase & { sweet: Sweet })[]> {
    const result = await db.query.purchases.findMany({
      where: eq(purchases.userId, userId),
      with: {
        sweet: true
      },
      orderBy: (purchases) => [desc(purchases.purchasedAt)],
    });
    return result as (Purchase & { sweet: Sweet })[];
  }
}

export const storage = new DatabaseStorage();