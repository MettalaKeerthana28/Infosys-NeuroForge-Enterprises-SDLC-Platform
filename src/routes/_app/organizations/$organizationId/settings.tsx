import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "@/lib/api/organizationsApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/organizations/$organizationId/settings")({
  component: OrganizationSettingsPage,
});

function OrganizationSettingsPage() {
  const { organizationId } = Route.useParams();
  const { data: org } = useQuery({
    queryKey: ["organization", organizationId],
    queryFn: () => organizationsApi.get(organizationId),
  });
  if (!org) return null;
  return (
    <form
      className="max-w-2xl space-y-4 rounded-xl border bg-card p-6"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Settings saved (mock)");
      }}
    >
      <div className="space-y-1.5">
        <Label>Display name</Label>
        <Input defaultValue={org.displayName} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Industry</Label>
          <Input defaultValue={org.industry} />
        </div>
        <div className="space-y-1.5">
          <Label>Size</Label>
          <Input defaultValue={org.size} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea rows={4} placeholder="Optional description" />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save changes</Button>
      </div>
    </form>
  );
}
