import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, FolderKanban, KanbanSquare, Users } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { organizationsApi } from "@/lib/api/organizationsApi";

export const Route = createFileRoute("/_app/organizations/$organizationId/")({
  component: OrganizationOverviewPage,
});

function OrganizationOverviewPage() {
  const { organizationId } = Route.useParams();
  const { data: org } = useQuery({
    queryKey: ["organization", organizationId],
    queryFn: () => organizationsApi.get(organizationId),
  });
  if (!org) return null;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Teams" value={org.teams} icon={Users} tone="info" />
      <StatCard label="Members" value={org.members} icon={Users} />
      <StatCard label="Projects" value={org.projects} icon={FolderKanban} tone="success" />
      <StatCard label="Active sprints" value={Math.max(1, Math.floor(org.projects / 2))} icon={KanbanSquare} />
      <div className="rounded-xl border bg-card p-5 md:col-span-2 xl:col-span-4">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-indigo-500/10 text-indigo-600">
            <Building2 className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">About {org.displayName}</div>
            <div className="text-xs text-muted-foreground">Created {org.createdAt}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
