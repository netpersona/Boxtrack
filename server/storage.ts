import { 
  type User, 
  type InsertUser,
  type Room,
  type InsertRoom,
  type Bin,
  type InsertBin,
  type Item,
  type InsertItem,
  users,
  rooms,
  bins,
  items
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getRooms(): Promise<Room[]>;
  getRoom(id: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: string, room: Partial<InsertRoom>): Promise<Room | undefined>;
  deleteRoom(id: string): Promise<void>;
  
  getBins(): Promise<Bin[]>;
  getBin(id: string): Promise<Bin | undefined>;
  getBinsByRoom(roomId: string): Promise<Bin[]>;
  createBin(bin: InsertBin): Promise<Bin>;
  updateBin(id: string, bin: Partial<InsertBin>): Promise<Bin | undefined>;
  deleteBin(id: string): Promise<void>;
  
  getItems(): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  getItemsByBin(binId: string): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: string, item: Partial<InsertItem>): Promise<Item | undefined>;
  deleteItem(id: string): Promise<void>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    await db.insert(users).values({ ...insertUser, id });
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getRooms(): Promise<Room[]> {
    return await db.select().from(rooms);
  }

  async getRoom(id: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room || undefined;
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const id = crypto.randomUUID();
    await db.insert(rooms).values({ ...room, id });
    const [newRoom] = await db.select().from(rooms).where(eq(rooms.id, id));
    return newRoom;
  }

  async updateRoom(id: string, room: Partial<InsertRoom>): Promise<Room | undefined> {
    await db.update(rooms).set(room).where(eq(rooms.id, id));
    const [updated] = await db.select().from(rooms).where(eq(rooms.id, id));
    return updated || undefined;
  }

  async deleteRoom(id: string): Promise<void> {
    await db.delete(rooms).where(eq(rooms.id, id));
  }

  async getBins(): Promise<Bin[]> {
    return await db.select().from(bins);
  }

  async getBin(id: string): Promise<Bin | undefined> {
    const [bin] = await db.select().from(bins).where(eq(bins.id, id));
    return bin || undefined;
  }

  async getBinsByRoom(roomId: string): Promise<Bin[]> {
    return await db.select().from(bins).where(eq(bins.roomId, roomId));
  }

  async createBin(bin: InsertBin): Promise<Bin> {
    const id = crypto.randomUUID();
    await db.insert(bins).values({ ...bin, id });
    const [newBin] = await db.select().from(bins).where(eq(bins.id, id));
    return newBin;
  }

  async updateBin(id: string, bin: Partial<InsertBin>): Promise<Bin | undefined> {
    await db.update(bins).set(bin).where(eq(bins.id, id));
    const [updated] = await db.select().from(bins).where(eq(bins.id, id));
    return updated || undefined;
  }

  async deleteBin(id: string): Promise<void> {
    await db.delete(bins).where(eq(bins.id, id));
  }

  async getItems(): Promise<Item[]> {
    return await db.select().from(items);
  }

  async getItem(id: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async getItemsByBin(binId: string): Promise<Item[]> {
    return await db.select().from(items).where(eq(items.binId, binId));
  }

  async createItem(item: InsertItem): Promise<Item> {
    const id = crypto.randomUUID();
    await db.insert(items).values({ ...item, id });
    const [newItem] = await db.select().from(items).where(eq(items.id, id));
    return newItem;
  }

  async updateItem(id: string, item: Partial<InsertItem>): Promise<Item | undefined> {
    await db.update(items).set(item).where(eq(items.id, id));
    const [updated] = await db.select().from(items).where(eq(items.id, id));
    return updated || undefined;
  }

  async deleteItem(id: string): Promise<void> {
    await db.delete(items).where(eq(items.id, id));
  }
}

export const storage = new DatabaseStorage();
