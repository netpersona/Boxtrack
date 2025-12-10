import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";
import path from "path";
import fs from "fs";

const dataDir = process.env.BOXTRACK_DATA_DIR || ".";
if (dataDir !== "." && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "boxtrack.db");
const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    color TEXT NOT NULL DEFAULT '#FF6600'
  );
  
  CREATE TABLE IF NOT EXISTS bins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    room_id TEXT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
  );
  
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    quantity INTEGER NOT NULL DEFAULT 1,
    value REAL NOT NULL DEFAULT 0,
    photo_url TEXT,
    bin_id TEXT NOT NULL,
    FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE CASCADE
  );
`);

// Migration: Add color column to existing rooms table
try {
  sqlite.exec(`ALTER TABLE rooms ADD COLUMN color TEXT NOT NULL DEFAULT '#FF6600'`);
} catch (e) {
  // Column already exists, ignore
}

export const db = drizzle(sqlite, { schema });
