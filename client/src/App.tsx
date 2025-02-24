import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import CatalogPage from "@/pages/catalog";
import FavoritesPage from "@/pages/favorites";
import AdminDashboard from "@/pages/admin/dashboard";
import CarDetails from "@/pages/cars/[id]";
import { NavBar } from "@/components/nav-bar";
import { BottomNav } from "@/components/bottom-nav";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/catalog" component={CatalogPage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/cars/:id" component={CarDetails} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background flex flex-col">
          <NavBar />
          <main className="container mx-auto px-4 py-8 pb-20 flex-1">
            <Router />
          </main>
          <BottomNav />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;