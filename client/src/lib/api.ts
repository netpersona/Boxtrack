import type { Room, Bin, Item, InsertRoom, InsertBin, InsertItem } from "@shared/schema";

const API_BASE = "/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export const roomsApi = {
  getAll: async (): Promise<Room[]> => {
    const response = await fetch(`${API_BASE}/rooms`);
    return handleResponse(response);
  },
  
  getById: async (id: string): Promise<Room> => {
    const response = await fetch(`${API_BASE}/rooms/${id}`);
    return handleResponse(response);
  },
  
  create: async (room: InsertRoom): Promise<Room> => {
    const response = await fetch(`${API_BASE}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    });
    return handleResponse(response);
  },
  
  update: async (id: string, room: Partial<InsertRoom>): Promise<Room> => {
    const response = await fetch(`${API_BASE}/rooms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(room),
    });
    return handleResponse(response);
  },
  
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/rooms/${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};

export const binsApi = {
  getAll: async (roomId?: string): Promise<Bin[]> => {
    const url = roomId 
      ? `${API_BASE}/bins?roomId=${roomId}`
      : `${API_BASE}/bins`;
    const response = await fetch(url);
    return handleResponse(response);
  },
  
  getById: async (id: string): Promise<Bin> => {
    const response = await fetch(`${API_BASE}/bins/${id}`);
    return handleResponse(response);
  },
  
  create: async (bin: InsertBin): Promise<Bin> => {
    const response = await fetch(`${API_BASE}/bins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bin),
    });
    return handleResponse(response);
  },
  
  update: async (id: string, bin: Partial<InsertBin>): Promise<Bin> => {
    const response = await fetch(`${API_BASE}/bins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bin),
    });
    return handleResponse(response);
  },
  
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/bins/${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};

export const itemsApi = {
  getAll: async (binId?: string): Promise<Item[]> => {
    const url = binId 
      ? `${API_BASE}/items?binId=${binId}`
      : `${API_BASE}/items`;
    const response = await fetch(url);
    return handleResponse(response);
  },
  
  getById: async (id: string): Promise<Item> => {
    const response = await fetch(`${API_BASE}/items/${id}`);
    return handleResponse(response);
  },
  
  create: async (item: InsertItem): Promise<Item> => {
    const response = await fetch(`${API_BASE}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return handleResponse(response);
  },
  
  update: async (id: string, item: Partial<InsertItem>): Promise<Item> => {
    const response = await fetch(`${API_BASE}/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    return handleResponse(response);
  },
  
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/items/${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },
};
