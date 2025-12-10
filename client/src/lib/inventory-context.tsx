import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// --- Types ---

export type Item = {
  id: string;
  name: string;
  quantity: number;
  value: number;
  binId: string;
  description?: string;
  tags?: string[];
  photoUrl?: string;
};

export type Bin = {
  id: string;
  name: string;
  roomId: string;
  description?: string;
  color?: string;
};

export type Room = {
  id: string;
  name: string;
  description?: string;
};

type InventoryContextType = {
  rooms: Room[];
  bins: Bin[];
  items: Item[];
  addRoom: (room: Omit<Room, "id">) => void;
  addBin: (bin: Omit<Bin, "id">) => void;
  addItem: (item: Omit<Item, "id">) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  getBinItems: (binId: string) => Item[];
  getRoomBins: (roomId: string) => Bin[];
  getTotalValue: () => number;
  getTotalItems: () => number;
};

// --- Mock Data ---

const MOCK_ROOMS: Room[] = [
  { id: "room-1", name: "Basement Storage", description: "Main storage area downstairs" },
  { id: "room-2", name: "Garage", description: "Tools and outdoor equipment" },
  { id: "room-3", name: "Attic", description: "Seasonal decorations and archives" },
];

const MOCK_BINS: Bin[] = [
  { id: "bin-1", name: "Holiday Decorations", roomId: "room-1", description: "Xmas lights and ornaments", color: "red" },
  { id: "bin-2", name: "Camping Gear", roomId: "room-2", description: "Tents, sleeping bags", color: "green" },
  { id: "bin-3", name: "Old Electronics", roomId: "room-1", description: "Cables, old phones", color: "blue" },
  { id: "bin-4", name: "Winter Clothes", roomId: "room-3", description: "Coats, scarves, boots", color: "gray" },
];

const MOCK_ITEMS: Item[] = [
  { id: "item-1", name: "LED String Lights", quantity: 4, value: 15, binId: "bin-1", description: "Warm white, 50ft" },
  { id: "item-2", name: "Glass Ornaments", quantity: 24, value: 2, binId: "bin-1", description: "Vintage red and gold" },
  { id: "item-3", name: "2-Person Tent", quantity: 1, value: 120, binId: "bin-2", description: "REI Half Dome" },
  { id: "item-4", name: "Sleeping Bag", quantity: 2, value: 80, binId: "bin-2", description: "Rated for 20F" },
  { id: "item-5", name: "HDMI Cables", quantity: 10, value: 5, binId: "bin-3", description: "Assorted lengths" },
  { id: "item-6", name: "Old iPhone 8", quantity: 1, value: 50, binId: "bin-3", description: "Screen cracked" },
];

// --- Context ---

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Helper for ID generation
const generateId = () => Math.random().toString(36).substr(2, 9);

export function InventoryProvider({ children }: { children: ReactNode }) {
  // Initialize with mock data
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [bins, setBins] = useState<Bin[]>(MOCK_BINS);
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);

  const addRoom = (room: Omit<Room, "id">) => {
    setRooms([...rooms, { ...room, id: generateId() }]);
  };

  const addBin = (bin: Omit<Bin, "id">) => {
    setBins([...bins, { ...bin, id: generateId() }]);
  };

  const addItem = (item: Omit<Item, "id">) => {
    setItems([...items, { ...item, id: generateId() }]);
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getBinItems = (binId: string) => items.filter((item) => item.binId === binId);
  const getRoomBins = (roomId: string) => bins.filter((bin) => bin.roomId === roomId);
  
  const getTotalValue = () => items.reduce((acc, item) => acc + (item.value * item.quantity), 0);
  const getTotalItems = () => items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <InventoryContext.Provider
      value={{
        rooms,
        bins,
        items,
        addRoom,
        addBin,
        addItem,
        updateItem,
        deleteItem,
        getBinItems,
        getRoomBins,
        getTotalValue,
        getTotalItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
