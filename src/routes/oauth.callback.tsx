import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/oauth/callback")({
  ssr: false,
  component: OAuthCallback,
});

function OAuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    // Backend redirects here on success. If tokens are provided via query,
    // extend AuthProvider to consume them. For now, land on the dashboard.
    navigate({ to: "/dashboard" });
  }, [navigate]);
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Signing you in...
      </div>
    </div>
  );
}
