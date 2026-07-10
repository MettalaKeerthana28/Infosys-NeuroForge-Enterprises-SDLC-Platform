import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Building2, Plus, Search, Users, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { organizationsApi } from "@/lib/api/organizationsApi";
import { useAuth } from "@/lib/auth/context";
import { can } from "@/lib/auth/permissions";

export const Route = createFileRoute("/_app/organizations/")({
  component: OrganizationsPage,
});

function OrganizationsPage() {
  const { user } = useAuth();
  const { data: orgs = [], isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => organizationsApi.list(),
  });
  const [q, setQ] = useState("");
  const filtered = orgs.filter((o) =>
    (o.displayName + o.name + o.industry).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Organizations"
        description="Manage the organizations connected to NeuroForge."
        actions={
          can(user?.role, "organizations.create") ? (
            <Button asChild>
              <Link to="/organizations/new">
                <Plus className="mr-2 size-4" /> New organization
              </Link>
            </Button>
          ) : null
        }
      />
      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search organizations"
            className="pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border bg-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations yet"
          description="Create your first organization to get started."
          action={
            <Button asChild>
              <Link to="/organizations/new"><Plus className="mr-2 size-4" /> New organization</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => (
            <Link
              key={o.id}
              to="/organizations/$organizationId"
              params={{ organizationId: o.id }}
              className="group rounded-xl border bg-card p-5 shadow-sm transition hover:border-indigo-400/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-semibold group-hover:text-indigo-600">{o.displayName}</div>
                  <div className="text-xs text-muted-foreground">{o.industry} · {o.size}</div>
                </div>
                <Badge variant="secondary">{o.plan}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Teams</div>
                  <div className="font-semibold">{o.teams}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Members</div>
                  <div className="font-semibold flex items-center gap-1"><Users className="size-3.5" /> {o.members}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                  <div className="font-semibold flex items-center gap-1"><FolderKanban className="size-3.5" /> {o.projects}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
