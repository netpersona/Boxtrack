import { useState } from "react";
import { useItems, useBins, useRooms } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { Search, Package, Box, ArrowRight, CornerDownRight, Terminal } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ItemSearch() {
  const { data: items = [] } = useItems();
  const { data: bins = [] } = useBins();
  const { data: rooms = [] } = useRooms();
  const [query, setQuery] = useState("");

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) || 
    item.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto font-mono">
      <div className="space-y-4 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/50 text-primary text-xs uppercase tracking-widest bg-primary/5 rounded-full mb-2">
           <Terminal className="w-3 h-3" />
           <span>Database Query Interface</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tighter uppercase font-sans">Global Search</h1>
        <div className="relative max-w-xl mx-auto group">
           <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
           <Input 
             className="pl-12 h-14 text-lg shadow-none bg-card border-2 border-border focus:border-primary rounded-none font-mono transition-all" 
             placeholder="ENTER_QUERY..." 
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             autoFocus
           />
           <div className="absolute right-2 top-2 bottom-2 px-2 flex items-center bg-muted/20 border border-border text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Return ⏎
           </div>
        </div>
      </div>

      <div className="space-y-4">
        {query && filteredItems.length === 0 && (
          <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border bg-muted/5">
             <div className="text-xl font-bold mb-2">NO_MATCHES_FOUND</div>
             <div className="text-xs uppercase tracking-widest opacity-50">Try different keywords</div>
          </div>
        )}

        {filteredItems.map(item => {
           const bin = bins.find(b => b.id === item.binId);
           const room = rooms.find(r => r.id === bin?.roomId);

           return (
             <Link key={item.id} href={`/bin/${bin?.id}`}>
               <div className="group cursor-pointer bg-card border-2 border-border hover:border-primary transition-all duration-200 relative overflow-hidden">
                 {/* Hover effect bar */}
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                 
                 <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 border-2 border-border bg-muted/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-colors shrink-0">
                          <Package className="h-6 w-6" />
                       </div>
                       <div>
                          <h3 className="font-bold text-lg font-sans uppercase tracking-tight group-hover:text-primary transition-colors">{item.name}</h3>
                          <p className="text-xs text-muted-foreground font-mono">{item.description}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm md:text-right">
                       <div className="hidden md:block">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Coordinates</p>
                          <div className="flex items-center gap-2 font-bold font-mono text-xs">
                             <span className="bg-muted/30 px-1 border border-border/50">{room?.name}</span>
                             <CornerDownRight className="w-3 h-3 text-muted-foreground" />
                             <span className="text-primary">{bin?.name}</span>
                          </div>
                       </div>
                       
                       <div className="flex gap-2">
                           <div className="flex flex-col items-end border-l-2 border-border pl-4">
                             <span className="text-[10px] uppercase text-muted-foreground">Qty</span>
                             <span className="font-bold font-mono">{item.quantity}</span>
                           </div>
                           <div className="flex flex-col items-end border-l-2 border-border pl-4">
                             <span className="text-[10px] uppercase text-muted-foreground">Val</span>
                             <span className="font-bold font-mono">${item.value}</span>
                           </div>
                       </div>
                    </div>
                 </div>
               </div>
             </Link>
           )
        })}
      </div>
    </div>
  );
}
