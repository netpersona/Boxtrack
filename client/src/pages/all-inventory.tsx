import { useItems, useBins, useRooms } from "@/lib/hooks";
import { Link } from "wouter";
import { Package, ArrowLeft, DollarSign, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AllInventory() {
  const { data: items = [], isLoading } = useItems();
  const { data: bins = [] } = useBins();
  const { data: rooms = [] } = useRooms();
  const [searchTerm, setSearchTerm] = useState("");

  const getBinName = (binId: string) => bins.find(b => b.id === binId)?.name || "Unknown";
  const getRoomForBin = (binId: string) => {
    const bin = bins.find(b => b.id === binId);
    if (!bin) return null;
    return rooms.find(r => r.id === bin.roomId);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = items.reduce((acc, item) => acc + (Number(item.value) * item.quantity), 0);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b-2 border-border pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Command Center</Link> /
          <span className="text-primary">All Inventory</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              Complete Inventory
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-2">
              All tracked assets across all zones and storage units
            </p>
          </div>
          
          <div className="flex gap-4 text-center">
            <div className="bg-primary/10 border-2 border-primary px-6 py-3">
              <div className="text-2xl font-black text-primary">{totalCount}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Items</div>
            </div>
            <div className="bg-card border-2 border-border px-6 py-3">
              <div className="text-2xl font-black">${totalValue.toLocaleString()}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search all items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 font-mono bg-card border-2 border-border focus:border-primary"
          data-testid="input-search-inventory"
        />
      </div>

      {/* Items Table */}
      <div className="border-2 border-border bg-card overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted/30 border-b-2 border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-4">Item Name</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-2">Container</div>
          <div className="col-span-1 text-center">Qty</div>
          <div className="col-span-2 text-right">Unit Value</div>
          <div className="col-span-1 text-right">Total</div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground font-mono">
            LOADING_INVENTORY...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground font-mono">
            {searchTerm ? "NO_MATCHING_ITEMS" : "NO_ITEMS_REGISTERED"}
          </div>
        ) : (
          filteredItems.map((item) => {
            const room = getRoomForBin(item.binId);
            return (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 border-b-2 border-border last:border-0 hover:bg-muted/10 transition-colors"
                data-testid={`row-item-${item.id}`}
              >
                <div className="md:col-span-4">
                  <div className="font-bold uppercase">{item.name}</div>
                  <div className="text-xs text-muted-foreground font-mono line-clamp-1">{item.description}</div>
                </div>
                <div className="md:col-span-2">
                  {room ? (
                    <Link href={`/room/${room.id}`} className="text-sm font-mono hover:text-primary transition-colors">
                      {room.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-mono text-muted-foreground">—</span>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Link href={`/bin/${item.binId}`} className="text-sm font-mono hover:text-primary transition-colors">
                    {getBinName(item.binId)}
                  </Link>
                </div>
                <div className="md:col-span-1 text-center font-mono">{item.quantity}</div>
                <div className="md:col-span-2 text-right font-mono">${Number(item.value).toFixed(2)}</div>
                <div className="md:col-span-1 text-right font-bold">${(Number(item.value) * item.quantity).toFixed(2)}</div>
              </div>
            );
          })
        )}
      </div>

      {/* Back Link */}
      <Link href="/">
        <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Back to Command Center
        </span>
      </Link>
    </div>
  );
}
