import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  FolderKanban,
  ListChecks,
  Plus,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/context";
import { organizationsApi } from "@/lib/api/organizationsApi";
import { projectsApi } from "@/lib/api/projectsApi";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { HealthBadge, StatusBadge } from "@/components/common/HealthBadge";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "there"}`}
        description={`Signed in as ${user ? ROLE_LABEL[user.role] : ""}. Here's what's happening in your workspace.`}
      />
      <RoleDashboard />
    </div>
  );
}

function RoleDashboard() {
  const { user } = useAuth();
  if (!user) return null;
  switch (user.role) {
    case "SUPER_ADMIN":
      return <SuperAdminDashboard />;
    case "ORG_ADMIN":
      return <OrgAdminDashboard />;
    case "PROJECT_MANAGER":
      return <PmDashboard />;
    case "DEVELOPER":
      return <DevDashboard />;
    case "QA_TESTER":
      return <QaDashboard />;
    case "STAKEHOLDER":
      return <StakeholderDashboard />;
    default:
      return <DevDashboard />;
  }
}

const orgGrowth = [
  { month: "Jan", orgs: 12 },
  { month: "Feb", orgs: 18 },
  { month: "Mar", orgs: 24 },
  { month: "Apr", orgs: 31 },
  { month: "May", orgs: 40 },
  { month: "Jun", orgs: 52 },
];

function SuperAdminDashboard() {
  const { data: orgs = [] } = useQuery({ queryKey: ["orgs"], queryFn: () => organizationsApi.list() });
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Organizations" value={orgs.length} icon={Building2} tone="info" hint="+3 this month" />
        <StatCard label="Platform users" value="1,284" icon={Users} tone="default" hint="+12% MoM" />
        <StatCard label="Active projects" value="47" icon={FolderKanban} tone="success" />
        <StatCard label="Monthly activity" value="94%" icon={Activity} tone="success" hint="uptime" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Organization growth" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={orgGrowth}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area dataKey="orgs" stroke="#6366f1" fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Platform healthy</div>
                <div className="text-xs text-muted-foreground">All services nominal</div>
              </div>
            </div>
          </div>
          <Button asChild className="w-full">
            <Link to="/organizations/new">
              <Plus className="mr-2 size-4" /> Create organization
            </Link>
          </Button>
        </div>
      </div>
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="text-sm font-semibold">Recent organizations</div>
          <Link to="/organizations" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr className="border-b">
              <th className="px-5 py-3 text-left font-medium">Organization</th>
              <th className="px-5 py-3 text-left font-medium">Plan</th>
              <th className="px-5 py-3 text-left font-medium">Members</th>
              <th className="px-5 py-3 text-left font-medium">Projects</th>
              <th className="px-5 py-3 text-left font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((o) => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="px-5 py-3 font-medium">{o.displayName}</td>
                <td className="px-5 py-3"><Badge variant="secondary">{o.plan}</Badge></td>
                <td className="px-5 py-3">{o.members}</td>
                <td className="px-5 py-3">{o.projects}</td>
                <td className="px-5 py-3 text-muted-foreground">{o.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrgAdminDashboard() {
  const { data: teams = [] } = useQuery({
    queryKey: ["teams", "org_neuroforge"],
    queryFn: () => organizationsApi.teamsFor("org_neuroforge"),
  });
  const { data: members = [] } = useQuery({
    queryKey: ["members", "org_neuroforge"],
    queryFn: () => organizationsApi.membersFor("org_neuroforge"),
  });
  const teamDist = teams.map((t) => ({ name: t.name, value: t.memberCount }));
  const colors = ["#6366f1", "#8b5cf6", "#d946ef", "#06b6d4", "#10b981", "#f59e0b"];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Teams" value={teams.length} icon={Users} tone="info" />
        <StatCard label="Members" value={members.length} icon={Users} />
        <StatCard label="Active projects" value="12" icon={FolderKanban} tone="success" />
        <StatCard label="Pending invites" value={members.filter((m) => m.status === "INVITED").length} icon={Clock} tone="warn" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Team distribution" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={teamDist} dataKey="value" innerRadius={60} outerRadius={100} paddingAngle={3}>
                {teamDist.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/organizations/$organizationId/teams" params={{ organizationId: "org_neuroforge" }}>
              <Plus className="mr-2 size-4" /> Create team
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/organizations/$organizationId/members" params={{ organizationId: "org_neuroforge" }}>
              Invite member
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function PmDashboard() {
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => projectsApi.list() });
  const health = [
    { name: "On Track", value: projects.filter((p) => p.health === "ON_TRACK").length, fill: "#10b981" },
    { name: "At Risk", value: projects.filter((p) => p.health === "AT_RISK").length, fill: "#f59e0b" },
    { name: "Delayed", value: projects.filter((p) => p.health === "DELAYED").length, fill: "#f43f5e" },
  ];
  const sprints = [
    { name: "S22", planned: 40, completed: 38 },
    { name: "S23", planned: 44, completed: 41 },
    { name: "S24", planned: 42, completed: 34 },
    { name: "S25", planned: 46, completed: 22 },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value={projects.filter((p) => p.status === "ACTIVE").length} icon={FolderKanban} tone="info" />
        <StatCard label="On track" value={health[0].value} icon={CheckCircle2} tone="success" />
        <StatCard label="At risk" value={health[1].value} icon={AlertTriangle} tone="warn" />
        <StatCard label="Delayed" value={health[2].value} icon={AlertTriangle} tone="danger" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Sprint progress" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sprints}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="planned" fill="#c7d2fe" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Project health">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={health} dataKey="value" innerRadius={55} outerRadius={95}>
                {health.map((h, i) => <Cell key={i} fill={h.fill} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="text-sm font-semibold">Recent projects</div>
          <Button asChild size="sm">
            <Link to="/projects/new"><Plus className="mr-1.5 size-3.5" /> New project</Link>
          </Button>
        </div>
        <div className="divide-y">
          {projects.slice(0, 4).map((p) => (
            <Link
              key={p.id}
              to="/projects/$projectId"
              params={{ projectId: p.id }}
              className="flex items-center justify-between px-5 py-3 hover:bg-muted/50"
            >
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">{p.key}</span>
                  {p.name}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{p.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={p.status} />
                <HealthBadge health={p.health} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function DevDashboard() {
  const trend = [
    { d: "Mon", done: 3 },
    { d: "Tue", done: 5 },
    { d: "Wed", done: 2 },
    { d: "Thu", done: 6 },
    { d: "Fri", done: 4 },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assigned tasks" value="18" icon={ListChecks} tone="info" />
        <StatCard label="In progress" value="4" icon={Activity} />
        <StatCard label="Completed this week" value="12" icon={CheckCircle2} tone="success" />
        <StatCard label="Blocked" value="1" icon={AlertTriangle} tone="danger" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Throughput" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis dataKey="d" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area dataKey="done" stroke="#8b5cf6" fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold">My projects</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between"><span>NeuroBot Copilot</span><Badge variant="secondary">NBT</Badge></li>
            <li className="flex justify-between"><span>Portfolio Insights</span><Badge variant="secondary">PORT</Badge></li>
            <li className="flex justify-between"><span>Atlas Traceability</span><Badge variant="secondary">ATL</Badge></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function QaDashboard() {
  const data = [
    { day: "Mon", pass: 22, fail: 3 },
    { day: "Tue", pass: 28, fail: 5 },
    { day: "Wed", pass: 31, fail: 2 },
    { day: "Thu", pass: 26, fail: 6 },
    { day: "Fri", pass: 34, fail: 1 },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open test cases" value="112" icon={ListChecks} tone="info" />
        <StatCard label="Failed tests" value="7" icon={AlertTriangle} tone="danger" />
        <StatCard label="Bugs to verify" value="14" icon={Clock} tone="warn" />
        <StatCard label="Critical defects" value="2" icon={AlertTriangle} tone="danger" />
      </div>
      <ChartCard title="Test execution">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
            <XAxis dataKey="day" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="pass" stackId="a" fill="#10b981" />
            <Bar dataKey="fail" stackId="a" fill="#f43f5e" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function StakeholderDashboard() {
  const trend = [
    { m: "Jan", progress: 20 },
    { m: "Feb", progress: 32 },
    { m: "Mar", progress: 45 },
    { m: "Apr", progress: 58 },
    { m: "May", progress: 66 },
    { m: "Jun", progress: 72 },
  ];
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
        Read-only view. You can view progress, milestones and reports.
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Overall completion" value="72%" icon={TrendingUp} tone="success" />
        <StatCard label="Active milestones" value="6" icon={CheckCircle2} tone="info" />
        <StatCard label="Releases this quarter" value="4" icon={ShieldCheck} />
        <StatCard label="Overall health" value="On Track" icon={Activity} tone="success" />
      </div>
      <ChartCard title="Portfolio progress">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
            <XAxis dataKey="m" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Area dataKey="progress" stroke="#06b6d4" fill="url(#g3)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border bg-card p-5 ${className ?? ""}`}>
      <div className="mb-4 text-sm font-semibold">{title}</div>
      {children}
    </div>
  );
}
