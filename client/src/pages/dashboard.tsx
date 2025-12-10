import { useRooms, useBins, useItems, useCreateRoom } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Box, DollarSign, TrendingUp, Archive, AlertCircle, Activity, Database, Server, Home, MapPin, ArrowUpRight, Search, Plus, CheckCircle, HardDrive, Cpu, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { data: rooms = [] } = useRooms();
  const { data: bins = [] } = useBins();
  const { data: items = [] } = useItems();
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  const getTotalValue = () => items.reduce((acc, item) => acc + (Number(item.value) * item.quantity), 0);
  const getTotalItems = () => items.reduce((acc, item) => acc + item.quantity, 0);
  const getItemsWithPhotos = () => items.filter(i => i.photoUrl).length;

  const stats = [
    { label: "Total Asset Value", value: `$${getTotalValue().toLocaleString()}`, icon: DollarSign, href: "/inventory" },
    { label: "Inventory Count", value: getTotalItems(), icon: Database, href: "/inventory" },
    { label: "Storage Units", value: bins.length, icon: Box, href: "/bins" },
    { label: "Active Zones", value: rooms.length, icon: MapPin, href: "/rooms" },
  ];

  const recentItems = items.slice(-5).reverse();
  
  const getZoneForItem = (binId: string) => {
    const bin = bins.find(b => b.id === binId);
    if (!bin) return null;
    return rooms.find(r => r.id === bin.roomId);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* Hero / Welcome Section */}
      <section className="relative overflow-hidden border-2 border-primary bg-primary/5 p-8 md:p-12">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity className="w-64 h-64 text-primary" />
         </div>
         
         <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest mb-4">
               System Ready
            </div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-foreground">
               Inventory <span className="text-primary block">Control System</span>
            </h1>
            <p className="text-lg text-muted-foreground font-mono max-w-lg mb-8 border-l-4 border-primary/20 pl-4">
               Manage logistics, track assets, and generate manifests for your physical storage locations.
            </p>
            
            <div className="flex flex-wrap gap-4">
               <Link href="/search">
                  <Button size="lg" className="h-12 px-8 bg-foreground text-background hover:bg-foreground/90 font-bold uppercase tracking-wider rounded-none border-2 border-transparent">
                     <Search className="w-4 h-4 mr-2" />
                     Locate Item
                  </Button>
               </Link>
               <Dialog open={isDiagnosticsOpen} onOpenChange={setIsDiagnosticsOpen}>
                  <DialogTrigger asChild>
                     <Button size="lg" variant="outline" className="h-12 px-8 font-bold uppercase tracking-wider rounded-none border-2 border-foreground hover:bg-foreground hover:text-background">
                        <Server className="w-4 h-4 mr-2" />
                        System Diagnostics
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2 border-primary/20 max-w-lg">
                     <DialogHeader>
                        <DialogTitle className="font-mono uppercase tracking-widest text-primary flex items-center gap-2">
                           <Cpu className="w-5 h-5" /> System Diagnostics
                        </DialogTitle>
                        <DialogDescription className="font-mono text-xs">
                           BoxTrack inventory system status report
                        </DialogDescription>
                     </DialogHeader>
                     <div className="space-y-4 font-mono">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-muted/20 border border-border p-4">
                              <div className="flex items-center gap-2 mb-2">
                                 <CheckCircle className="w-4 h-4 text-green-500" />
                                 <span className="text-xs uppercase tracking-wider text-muted-foreground">Database</span>
                              </div>
                              <div className="text-lg font-bold text-green-500">ONLINE</div>
                              <div className="text-[10px] text-muted-foreground">SQLite v3</div>
                           </div>
                           <div className="bg-muted/20 border border-border p-4">
                              <div className="flex items-center gap-2 mb-2">
                                 <CheckCircle className="w-4 h-4 text-green-500" />
                                 <span className="text-xs uppercase tracking-wider text-muted-foreground">API</span>
                              </div>
                              <div className="text-lg font-bold text-green-500">ACTIVE</div>
                              <div className="text-[10px] text-muted-foreground">All endpoints responding</div>
                           </div>
                        </div>
                        
                        <div className="border border-border divide-y divide-border">
                           <div className="flex justify-between items-center p-3">
                              <span className="text-xs uppercase tracking-wider text-muted-foreground">Registered Zones</span>
                              <span className="font-bold">{rooms.length}</span>
                           </div>
                           <div className="flex justify-between items-center p-3">
                              <span className="text-xs uppercase tracking-wider text-muted-foreground">Storage Units</span>
                              <span className="font-bold">{bins.length}</span>
                           </div>
                           <div className="flex justify-between items-center p-3">
                              <span className="text-xs uppercase tracking-wider text-muted-foreground">Tracked Items</span>
                              <span className="font-bold">{items.length}</span>
                           </div>
                           <div className="flex justify-between items-center p-3">
                              <span className="text-xs uppercase tracking-wider text-muted-foreground">Total Quantity</span>
                              <span className="font-bold">{getTotalItems()}</span>
                           </div>
                           <div className="flex justify-between items-center p-3">
                              <span className="text-xs uppercase tracking-wider text-muted-foreground">Items with Photos</span>
                              <span className="font-bold">{getItemsWithPhotos()}</span>
                           </div>
                           <div className="flex justify-between items-center p-3">
                              <span className="text-xs uppercase tracking-wider text-muted-foreground">Total Asset Value</span>
                              <span className="font-bold text-primary">${getTotalValue().toLocaleString()}</span>
                           </div>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/30 p-3 flex items-center gap-3">
                           <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                           <div>
                              <div className="text-sm font-bold text-green-500">All Systems Operational</div>
                              <div className="text-[10px] text-muted-foreground">Last check: {new Date().toLocaleTimeString()}</div>
                           </div>
                        </div>
                     </div>
                  </DialogContent>
               </Dialog>
            </div>
         </div>
      </section>

      {/* Metrics Strip - Now Clickable */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-0 border-y-2 border-border divide-x-2 divide-border bg-card">
         {stats.map((stat, i) => (
            <Link key={i} href={stat.href}>
               <div className="p-6 text-center group hover:bg-primary/10 transition-colors cursor-pointer h-full" data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <stat.icon className="w-6 h-6 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div className="text-3xl font-black tracking-tight mb-1 group-hover:text-primary transition-colors">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary/80 transition-colors flex items-center justify-center gap-1">
                     {stat.label}
                     <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
               </div>
            </Link>
         ))}
      </section>

      {/* Main Grid Layout */}
      <div className="grid md:grid-cols-12 gap-8">
         
         {/* Left Column: Zones (8 cols) */}
         <div className="md:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-border pb-4">
               <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  Active Zones
               </h2>
               <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
                  <DialogTrigger asChild>
                     <span className="text-xs font-bold uppercase tracking-widest text-primary hover:underline cursor-pointer flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Zone
                     </span>
                  </DialogTrigger>
                  <DialogContent className="border-2 border-primary/20">
                     <DialogHeader>
                        <DialogTitle className="font-mono uppercase tracking-widest text-primary">Initialize New Zone</DialogTitle>
                     </DialogHeader>
                     <AddRoomForm onSuccess={() => setIsAddRoomOpen(false)} />
                  </DialogContent>
               </Dialog>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
               {rooms.map((room) => {
                  const roomBins = bins.filter(b => b.roomId === room.id);
                  return (
                     <Link key={room.id} href={`/room/${room.id}`}>
                        <div className="group border-2 border-border bg-card p-6 hover:border-primary hover:translate-x-1 hover:-translate-y-1 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[8px_8px_0px_0px_rgba(var(--primary)_/_0.2)] cursor-pointer h-full flex flex-col justify-between" style={{ borderLeftColor: room.color, borderLeftWidth: '4px' }}>
                           <div>
                              <div className="flex justify-between items-start mb-4">
                                 <div className="w-10 h-10 flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: room.color }}>
                                    {room.name.charAt(0)}
                                 </div>
                                 <span className="text-[10px] font-mono bg-muted/30 px-2 py-1">ID: {room.id.slice(0,8)}</span>
                              </div>
                              <h3 className="text-xl font-bold uppercase leading-none mb-2 group-hover:text-primary transition-colors">{room.name}</h3>
                              <p className="text-xs text-muted-foreground font-mono line-clamp-2 mb-4">{room.description}</p>
                           </div>
                           
                           <div className="pt-4 border-t-2 border-dashed border-border flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Storage Units</span>
                              <span className="text-xl font-black">{roomBins.length}</span>
                           </div>
                        </div>
                     </Link>
                  )
               })}
               
               {/* Add Zone Card */}
               <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
                  <DialogTrigger asChild>
                     <button className="border-2 border-dashed border-border bg-muted/5 p-6 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group min-h-[200px]">
                        <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                           <Plus className="w-8 h-8" />
                        </div>
                        <span className="font-bold uppercase tracking-widest text-sm">Initialize New Zone</span>
                     </button>
                  </DialogTrigger>
               </Dialog>
            </div>
         </div>

         {/* Right Column: Recent Activity (4 cols) */}
         <div className="md:col-span-4 space-y-6">
            <div className="flex items-center justify-between border-b-2 border-border pb-4">
               <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-3">
                  <Activity className="w-5 h-5 text-primary" />
                  Live Feed
               </h2>
            </div>

            <div className="bg-card border-2 border-border">
               {recentItems.map((item, i) => {
                  const zone = getZoneForItem(item.binId);
                  return (
                     <div key={item.id} className="p-4 border-b-2 border-border last:border-0 hover:bg-muted/10 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                           <span className="text-[10px] font-mono text-muted-foreground">{new Date().toLocaleTimeString()}</span>
                           <span className="text-[10px] font-bold text-primary uppercase">{zone?.name || 'UNKNOWN ZONE'}</span>
                        </div>
                        <p className="font-bold text-sm uppercase truncate">{item.name}</p>
                        <div className="flex justify-between items-center mt-2">
                           <span className="text-xs font-mono text-muted-foreground">QTY: {item.quantity}</span>
                           <span className="font-bold text-sm">${item.value}</span>
                        </div>
                     </div>
                  );
               })}
               {recentItems.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground text-sm font-mono">
                     NO_DATA_AVAILABLE
                  </div>
               )}
            </div>

            <div className="bg-primary/10 border-2 border-primary p-4">
               <h3 className="font-bold uppercase text-primary mb-2 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  System Notice
               </h3>
               <p className="text-xs font-mono leading-relaxed opacity-80">
                  Database initialized. Create zones to begin organizing your inventory.
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}

