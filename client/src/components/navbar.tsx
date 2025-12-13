import { Link, useLocation } from "wouter";
import { Candy, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg" data-testid="link-home">
          <Candy className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">Sweet Shop</span>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/shop" asChild>
                <Button variant="ghost" data-testid="link-shop">
                  Shop
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin" asChild>
                  <Button variant="ghost" data-testid="link-admin">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Admin
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login" asChild>
                <Button variant="ghost" data-testid="link-login">
                  Log in
                </Button>
              </Link>
              <Link href="/register" asChild>
                <Button data-testid="link-register">
                  Sign up
                </Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
