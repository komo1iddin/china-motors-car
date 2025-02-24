import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Car } from "lucide-react";

export function NavBar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              AutoDealer
            </span>
          </a>
        </Link>

        <div className="flex items-center space-x-4">
          {user?.isAdmin && (
            <Link href="/admin">
              <a>
                <Button variant="ghost" className="font-medium">
                  Admin Dashboard
                </Button>
              </a>
            </Link>
          )}

          {user ? (
            <Button 
              variant="ghost" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="font-medium"
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          ) : (
            <Link href="/auth">
              <a>
                <Button variant="secondary" className="font-medium">
                  Login
                </Button>
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}