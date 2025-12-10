import { useBins, useRooms, useItems, useCreateBin } from "@/lib/hooks";
import { Link } from "wouter";
import { Box, ArrowLeft, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

export default function AllBins() {
  const { data: bins = [], isLoading } = useBins();
  const { data: rooms = [] } = useRooms();
  const { data: items = [] } = useItems();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddBinOpen, setIsAddBinOpen] = useState(false);

  const getRoomName = (roomId: string) => rooms.find(r => r.id === roomId)?.name || "Unknown";
  const getItemCount = (binId: string) => items.filter(i => i.binId === binId).length;
  const getBinValue = (binId: string) => items
    .filter(i => i.binId === binId)
    .reduce((acc, item) => acc + (Number(item.value) * item.quantity), 0);

  const filteredBins = bins.filter(bin =>
    bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bin.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b-2 border-border pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Command Center</Link> /
          <span className="text-primary">All Storage Units</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Box className="w-8 h-8 text-primary" />
              Storage Units
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-2">
              All containers and bins across all zones
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-primary/10 border-2 border-primary px-6 py-3 text-center">
              <div className="text-2xl font-black text-primary">{bins.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Units</div>
            </div>
            
            <Dialog open={isAddBinOpen} onOpenChange={setIsAddBinOpen}>
              <DialogTrigger asChild>
                <Button className="h-full px-6 bg-foreground text-background hover:bg-foreground/90 font-bold uppercase tracking-wider rounded-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Unit
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 border-primary/20">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase tracking-widest text-primary">Create Storage Unit</DialogTitle>
                </DialogHeader>
                <AddBinForm rooms={rooms} onSuccess={() => setIsAddBinOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search storage units..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 font-mono bg-card border-2 border-border focus:border-primary"
          data-testid="input-search-bins"
        />
      </div>

      {/* Bins Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground font-mono border-2 border-border bg-card">
          LOADING_STORAGE_UNITS...
        </div>
      ) : filteredBins.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground font-mono border-2 border-border bg-card">
          {searchTerm ? "NO_MATCHING_UNITS" : "NO_STORAGE_UNITS_REGISTERED"}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBins.map((bin) => (
            <Link key={bin.id} href={`/bin/${bin.id}`}>
              <div 
                className="group border-2 border-border bg-card p-6 hover:border-primary hover:translate-x-1 hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full flex flex-col"
                data-testid={`card-bin-${bin.id}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center">
                    <Box className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[10px] font-mono bg-muted/30 px-2 py-1">ID: {bin.id.slice(0,8)}</span>
                </div>
                
                <h3 className="text-xl font-bold uppercase leading-none mb-2 group-hover:text-primary transition-colors">{bin.name}</h3>
                <p className="text-xs text-muted-foreground font-mono line-clamp-2 mb-4 flex-grow">{bin.description}</p>
                
                <div className="space-y-2 pt-4 border-t-2 border-dashed border-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-mono">Zone:</span>
                    <span className="font-bold uppercase">{getRoomName(bin.roomId)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-mono">Items:</span>
                    <span className="font-bold">{getItemCount(bin.id)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-mono">Value:</span>
                    <span className="font-bold text-primary">${getBinValue(bin.id).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Link>
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

function AddBinForm({ rooms, onSuccess }: { rooms: { id: string; name: string }[]; onSuccess: () => void }) {
  const createBin = useCreateBin();
  const { register, handleSubmit, reset, control } = useForm<{ name: string; description: string; roomId: string }>();

  const onSubmit = (data: { name: string; description: string; roomId: string }) => {
    createBin.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono">
      <div className="space-y-2">
        <Label htmlFor="roomId" className="uppercase text-xs tracking-wider">Parent Zone</Label>
        <Controller
          name="roomId"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="font-mono bg-muted/20 border-border">
                <SelectValue placeholder="Select a zone..." />
              </SelectTrigger>
              <SelectContent>
                {rooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name" className="uppercase text-xs tracking-wider">Unit Designation</Label>
        <Input id="name" {...register("name", { required: true })} placeholder="e.g., Box A-1, Shelf 3" className="font-mono bg-muted/20 border-border focus:border-primary" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="uppercase text-xs tracking-wider">Contents Description</Label>
        <Textarea id="description" {...register("description")} placeholder="What is stored here..." className="font-mono bg-muted/20 border-border focus:border-primary" />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={createBin.isPending || rooms.length === 0} className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-xs font-bold">
          {createBin.isPending ? "Creating..." : "Create Unit"}
        </Button>
      </div>
      {rooms.length === 0 && (
        <p className="text-xs text-destructive">Create a zone first before adding storage units.</p>
      )}
    </form>
  );
}
