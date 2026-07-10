import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/lib/utils/format";
import { organizationsApi } from "@/lib/api/organizationsApi";
import { projectsApi } from "@/lib/api/projectsApi";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/projects/$projectId/members")({
  component: ProjectMembersPage,
});

function ProjectMembersPage() {
  const { projectId } = Route.useParams();
  const { data: project } = useQuery({ queryKey: ["project", projectId], queryFn: () => projectsApi.get(projectId) });
  const { data: members = [] } = useQuery({
    queryKey: ["members", project?.organizationId],
    queryFn: () => (project ? organizationsApi.membersFor(project.organizationId) : []),
    enabled: !!project,
  });
  if (!project) return null;
  const roster = members.filter((m) => project.memberIds.includes(m.id) || m.id === project.managerId);
  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b px-5 py-4 text-sm font-semibold">Project members</div>
      <ul className="divide-y">
        {roster.map((m) => (
          <li key={m.id} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                  {initials(m.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {m.id === project.managerId ? <Badge>Manager</Badge> : null}
              <Badge variant="secondary">{ROLE_LABEL[m.role as keyof typeof ROLE_LABEL] ?? m.role}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
