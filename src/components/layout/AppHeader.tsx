import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Moon, Search, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth/context";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import type { AppRole } from "@/lib/auth/types";
import { ALL_ROLES } from "@/lib/auth/types";
import { initials } from "@/lib/utils/format";
import { USE_MOCK_DATA } from "@/lib/env";

interface AppHeaderProps {
  onMenuClick: () => void;
}

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });
  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next);
    }
  };
  return { dark, toggle };
}

function useBreadcrumb() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const parts = pathname.split("/").filter(Boolean);
  return parts.length === 0 ? ["Home"] : parts.map((p) => p.replace(/-/g, " "));
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { user, logout, overrideRole } = useAuth();
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const crumbs = useBreadcrumb();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick} aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
        <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm text-muted-foreground md:flex">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5 truncate capitalize">
              {i > 0 ? <span className="text-muted-foreground/40">/</span> : null}
              <span className={i === crumbs.length - 1 ? "font-medium text-foreground" : ""}>{c}</span>
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects, teams, docs..."
              className="w-72 pl-9"
              aria-label="Search"
            />
          </div>
          {USE_MOCK_DATA && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  Preview: {ROLE_LABEL[user.role]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Preview as role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_ROLES.map((r) => (
                  <DropdownMenuItem key={r} onClick={() => overrideRole(r as AppRole)}>
                    {ROLE_LABEL[r]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                      {initials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 size-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </header>
  );
}
