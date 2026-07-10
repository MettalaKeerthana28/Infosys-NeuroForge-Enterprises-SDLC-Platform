import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Milestone } from "lucide-react";
import { projectsApi } from "@/lib/api/projectsApi";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/_app/projects/$projectId/milestones")({
  component: ProjectMilestonesPage,
});

function ProjectMilestonesPage() {
  const { projectId } = Route.useParams();
  const { data: milestones = [] } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => projectsApi.milestonesFor(projectId),
  });
  if (milestones.length === 0) {
    return <EmptyState icon={Milestone} title="No milestones" description="Milestones will appear once created." />;
  }
  return (
    <div className="rounded-xl border bg-card">
      <ul className="divide-y">
        {milestones.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <div className="text-sm font-semibold">{m.name}</div>
              <div className="text-xs text-muted-foreground">Due {m.dueDate}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden w-40 sm:block">
                <div className="h-1.5 overflow-hidden rounded bg-muted">
                  <div className="h-full bg-indigo-500" style={{ width: `${m.progress}%` }} />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{m.progress}%</span>
              <Badge variant="secondary">{m.status}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
