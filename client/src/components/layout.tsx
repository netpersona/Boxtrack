import { Link, useLocation } from "wouter";
import { Package, Box, Home, Search, QrCode, Plus, LayoutDashboard, Settings, User, Terminal, Map, Command, Menu, Activity, Clock, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRooms, useItems, useBins } from "@/lib/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: rooms = [] } = useRooms();
  const { data: items = [] } = useItems();
  const { data: bins = [] } = useBins();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => location === path;
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const recentActivity = items.slice(-10).reverse().map(item => {
    const bin = bins.find(b => b.id === item.binId);
    const room = bin ? rooms.find(r => r.id === bin.roomId) : null;
    return {
      type: 'ITEM_LOGGED',
      name: item.name,
      location: room?.name || 'Unknown',
      container: bin?.name || 'Unknown',
      quantity: item.quantity,
      time: new Date().toLocaleTimeString()
    };
  });

  return (
    <div className="min-h-screen bg-background font-mono flex flex-col">
      {/* Top System Bar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b-2 border-border supports-[backdrop-filter]:bg-background/60 print:hidden">
        {/* Level 1: Meta Status */}
        <div className="bg-sidebar text-sidebar-foreground px-4 py-1 flex justify-between items-center text-[10px] uppercase tracking-widest border-b border-border/20">
           <div className="flex gap-4">
             <span>SYS.ONLINE</span>
             <span className="text-primary">SECURE_CONNECTION</span>
           </div>
           <div className="flex gap-4">
             <span>USER: ADMIN</span>
             <span>VER: 2.1.0</span>
           </div>
        </div>

        {/* Level 2: Main Navigation */}
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo Area */}
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl clip-path-polygon group-hover:rotate-90 transition-transform duration-500">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tighter leading-none">BOXTRACK</h1>
                <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase group-hover:text-primary transition-colors">Logistics</p>
              </div>
            </Link>

            {/* Primary Nav Links - Horizontal - Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              <NavItem href="/" icon={LayoutDashboard} label="Command" active={isActive("/")} />
              <NavItem href="/search" icon={Search} label="Search" active={isActive("/search")} />
              
              <div className="h-6 w-px bg-border mx-2"></div>
              
              <div className="flex items-center gap-1">
                 {rooms.slice(0, 3).map(room => (
                   <Link 
                     key={room.id} 
                     href={`/room/${room.id}`}
                     className={cn(
                       "px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-transparent hover:border-border hover:bg-muted/50 transition-all rounded-sm",
                       location.startsWith(`/room/${room.id}`) ? "bg-primary/10 text-primary border-primary/20" : "text-muted-foreground"
                     )}
                   >
                     {room.name}
                   </Link>
                 ))}
                 {rooms.length > 3 && (
                   <span className="text-xs text-muted-foreground px-2">+{rooms.length - 3}</span>
                 )}
              </div>
            </nav>
          </div>

          {/* Right Actions & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Dialog open={isConsoleOpen} onOpenChange={setIsConsoleOpen}>
              <DialogTrigger asChild>
                <button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/20 border border-border text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                   <Terminal className="w-3 h-3" />
                   <span>Console</span>
                </button>
              </DialogTrigger>
              <DialogContent className="border-2 border-primary/20 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="font-mono uppercase tracking-widest text-primary flex items-center gap-2">
                    <Terminal className="w-5 h-5" /> System Console
                  </DialogTitle>
                  <DialogDescription className="font-mono text-xs">
                    Activity log and recent operations
                  </DialogDescription>
                </DialogHeader>
                <div className="bg-black/90 border border-green-500/30 p-4 font-mono text-xs flex-1 overflow-hidden">
                  <div className="text-green-500 mb-4">
                    <div>BoxTrack Console v2.1.0</div>
                    <div>Connected to local SQLite database</div>
                    <div className="text-green-500/50">────────────────────────────────────────</div>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {recentActivity.length === 0 ? (
                        <div className="text-green-500/50">No activity logged yet...</div>
                      ) : (
                        recentActivity.map((activity, i) => (
                          <div key={i} className="text-green-400">
                            <span className="text-green-500/50">[{activity.time}]</span>{' '}
                            <span className="text-yellow-400">{activity.type}</span>{' '}
                            <span className="text-white">"{activity.name}"</span>{' '}
                            <span className="text-green-500/70">
                              → {activity.location}/{activity.container} (qty: {activity.quantity})
                            </span>
                          </div>
                        ))
                      )}
                      <div className="text-green-500/50 mt-4">
                        <div>────────────────────────────────────────</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-green-500">{'>'}</span>
                          <span className="animate-pulse">_</span>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground pt-2">
                  <span>Zones: {rooms.length} | Bins: {bins.length} | Items: {items.length}</span>
                  <span className="text-green-500">● SYSTEM ACTIVE</span>
                </div>
              </DialogContent>
            </Dialog>
            <button 
              onClick={toggleTheme}
              className="hidden md:flex items-center justify-center w-9 h-9 bg-muted/20 border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center border border-primary text-primary font-bold text-xs">
              JD
            </div>
            
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                 </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l-2 border-primary bg-background p-0">
                 <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-border bg-muted/10">
                       <h2 className="font-bold text-lg uppercase tracking-tight text-primary">System Menu</h2>
                    </div>
                    <ScrollArea className="flex-1">
                       <nav className="flex flex-col p-4 space-y-4">
                          <div className="space-y-2">
                             <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Core Modules</div>
                             <MobileNavItem href="/" icon={LayoutDashboard} label="Command Center" active={isActive("/")} onClick={() => setIsMobileMenuOpen(false)} />
                             <MobileNavItem href="/search" icon={Search} label="Global Search" active={isActive("/search")} onClick={() => setIsMobileMenuOpen(false)} />
                          </div>
                          
                          <Separator className="bg-border/50" />
                          
                          <div className="space-y-2">
                             <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Display</div>
                             <button 
                               onClick={toggleTheme}
                               className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-tight transition-all duration-200 border-l-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 w-full text-left"
                             >
                               {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                               {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                             </button>
                          </div>
                          
                          <Separator className="bg-border/50" />
                          
                          <div className="space-y-2">
                             <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Zones</div>
                             {rooms.map(room => (
                                <MobileNavItem 
                                  key={room.id} 
                                  href={`/room/${room.id}`} 
                                  icon={Home} 
                                  label={room.name} 
                                  active={location.startsWith(`/room/${room.id}`)}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                />
                             ))}
                          </div>
                       </nav>
                    </ScrollArea>
                    <div className="p-4 border-t border-border bg-muted/10 text-center text-xs text-muted-foreground">
                       SYS.ID: 884-292-X
                    </div>
                 </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 relative">
         {/* Background Grid */}
         <div className="fixed inset-0 pointer-events-none grid-bg opacity-30 z-[-1]"></div>
         
         {/* Content Wrapper */}
         <div className="max-w-6xl mx-auto">
            {children}
         </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="border-t-2 border-border bg-card p-4 text-xs font-mono text-muted-foreground uppercase tracking-widest flex justify-between items-center print:hidden">
         <div>Zones: {rooms.length} // Bins: {bins.length} // Items: {items.length}</div>
         <div>BoxTrack Systems © 2025</div>
      </footer>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-tight transition-all duration-200 border-b-2",
        active
          ? "border-primary text-primary bg-primary/5"
          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}

function MobileNavItem({ href, icon: Icon, label, active, onClick }: { href: string; icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-tight transition-all duration-200 border-l-2 hover:bg-muted/30",
        active
          ? "border-primary text-primary bg-primary/5"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}
