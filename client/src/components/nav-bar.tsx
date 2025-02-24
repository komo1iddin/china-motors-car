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
            <Car className="h-6 w-6 text-red-600" />
            <span className="font-bold text-lg">
              <span className="text-red-600">China</span>
              <span className="text-blue-600">Motors</span>
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
              {logoutMutation.isPending ? "Выход..." : "Выйти"}
            </Button>
          ) : (
            <Link href="/auth">
              <a>
                <Button variant="secondary" className="font-medium">
                  Войти
                </Button>
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}