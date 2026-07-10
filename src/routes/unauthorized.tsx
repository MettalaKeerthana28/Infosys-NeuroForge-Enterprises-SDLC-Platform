import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/unauthorized")({
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-rose-500/10 text-rose-600">
          <ShieldAlert className="size-7" />
        </div>
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your role doesn't have permission to view this page. Contact your organization admin if
          you believe this is a mistake.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild>
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
