import { Home, Grid, Heart, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const items = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/catalog", icon: Grid, label: "Catalog" },
    { href: "/favorites", icon: Heart, label: "Favorites" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background/80 backdrop-blur-lg">
      <div className="grid h-full grid-cols-4 items-center px-4">
        {items.map(({ href, icon: Icon, label }) => {
          const isActive = location === href;
          return (
            <Link href={href} key={href}>
              <a className="flex flex-col items-center justify-center gap-1">
                <Icon
                  className={cn(
                    "h-6 w-6 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs transition-colors",
                    isActive ? "text-primary font-medium" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
