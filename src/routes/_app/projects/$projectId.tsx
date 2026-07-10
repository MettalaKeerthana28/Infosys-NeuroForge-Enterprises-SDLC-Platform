import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { HealthBadge, StatusBadge } from "@/components/common/HealthBadge";
import { projectsApi } from "@/lib/api/projectsApi";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/projects/$projectId")({
  component: ProjectDetailLayout,
});

function ProjectDetailLayout() {
  const { projectId } = Route.useParams();
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectsApi.get(projectId),
  });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const base = `/projects/${projectId}`;
  const tabs = [
    { to: base, label: "Overview", exact: true },
    { to: `${base}/members`, label: "Members" },
    { to: `${base}/milestones`, label: "Milestones" },
  ];

  return (
    <div>
      <PageHeader
        title={project ? `${project.key} · ${project.name}` : "Project"}
        description={project?.description}
        actions={
          project ? (
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              <HealthBadge health={project.health} />
              <Badge variant="secondary">{project.methodology}</Badge>
            </div>
          ) : null
        }
      />
      {project ? (
        <div className="mb-6 rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded bg-muted">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${project.progress}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Start: <span className="text-foreground">{project.startDate}</span></span>
            <span>Target: <span className="text-foreground">{project.targetEndDate}</span></span>
            <span>Priority: <span className="text-foreground">{project.priority}</span></span>
          </div>
        </div>
      ) : null}
      <div className="mb-6 flex flex-wrap gap-1 border-b">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname === t.to || pathname.startsWith(t.to + "/");
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "-mb-px border-b-2 px-4 py-2 text-sm",
                active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
}
