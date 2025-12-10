import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoomSchema, insertBinSchema, insertItemSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Health check endpoint for Docker
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get("/api/rooms", async (req, res) => {
    try {
      const rooms = await storage.getRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  });

  app.get("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.getRoom(req.params.id);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room" });
    }
  });

  app.post("/api/rooms", async (req, res) => {
    try {
      const validatedData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(validatedData);
      res.status(201).json(room);
    } catch (error) {
      res.status(400).json({ error: "Invalid room data" });
    }
  });

  app.patch("/api/rooms/:id", async (req, res) => {
    try {
      const validatedData = insertRoomSchema.partial().parse(req.body);
      const room = await storage.updateRoom(req.params.id, validatedData);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(400).json({ error: "Invalid room data" });
    }
  });

  app.delete("/api/rooms/:id", async (req, res) => {
    try {
      await storage.deleteRoom(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete room" });
    }
  });

  app.get("/api/bins", async (req, res) => {
    try {
      const roomId = req.query.roomId as string | undefined;
      const bins = roomId 
        ? await storage.getBinsByRoom(roomId)
        : await storage.getBins();
      res.json(bins);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bins" });
    }
  });

  app.get("/api/bins/:id", async (req, res) => {
    try {
      const bin = await storage.getBin(req.params.id);
      if (!bin) {
        return res.status(404).json({ error: "Bin not found" });
      }
      res.json(bin);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bin" });
    }
  });

  app.post("/api/bins", async (req, res) => {
    try {
      const validatedData = insertBinSchema.parse(req.body);
      const bin = await storage.createBin(validatedData);
      res.status(201).json(bin);
    } catch (error) {
      res.status(400).json({ error: "Invalid bin data" });
    }
  });

  app.patch("/api/bins/:id", async (req, res) => {
    try {
      const validatedData = insertBinSchema.partial().parse(req.body);
      const bin = await storage.updateBin(req.params.id, validatedData);
      if (!bin) {
        return res.status(404).json({ error: "Bin not found" });
      }
      res.json(bin);
    } catch (error) {
      res.status(400).json({ error: "Invalid bin data" });
    }
  });

  app.delete("/api/bins/:id", async (req, res) => {
    try {
      await storage.deleteBin(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete bin" });
    }
  });

  app.get("/api/items", async (req, res) => {
    try {
      const binId = req.query.binId as string | undefined;
      const items = binId 
        ? await storage.getItemsByBin(binId)
        : await storage.getItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.get("/api/items/:id", async (req, res) => {
    try {
      const item = await storage.getItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch item" });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const validatedData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid item data" });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    try {
      const validatedData = insertItemSchema.partial().parse(req.body);
      const item = await storage.updateItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid item data" });
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      await storage.deleteItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  return httpServer;
}
