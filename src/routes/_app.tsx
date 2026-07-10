import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAuth } from "@/lib/auth/context";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const { isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isReady, isAuthenticated, navigate]);

  if (!isReady || !isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col">
          <AppHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
