import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import RoomView, { BinView } from "@/pages/inventory";
import ItemSearch from "@/pages/item-search";
import AllInventory from "@/pages/all-inventory";
import AllBins from "@/pages/all-bins";
import AllRooms from "@/pages/all-rooms";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/search" component={ItemSearch} />
        <Route path="/inventory" component={AllInventory} />
        <Route path="/bins" component={AllBins} />
        <Route path="/rooms" component={AllRooms} />
        <Route path="/room/:id" component={RoomView} />
        <Route path="/bin/:id" component={BinView} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="boxtrack-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
