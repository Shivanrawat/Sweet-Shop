import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  authenticateToken, 
  requireAdmin, 
  generateToken, 
  hashPassword, 
  comparePassword,
  type AuthRequest 
} from "./auth";
import { 
  registerUserSchema, 
  loginUserSchema, 
  insertSweetSchema,
  updateSweetSchema,
  searchSweetsSchema,
  purchaseSchema,
  restockSchema,
  type Category
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(validatedData.password);
      const user = await storage.createUser({
        username: validatedData.username,
        password: hashedPassword,
      });

      const userWithoutPassword = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      const token = generateToken(userWithoutPassword);

      return res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(validatedData.username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const isValidPassword = await comparePassword(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const userWithoutPassword = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      const token = generateToken(userWithoutPassword);

      return res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Sweets Routes (Protected)
  app.get("/api/sweets", authenticateToken, async (req, res) => {
    try {
      const sweets = await storage.getAllSweets();
      return res.json(sweets);
    } catch (error) {
      console.error("Get sweets error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/sweets/search", authenticateToken, async (req, res) => {
    try {
      const query = searchSweetsSchema.parse(req.query);
      const sweets = await storage.searchSweets({
        name: query.name,
        category: query.category as Category,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
      });
      return res.json(sweets);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Search sweets error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/sweets", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSweetSchema.parse(req.body);
      const sweet = await storage.createSweet(validatedData);
      return res.status(201).json(sweet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Create sweet error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/sweets/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateSweetSchema.parse(req.body);
      
      const existingSweet = await storage.getSweetById(id);
      if (!existingSweet) {
        return res.status(404).json({ message: "Sweet not found" });
      }

      const sweet = await storage.updateSweet(id, validatedData);
      return res.json(sweet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Update sweet error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/sweets/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      const existingSweet = await storage.getSweetById(id);
      if (!existingSweet) {
        return res.status(404).json({ message: "Sweet not found" });
      }

      const deleted = await storage.deleteSweet(id);
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete sweet" });
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Delete sweet error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Inventory Routes
  app.post("/api/sweets/:id/purchase", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { quantity } = purchaseSchema.parse(req.body);
      
      const sweet = await storage.getSweetById(id);
      if (!sweet) {
        return res.status(404).json({ message: "Sweet not found" });
      }

      if (sweet.quantity < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      const updatedSweet = await storage.updateSweetQuantity(id, -quantity);
      
      const totalPrice = (parseFloat(sweet.price) * quantity).toFixed(2);
      await storage.createPurchase({
        userId: req.user!.id,
        sweetId: id,
        quantity,
        totalPrice,
      });

      return res.json({ 
        message: "Purchase successful", 
        sweet: updatedSweet,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Purchase error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/sweets/:id/restock", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = restockSchema.parse(req.body);
      
      const sweet = await storage.getSweetById(id);
      if (!sweet) {
        return res.status(404).json({ message: "Sweet not found" });
      }

      const updatedSweet = await storage.updateSweetQuantity(id, quantity);

      return res.json({ 
        message: "Restock successful", 
        sweet: updatedSweet,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Restock error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app.get("/api/user/purchases", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const history = await storage.getUserPurchases(req.user!.id);
      return res.json(history);
    } catch (error) {
      console.error("Fetch history error:", error);
      return res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  return httpServer;
}
