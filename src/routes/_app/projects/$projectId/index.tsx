import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bug, CheckCircle2, ListChecks, Milestone } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { projectsApi } from "@/lib/api/projectsApi";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/projects/$projectId/")({
  component: ProjectOverview,
});

function ProjectOverview() {
  const { projectId } = Route.useParams();
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.get(projectId),
  });
  const { data: milestones = [] } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => projectsApi.milestonesFor(projectId),
  });
  if (!project) return null;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Completion" value={`${project.progress}%`} icon={CheckCircle2} tone="success" />
        <StatCard label="Open tasks" value={project.openTasks} icon={ListChecks} tone="info" />
        <StatCard label="Completed tasks" value={project.completedTasks} icon={CheckCircle2} />
        <StatCard label="Open bugs" value={project.openBugs} icon={Bug} tone="danger" />
      </div>
      <div className="rounded-xl border bg-card">
        <div className="border-b px-5 py-4 text-sm font-semibold">Upcoming milestones</div>
        <ul className="divide-y">
          {milestones.length === 0 ? (
            <li className="px-5 py-6 text-sm text-muted-foreground">No milestones yet.</li>
          ) : (
            milestones.map((m) => (
              <li key={m.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-indigo-500/10 text-indigo-600">
                    <Milestone className="size-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">Due {m.dueDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden w-32 sm:block">
                    <div className="h-1.5 overflow-hidden rounded bg-muted">
                      <div className="h-full bg-indigo-500" style={{ width: `${m.progress}%` }} />
                    </div>
                  </div>
                  <Badge variant="secondary">{m.status}</Badge>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-3 text-sm font-semibold">Technology</div>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
        </div>
      </div>
    </div>
  );
}
