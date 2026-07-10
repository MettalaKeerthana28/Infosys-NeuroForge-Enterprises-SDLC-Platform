import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { mockStore } from "@/lib/api/mockStore";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  return (
    <div>
      <PageHeader title="Settings" description="Workspace preferences and mock data controls." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <div className="text-sm font-semibold">Mock data</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Reset organizations, teams and projects back to demo defaults.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => {
              mockStore.reset();
              qc.invalidateQueries();
              toast.success("Demo data reset");
            }}
          >
            Reset demo data
          </Button>
        </div>
      </div>
    </div>
  );
}
