import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { organizationsApi } from "@/lib/api/organizationsApi";

export const Route = createFileRoute("/_app/organizations/$organizationId")({
  component: OrganizationDetailLayout,
});

function OrganizationDetailLayout() {
  const { organizationId } = Route.useParams();
  const { data: org } = useQuery({
    queryKey: ["organization", organizationId],
    queryFn: () => organizationsApi.get(organizationId),
  });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const base = `/organizations/${organizationId}`;
  const tabs = [
    { to: base, label: "Overview", exact: true },
    { to: `${base}/teams`, label: "Teams" },
    { to: `${base}/members`, label: "Members" },
    { to: `${base}/settings`, label: "Settings" },
  ];

  return (
    <div>
      <PageHeader
        title={org?.displayName ?? "Organization"}
        description={org ? `${org.industry} · ${org.size} · ${org.plan} plan` : ""}
        actions={org ? <Badge variant="secondary">{org.status}</Badge> : null}
      />
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
