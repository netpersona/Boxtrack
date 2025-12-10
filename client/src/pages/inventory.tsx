import { useParams } from "wouter";
import type { Room, Bin, Item } from "@shared/schema";
import { useRooms, useBins, useItems, useCreateBin, useCreateItem, useDeleteItem, useUpdateItem } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Printer, Share2, Box, PackageOpen, MoreHorizontal, ArrowLeft, Trash2, MapPin, Grid, Camera, Image as ImageIcon, X, Pencil } from "lucide-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function RoomView() {
  const { id } = useParams();
  const { data: rooms = [] } = useRooms();
  const { data: bins = [] } = useBins(id);
  const { toast } = useToast();
  
  const room = rooms.find((r) => r.id === id);

  const [isAddBinOpen, setIsAddBinOpen] = useState(false);

  const handlePrint = () => {
    window.print();
    toast({ description: "Sent to printer" });
  };

  if (!room) return <div className="p-8 text-center text-muted-foreground font-mono">ERR: ROOM_NOT_FOUND</div>;

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in slide-in-from-right-4 duration-500 print:p-0 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden border-b-2 border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2 text-xs uppercase tracking-widest">
             <Link href="/" className="hover:text-primary transition-colors">Command Center</Link> 
             <span>/</span> 
             <span className="text-foreground font-bold">Zone: {room.name}</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase font-sans flex items-center gap-3">
            <MapPin className="w-8 h-8 text-primary" />
            {room.name}
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm max-w-lg border-l-2 border-primary/50 pl-3 ml-1">
             {room.description}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="font-mono text-xs uppercase tracking-wider border-2 hover:bg-primary/10 hover:text-primary">
            <Printer className="w-4 h-4 mr-2" />
            Print Manifest
          </Button>
          <Dialog open={isAddBinOpen} onOpenChange={setIsAddBinOpen}>
            <DialogTrigger asChild>
              <Button className="font-mono text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                New Container
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-primary/20">
              <DialogHeader>
                <DialogTitle className="font-mono uppercase tracking-widest text-primary">Add Container to {room.name}</DialogTitle>
              </DialogHeader>
              <AddBinForm roomId={room.id} onSuccess={() => setIsAddBinOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Print Only Header */}
      <div className="hidden print:block mb-8">
        <h1 className="text-4xl font-bold font-mono uppercase">{room.name} Manifest</h1>
        <p className="text-xl text-gray-500">BoxTrack System Export // {new Date().toLocaleDateString()}</p>
      </div>

      {/* Bins Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 print:grid-cols-2">
        {bins.map((bin) => (
          <BinCard key={bin.id} bin={bin} />
        ))}
        
        {/* Empty State / Add Card */}
        {bins.length === 0 && (
           <div className="col-span-full py-16 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border bg-muted/5 print:hidden">
              <div className="w-16 h-16 mb-4 border-2 border-muted-foreground/30 flex items-center justify-center rounded-full">
                 <Box className="w-8 h-8 opacity-50" />
              </div>
              <p className="font-mono uppercase tracking-widest text-sm">Sector Empty</p>
              <Button variant="link" onClick={() => setIsAddBinOpen(true)} className="text-primary mt-2">Initialize First Container</Button>
           </div>
        )}
      </div>
    </div>
  );
}

