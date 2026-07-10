import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FolderKanban, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectsApi } from "@/lib/api/projectsApi";
import { HealthBadge, StatusBadge } from "@/components/common/HealthBadge";
import { useAuth } from "@/lib/auth/context";
import { can } from "@/lib/auth/permissions";
import type { ProjectHealth, ProjectStatus } from "@/mocks/data";

export const Route = createFileRoute("/_app/projects/")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { user } = useAuth();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsApi.list(),
  });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "ALL">("ALL");
  const [health, setHealth] = useState<ProjectHealth | "ALL">("ALL");

  const filtered = projects.filter(
    (p) =>
      (status === "ALL" || p.status === status) &&
      (health === "ALL" || p.health === health) &&
      (p.name + p.description + p.key).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Projects"
        description="All projects across your organizations."
        actions={
          can(user?.role, "projects.create") ? (
            <Button asChild>
              <Link to="/projects/new"><Plus className="mr-2 size-4" /> New project</Link>
            </Button>
          ) : null
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search projects" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus | "ALL")}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={health} onValueChange={(v) => setHealth(v as ProjectHealth | "ALL")}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Health" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All health</SelectItem>
            {["ON_TRACK", "AT_RISK", "DELAYED"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl border bg-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects match" description="Try changing your filters." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to="/projects/$projectId"
              params={{ projectId: p.id }}
              className="group rounded-xl border bg-card p-5 shadow-sm transition hover:border-indigo-400/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">{p.key}</span>
                    <div className="text-base font-semibold group-hover:text-indigo-600">{p.name}</div>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5">
                <StatusBadge status={p.status} />
                <HealthBadge health={p.health} />
                <Badge variant="secondary">{p.methodology}</Badge>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span><span>{p.progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded bg-muted">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
