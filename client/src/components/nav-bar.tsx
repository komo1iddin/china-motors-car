import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Car } from "lucide-react";

export function NavBar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <Car className="h-6 w-6" />
            <span className="font-bold text-lg">AutoDealer</span>
          </a>
        </Link>

        <div className="flex items-center space-x-4">
          {user?.isAdmin && (
            <Link href="/admin">
              <a>
                <Button variant="outline">Admin Dashboard</Button>
              </a>
            </Link>
          )}
          
          {user ? (
            <Button 
              variant="outline" 
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          ) : (
            <Link href="/auth">
              <a>
                <Button>Login</Button>
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