function BinCard({ bin }: { bin: Bin }) {
  const { data: items = [] } = useItems(bin.id);
  const { data: rooms = [] } = useRooms();
  const [showManifest, setShowManifest] = useState(false);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = items.reduce((acc, item) => acc + (Number(item.value) * item.quantity), 0);
  const room = rooms.find((r) => r.id === bin.roomId);

  const handlePrintManifest = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowManifest(true);
  };

  const printManifest = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${bin.name} - Manifest</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; margin: 0; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid black; padding-bottom: 16px; margin-bottom: 20px; }
            .title { font-size: 28px; font-weight: bold; text-transform: uppercase; margin: 0; }
            .room { font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
            .description { font-size: 12px; margin-top: 8px; max-width: 400px; }
            .stats { display: flex; gap: 24px; margin-top: 12px; font-size: 12px; }
            .stats span { font-weight: bold; }
            .qr { text-align: center; }
            .qr-id { font-size: 9px; color: #888; margin-top: 4px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 16px; }
            th { text-align: left; padding: 8px 4px; border-bottom: 2px solid black; font-size: 10px; text-transform: uppercase; }
            th.right { text-align: right; }
            td { padding: 8px 4px; border-bottom: 1px solid #ddd; }
            td.right { text-align: right; }
            tr:nth-child(even) { background: #f5f5f5; }
            tfoot td { border-top: 2px solid black; font-weight: bold; }
            .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #ccc; font-size: 10px; color: #888; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">${bin.name}</h1>
              <p class="room">${room?.name || 'Unknown Zone'}</p>
              <p class="description">${bin.description || ''}</p>
              <div class="stats">
                <div><span>Items:</span> ${items.length}</div>
                <div><span>Total Qty:</span> ${itemCount}</div>
                <div><span>Total Value:</span> $${totalValue.toFixed(2)}</div>
              </div>
            </div>
            <div class="qr">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(window.location.origin + '/bin/' + bin.id)}" width="140" height="140" />
              <p class="qr-id">${bin.id}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Description</th>
                <th class="right" style="width: 60px;">Qty</th>
                <th class="right" style="width: 80px;">Value</th>
                <th class="right" style="width: 90px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.length > 0 ? items.map(item => `
                <tr>
                  <td style="font-weight: bold;">${item.name}</td>
                  <td style="color: #666; font-size: 10px;">${item.description || '-'}</td>
                  <td class="right">${item.quantity}</td>
                  <td class="right">$${Number(item.value).toFixed(2)}</td>
                  <td class="right" style="font-weight: bold;">$${(Number(item.value) * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('') : '<tr><td colspan="5" style="text-align: center; padding: 32px; color: #888;">No items in container</td></tr>'}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="font-size: 10px; text-transform: uppercase;">Total</td>
                <td class="right">${itemCount}</td>
                <td></td>
                <td class="right" style="font-size: 14px;">$${totalValue.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <div class="footer">
            <span>BoxTrack Inventory System</span>
            <span>Printed: ${new Date().toLocaleString()}</span>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
    setShowManifest(false);
  };

  return (
    <>
      <Link href={`/bin/${bin.id}`}>
        <div className="group cursor-pointer bg-card border-2 border-border hover:border-primary transition-all duration-200 h-full flex flex-col relative overflow-hidden print:border-black">
          {/* Decorative tactical corner */}
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="w-2 h-2 bg-primary"></div>
          </div>

          <div className="p-4 flex-1">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 border-2 border-primary/20 bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors print:hidden">
                 <Box className="w-5 h-5" />
               </div>
               <div className="bg-white p-1 print:bg-white border border-border/20">
                  <QRCodeSVG value={`${window.location.origin}/bin/${bin.id}`} size={40} level="L" />
               </div>
            </div>
            <h3 className="text-lg font-bold font-sans uppercase tracking-tight group-hover:text-primary transition-colors print:text-black mb-1">{bin.name}</h3>
            <p className="text-xs text-muted-foreground font-mono line-clamp-2 border-l-2 border-border pl-2">{bin.description}</p>
          </div>
          
          <div className="bg-muted/30 p-3 border-t-2 border-border flex justify-between items-center text-xs font-mono uppercase tracking-wider">
               <div className="flex flex-col">
                 <span className="text-[10px] text-muted-foreground">Items</span>
                 <span className="font-bold">{itemCount}</span>
               </div>
               <div className="flex flex-col text-right">
                 <span className="text-[10px] text-muted-foreground">Valuation</span>
                 <span className="font-bold text-primary">${totalValue}</span>
               </div>
          </div>

          {/* Print Manifest Button */}
          <div className="border-t border-border print:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full h-8 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-none"
              onClick={handlePrintManifest}
              data-testid={`button-print-manifest-${bin.id}`}
            >
              <Printer className="w-3 h-3 mr-2" />
              Print Manifest
            </Button>
          </div>
        </div>
      </Link>

      {/* Print Manifest Dialog */}
      <Dialog open={showManifest} onOpenChange={setShowManifest}>
        <DialogContent className="border-2 border-primary/20 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase tracking-widest text-primary flex items-center gap-2">
              <Printer className="w-5 h-5" />
              Print Manifest: {bin.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 font-mono text-sm">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Container</p>
                <p className="font-bold text-lg">{bin.name}</p>
                <p className="text-xs text-muted-foreground">{room?.name}</p>
                <p className="text-xs mt-2">{bin.description}</p>
              </div>
              <div className="bg-white p-2 border border-border">
                <QRCodeSVG value={`${window.location.origin}/bin/${bin.id}`} size={80} level="M" />
              </div>
            </div>

            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {items.length} items • {itemCount} total qty • ${totalValue.toFixed(2)} value
            </div>

            <div className="border border-border max-h-48 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/30 sticky top-0">
                  <tr>
                    <th className="text-left p-2 font-bold uppercase">Item</th>
                    <th className="text-right p-2 font-bold uppercase w-12">Qty</th>
                    <th className="text-right p-2 font-bold uppercase w-16">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t border-border/50">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">${(Number(item.value) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-muted-foreground">No items</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowManifest(false)} className="font-mono text-xs uppercase">
                Cancel
              </Button>
              <Button onClick={printManifest} className="bg-primary text-primary-foreground font-mono text-xs uppercase">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AddBinForm({ roomId, onSuccess }: { roomId: string, onSuccess: () => void }) {
  const createBin = useCreateBin();
  const { register, handleSubmit, reset } = useForm<{ name: string; description: string }>();

  const onSubmit = (data: { name: string; description: string }) => {
    createBin.mutate({ ...data, roomId }, {
      onSuccess: () => {
        reset();
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono">
      <div className="space-y-2">
        <Label htmlFor="name" className="uppercase text-xs tracking-wider">Container Designation</Label>
        <Input id="name" {...register("name", { required: true })} placeholder="e.g., SECTOR-A-01" className="font-mono bg-muted/20 border-border focus:border-primary" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="uppercase text-xs tracking-wider">Manifest Summary</Label>
        <Textarea id="description" {...register("description")} placeholder="Contents..." className="font-mono bg-muted/20 border-border focus:border-primary" />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={createBin.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-xs font-bold">
          {createBin.isPending ? "Initializing..." : "Initialize"}
        </Button>
      </div>
    </form>
  );
}

export function BinView() {
  const { id } = useParams();
  const { data: bins = [] } = useBins();
  const { data: rooms = [] } = useRooms();
  const { data: binItems = [] } = useItems(id);
  const deleteItemMutation = useDeleteItem();
  const updateItemMutation = useUpdateItem();
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const { toast } = useToast();
  const [viewImage, setViewImage] = useState<string | null>(null);

  const bin = bins.find((b) => b.id === id);
  const room = rooms.find((r) => r.id === bin?.roomId);

  const handlePrint = () => {
    window.print();
    toast({ description: "Printing Bin Label & Inventory..." });
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItemMutation.mutate(itemId);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
  };

  if (!bin) return <div className="p-8 text-center text-muted-foreground font-mono">ERR: CONTAINER_NOT_FOUND</div>;

  const totalValue = binItems.reduce((acc, i) => acc + (Number(i.value) * i.quantity), 0);
  const hasValues = binItems.some(i => Number(i.value) > 0);

  return (
     <div className="p-4 md:p-8 space-y-8 animate-in slide-in-from-right-4 duration-500 print:p-0 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 print:hidden border-b-2 border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2 text-xs uppercase tracking-widest">
             <Link href="/" className="hover:text-primary transition-colors">CMD</Link> / 
             <Link href={`/room/${room?.id}`} className="hover:text-primary transition-colors">{room?.name}</Link> / 
             <span className="text-foreground font-bold">{bin.name}</span>
          </div>
          <div className="flex items-center gap-4">
             <h1 className="text-4xl font-bold tracking-tighter uppercase font-sans flex items-center gap-3">
               <Box className="w-10 h-10 text-primary" />
               {bin.name}
             </h1>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl font-mono text-sm border-l-2 border-primary/30 pl-3">
             {bin.description}
          </p>
          
          <div className="flex gap-4 mt-6">
             {hasValues && (
               <div className="px-4 py-2 bg-muted/20 border-2 border-border flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Total Value</span>
                  <p className="text-xl font-bold font-mono text-primary">${totalValue.toFixed(2)}</p>
               </div>
             )}
             <div className="px-4 py-2 bg-muted/20 border-2 border-border flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Item Count</span>
                <p className="text-xl font-bold font-mono">{binItems.reduce((acc, i) => acc + i.quantity, 0)}</p>
             </div>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0 bg-white p-4 flex flex-col items-center text-center border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
           <QRCodeSVG value={`${window.location.origin}/bin/${bin.id}`} size={120} level="M" />
           <p className="text-[10px] font-mono text-muted-foreground mt-2 uppercase tracking-widest">{bin.id}</p>
           <Button 
             variant="outline" 
             size="sm" 
             className="mt-2 w-full text-xs h-9 font-mono uppercase border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
             onClick={handlePrint}
             data-testid="button-print-manifest"
           >
             <Printer className="w-3 h-3 mr-2" /> Print Manifest
           </Button>
        </div>
      </div>

      {/* Print Layout - Full Manifest */}
      <div className="hidden print:block">
        {/* Header with QR */}
        <div className="flex items-start justify-between mb-6 border-b-2 border-black pb-4">
          <div>
            <h1 className="text-4xl font-bold uppercase font-mono">{bin.name}</h1>
            <p className="text-lg text-gray-600 uppercase tracking-widest mt-1">{room?.name}</p>
            <p className="mt-2 font-mono text-sm max-w-md">{bin.description}</p>
            <div className="flex gap-6 mt-4 text-sm font-mono">
              <div><span className="font-bold">Items:</span> {binItems.length}</div>
              <div><span className="font-bold">Total Qty:</span> {binItems.reduce((acc, i) => acc + i.quantity, 0)}</div>
              {hasValues && <div><span className="font-bold">Total Value:</span> ${totalValue.toFixed(2)}</div>}
            </div>
          </div>
          <div className="text-center shrink-0">
            <QRCodeSVG value={`${window.location.origin}/bin/${bin.id}`} size={140} level="M" />
            <p className="text-[9px] font-mono text-gray-500 mt-1 uppercase">{bin.id}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-sm font-mono border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-2 font-bold uppercase text-xs">Item Name</th>
              <th className="text-left py-2 font-bold uppercase text-xs">Description</th>
              <th className="text-right py-2 font-bold uppercase text-xs w-16">Qty</th>
              {hasValues && <th className="text-right py-2 font-bold uppercase text-xs w-20">Value</th>}
              {hasValues && <th className="text-right py-2 font-bold uppercase text-xs w-24">Total</th>}
            </tr>
          </thead>
          <tbody>
            {binItems.map((item, idx) => (
              <tr key={item.id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-2 font-bold">{item.name}</td>
                <td className="py-2 text-gray-600 text-xs">{item.description || '-'}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                {hasValues && <td className="py-2 text-right">${Number(item.value).toFixed(2)}</td>}
                {hasValues && <td className="py-2 text-right font-bold">${(Number(item.value) * item.quantity).toFixed(2)}</td>}
              </tr>
            ))}
            {binItems.length === 0 && (
              <tr>
                <td colSpan={hasValues ? 5 : 3} className="py-8 text-center text-gray-400 uppercase">No items in container</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-black">
              <td colSpan={2} className="py-2 font-bold uppercase text-xs">Total</td>
              <td className="py-2 text-right font-bold">{binItems.reduce((acc, i) => acc + i.quantity, 0)}</td>
              {hasValues && <td className="py-2 text-right"></td>}
              {hasValues && <td className="py-2 text-right font-bold text-lg">${totalValue.toFixed(2)}</td>}
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-xs font-mono text-gray-500 flex justify-between">
          <span>BoxTrack Inventory System</span>
          <span>Printed: {new Date().toLocaleString()}</span>
        </div>
      </div>

      <Tabs defaultValue="items" className="w-full print:hidden">
        <div className="flex items-center justify-between mb-4 print:hidden">
           <TabsList className="bg-muted/20 border border-border p-1 gap-1 h-auto">
             <TabsTrigger value="items" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-xs uppercase tracking-wider rounded-none">Inventory</TabsTrigger>
             <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-mono text-xs uppercase tracking-wider rounded-none">Log</TabsTrigger>
           </TabsList>
           
           <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs uppercase tracking-wider font-bold">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-primary/20">
              <DialogHeader>
                <DialogTitle className="font-mono uppercase text-primary tracking-wider">Log Item to {bin.name}</DialogTitle>
              </DialogHeader>
              <AddItemForm binId={bin.id} onSuccess={() => setIsAddItemOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="items" className="space-y-4">
          <div className="border-2 border-border bg-card print:border-0 overflow-x-auto">
             <Table>
               <TableHeader>
                 <TableRow className="hover:bg-transparent border-b-2 border-border">
                   <TableHead className="w-[60px] font-mono text-xs uppercase tracking-widest text-foreground font-bold h-10">IMG</TableHead>
                   <TableHead className="font-mono text-xs uppercase tracking-widest text-foreground font-bold h-10">Item Name</TableHead>
                   <TableHead className="font-mono text-xs uppercase tracking-widest text-foreground font-bold h-10 hidden md:table-cell">Details</TableHead>
                   <TableHead className="w-[80px] text-right font-mono text-xs uppercase tracking-widest text-foreground font-bold h-10">Qty</TableHead>
                   {hasValues && <TableHead className="w-[80px] text-right font-mono text-xs uppercase tracking-widest text-foreground font-bold h-10 hidden md:table-cell">Val</TableHead>}
                   {hasValues && <TableHead className="w-[80px] text-right font-mono text-xs uppercase tracking-widest text-foreground font-bold h-10 hidden md:table-cell">Total</TableHead>}
                   <TableHead className="w-[50px] print:hidden h-10"></TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {binItems.map((item) => (
                   <TableRow key={item.id} className="group hover:bg-muted/20 border-b border-border/50">
                     <TableCell>
                        {item.photoUrl ? (
                          <div className="w-10 h-10 bg-muted border border-border cursor-pointer hover:border-primary" onClick={() => setViewImage(item.photoUrl!)}>
                            <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-muted/50 border border-border flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                          </div>
                        )}
                     </TableCell>
                     <TableCell className="font-bold font-sans">
                        {item.name}
                        <div className="md:hidden text-xs text-muted-foreground font-mono mt-1 truncate max-w-[150px]">{item.description}</div>
                     </TableCell>
                     <TableCell className="text-muted-foreground text-xs font-mono hidden md:table-cell">{item.description}</TableCell>
                     <TableCell className="text-right font-mono">
                        {item.quantity}
                        {hasValues && <div className="md:hidden text-[10px] text-muted-foreground mt-1">${Number(item.value) * item.quantity}</div>}
                     </TableCell>
                     {hasValues && <TableCell className="text-right font-mono text-muted-foreground hidden md:table-cell">${item.value}</TableCell>}
                     {hasValues && <TableCell className="text-right font-bold text-primary font-mono hidden md:table-cell">${Number(item.value) * item.quantity}</TableCell>}
                     <TableCell className="print:hidden">
                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" 
                           onClick={() => handleEditItem(item)}
                           data-testid={`button-edit-item-${item.id}`}
                         >
                           <Pencil className="w-4 h-4" />
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" 
                           onClick={() => handleDeleteItem(item.id)}
                           disabled={deleteItemMutation.isPending}
                           data-testid={`button-delete-item-${item.id}`}
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       </div>
                     </TableCell>
                   </TableRow>
                 ))}
                 {binItems.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={hasValues ? 7 : 5} className="text-center py-12 text-muted-foreground font-mono text-xs uppercase tracking-widest">
                       Container Empty
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
          </div>
        </TabsContent>
        <TabsContent value="history">
           <div className="p-8 text-center text-muted-foreground text-xs font-mono uppercase tracking-widest border-2 border-dashed border-border bg-muted/5">
             No activity log recorded for this container.
           </div>
        </TabsContent>
      </Tabs>

      {/* Image Preview Dialog */}
      <Dialog open={!!viewImage} onOpenChange={(open) => !open && setViewImage(null)}>
        <DialogContent className="border-2 border-primary/20 max-w-2xl p-0 overflow-hidden bg-black w-[95vw] h-auto max-h-[80vh] flex items-center justify-center">
           <div className="relative w-full h-full flex items-center justify-center bg-black">
             <button onClick={() => setViewImage(null)} className="absolute right-2 top-2 z-10 p-2 bg-black/50 text-white hover:bg-red-500 transition-colors rounded-sm">
                <X className="w-4 h-4" />
             </button>
             {viewImage && <img src={viewImage} alt="Preview" className="max-w-full max-h-full object-contain" />}
           </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="border-2 border-primary/20">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase text-primary tracking-wider flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              Edit Item
            </DialogTitle>
          </DialogHeader>
          {editingItem && (
            <EditItemForm 
              item={editingItem} 
              onSuccess={() => setEditingItem(null)} 
              onCancel={() => setEditingItem(null)}
            />
          )}
        </DialogContent>
      </Dialog>
     </div>
  );
}


function AddItemForm({ binId, onSuccess }: { binId: string, onSuccess: () => void }) {
  const createItem = useCreateItem();
  const { register, handleSubmit, reset } = useForm();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: any) => {
    createItem.mutate({ 
      ...data, 
      binId,
      quantity: Number(data.quantity) || 1,
      value: data.value ? Number(data.value) : 0,
      photoUrl: photoPreview || undefined
    }, {
      onSuccess: () => {
        reset();
        setPhotoPreview(null);
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono">
      <div className="flex gap-4">
         <div 
           className="w-24 h-24 border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center bg-muted/20 shrink-0 transition-colors group relative"
           onClick={() => fileInputRef.current?.click()}
         >
            {photoPreview ? (
               <>
                 <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                 </div>
               </>
            ) : (
               <>
                 <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-1 transition-colors" />
                 <span className="text-[9px] uppercase font-bold text-muted-foreground">Add Photo</span>
               </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              capture="environment"
              onChange={handleFileChange}
            />
         </div>
         <div className="flex-1 space-y-2">
            <Label htmlFor="name" className="uppercase text-xs tracking-wider">Item Designation</Label>
            <Input id="name" {...register("name", { required: true })} placeholder="e.g., HYDRAULIC-PUMP-01" className="bg-muted/20 border-border focus:border-primary" />
         </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="uppercase text-xs tracking-wider">Specs / Details</Label>
        <Textarea id="description" {...register("description")} placeholder="Details..." className="bg-muted/20 border-border focus:border-primary" />
      </div>
      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
            <Label htmlFor="quantity" className="uppercase text-xs tracking-wider">Count</Label>
            <Input id="quantity" type="number" min="1" {...register("quantity", { required: true, valueAsNumber: true })} defaultValue={1} className="bg-muted/20 border-border focus:border-primary" />
         </div>
         <div className="space-y-2">
            <Label htmlFor="value" className="uppercase text-xs tracking-wider">Unit Value ($) <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="value" type="number" min="0" step="0.01" {...register("value")} placeholder="0.00" className="bg-muted/20 border-border focus:border-primary" />
         </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={createItem.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-xs font-bold">
          {createItem.isPending ? "Logging..." : "Log Item"}
        </Button>
      </div>
    </form>
  );
}

function EditItemForm({ item, onSuccess, onCancel }: { item: Item, onSuccess: () => void, onCancel: () => void }) {
  const updateItem = useUpdateItem();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: item.name,
      description: item.description || '',
      quantity: item.quantity,
      value: item.value,
    }
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(item.photoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: any) => {
    updateItem.mutate({ 
      id: item.id,
      data: {
        name: data.name,
        description: data.description,
        quantity: Number(data.quantity) || 1,
        value: data.value ? Number(data.value) : 0,
        photoUrl: photoPreview || undefined,
        binId: item.binId,
      }
    }, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono">
      <div className="flex gap-4">
         <div 
           className="w-24 h-24 border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center bg-muted/20 shrink-0 transition-colors group relative"
           onClick={() => fileInputRef.current?.click()}
         >
            {photoPreview ? (
               <>
                 <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                 </div>
               </>
            ) : (
               <>
                 <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary mb-1 transition-colors" />
                 <span className="text-[9px] uppercase font-bold text-muted-foreground">Add Photo</span>
               </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              capture="environment"
              onChange={handleFileChange}
            />
         </div>
         <div className="flex-1 space-y-2">
            <Label htmlFor="edit-name" className="uppercase text-xs tracking-wider">Item Designation</Label>
            <Input id="edit-name" {...register("name", { required: true })} className="bg-muted/20 border-border focus:border-primary" />
         </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description" className="uppercase text-xs tracking-wider">Specs / Details</Label>
        <Textarea id="edit-description" {...register("description")} className="bg-muted/20 border-border focus:border-primary" />
      </div>
      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-2">
            <Label htmlFor="edit-quantity" className="uppercase text-xs tracking-wider">Count</Label>
            <Input id="edit-quantity" type="number" min="1" {...register("quantity", { required: true, valueAsNumber: true })} className="bg-muted/20 border-border focus:border-primary" />
         </div>
         <div className="space-y-2">
            <Label htmlFor="edit-value" className="uppercase text-xs tracking-wider">Unit Value ($) <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="edit-value" type="number" min="0" step="0.01" {...register("value")} placeholder="0.00" className="bg-muted/20 border-border focus:border-primary" />
         </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="uppercase tracking-wider text-xs">
          Cancel
        </Button>
        <Button type="submit" disabled={updateItem.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-xs font-bold">
          {updateItem.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
