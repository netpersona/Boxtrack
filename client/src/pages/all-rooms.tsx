import { useRooms, useBins, useItems, useCreateRoom, useDeleteRoom } from "@/lib/hooks";
import { Link } from "wouter";
import { MapPin, ArrowLeft, Plus, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function AllRooms() {
  const { data: rooms = [], isLoading } = useRooms();
  const { data: bins = [] } = useBins();
  const { data: items = [] } = useItems();
  const deleteRoom = useDeleteRoom();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);

  const getBinCount = (roomId: string) => bins.filter(b => b.roomId === roomId).length;
  const getItemCount = (roomId: string) => {
    const roomBins = bins.filter(b => b.roomId === roomId);
    return items.filter(i => roomBins.some(b => b.id === i.binId)).length;
  };
  const getRoomValue = (roomId: string) => {
    const roomBins = bins.filter(b => b.roomId === roomId);
    return items
      .filter(i => roomBins.some(b => b.id === i.binId))
      .reduce((acc, item) => acc + (Number(item.value) * item.quantity), 0);
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b-2 border-border pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Command Center</Link> /
          <span className="text-primary">All Zones</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
              <MapPin className="w-8 h-8 text-primary" />
              Active Zones
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-2">
              All registered storage locations
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-primary/10 border-2 border-primary px-6 py-3 text-center">
              <div className="text-2xl font-black text-primary">{rooms.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Zones</div>
            </div>
            
            <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
              <DialogTrigger asChild>
                <Button className="h-full px-6 bg-foreground text-background hover:bg-foreground/90 font-bold uppercase tracking-wider rounded-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Zone
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 border-primary/20">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase tracking-widest text-primary">Initialize New Zone</DialogTitle>
                </DialogHeader>
                <AddRoomForm onSuccess={() => setIsAddRoomOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search zones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 font-mono bg-card border-2 border-border focus:border-primary"
          data-testid="input-search-rooms"
        />
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground font-mono border-2 border-border bg-card">
          LOADING_ZONES...
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground font-mono border-2 border-border bg-card">
          {searchTerm ? "NO_MATCHING_ZONES" : "NO_ZONES_REGISTERED"}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <div 
              key={room.id}
              className="group border-2 border-border bg-card hover:border-primary transition-all duration-200 flex flex-col"
              style={{ borderLeftColor: room.color, borderLeftWidth: '4px' }}
              data-testid={`card-room-${room.id}`}
            >
              <Link href={`/room/${room.id}`} className="p-6 flex-grow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: room.color }}>
                    {room.name.charAt(0)}
                  </div>
                  <span className="text-[10px] font-mono bg-muted/30 px-2 py-1">ID: {room.id.slice(0,8)}</span>
                </div>
                
                <h3 className="text-xl font-bold uppercase leading-none mb-2 group-hover:text-primary transition-colors">{room.name}</h3>
                <p className="text-xs text-muted-foreground font-mono line-clamp-2 mb-4">{room.description}</p>
                
                <div className="space-y-2 pt-4 border-t-2 border-dashed border-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-mono">Storage Units:</span>
                    <span className="font-bold">{getBinCount(room.id)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-mono">Items:</span>
                    <span className="font-bold">{getItemCount(room.id)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-mono">Value:</span>
                    <span className="font-bold text-primary">${getRoomValue(room.id).toFixed(2)}</span>
                  </div>
                </div>
              </Link>
              
              <div className="border-t-2 border-border p-3 flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Zone: {room.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this zone and all storage units and items within it. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteRoom.mutate(room.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Zone
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

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