const ZONE_COLORS = [
  { name: "Orange", value: "#FF6600" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#22C55E" },
  { name: "Purple", value: "#A855F7" },
  { name: "Red", value: "#EF4444" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Pink", value: "#EC4899" },
];

function AddRoomForm({ onSuccess }: { onSuccess: () => void }) {
  const createRoom = useCreateRoom();
  const { register, handleSubmit, reset, setValue, watch } = useForm<{ name: string; description: string; color: string }>({
    defaultValues: { color: "#FF6600" }
  });
  const selectedColor = watch("color");

  const onSubmit = (data: { name: string; description: string; color: string }) => {
    createRoom.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono">
      <div className="space-y-2">
        <Label htmlFor="name" className="uppercase text-xs tracking-wider">Zone Designation</Label>
        <Input id="name" {...register("name", { required: true })} placeholder="e.g., Garage, Basement, Attic" className="font-mono bg-muted/20 border-border focus:border-primary" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="uppercase text-xs tracking-wider">Description</Label>
        <Textarea id="description" {...register("description")} placeholder="What is stored here..." className="font-mono bg-muted/20 border-border focus:border-primary" />
      </div>
      <div className="space-y-2">
        <Label className="uppercase text-xs tracking-wider">Zone Color</Label>
        <div className="flex flex-wrap gap-2">
          {ZONE_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setValue("color", color.value)}
              className={`w-8 h-8 rounded-sm border-2 transition-all ${selectedColor === color.value ? 'border-foreground scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={createRoom.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-xs font-bold">
          {createRoom.isPending ? "Initializing..." : "Initialize Zone"}
        </Button>
      </div>
    </form>
  );
}
