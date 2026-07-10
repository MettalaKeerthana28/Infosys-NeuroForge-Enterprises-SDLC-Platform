import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
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
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { projectsApi } from "@/lib/api/projectsApi";
import { HealthBadge, StatusBadge } from "@/components/common/HealthBadge";
import { AlertTriangle, Briefcase, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/portfolio")({
  component: PortfolioPage,
});

function PortfolioPage() {
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: () => projectsApi.list() });
  const onTrack = projects.filter((p) => p.health === "ON_TRACK").length;
  const atRisk = projects.filter((p) => p.health === "AT_RISK").length;
  const delayed = projects.filter((p) => p.health === "DELAYED").length;

  const healthData = [
    { name: "On Track", value: onTrack, fill: "#10b981" },
    { name: "At Risk", value: atRisk, fill: "#f59e0b" },
    { name: "Delayed", value: delayed, fill: "#f43f5e" },
  ];
  const progressData = projects.map((p) => ({ name: p.key, progress: p.progress }));

  return (
    <div>
      <PageHeader title="Portfolio" description="Cross-project health, progress and risk." />
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Projects" value={projects.length} icon={Briefcase} tone="info" />
        <StatCard label="On track" value={onTrack} icon={CheckCircle2} tone="success" />
        <StatCard label="At risk" value={atRisk} icon={Clock} tone="warn" />
        <StatCard label="Delayed" value={delayed} icon={AlertTriangle} tone="danger" />
      </div>
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 lg:col-span-2">
          <div className="mb-4 text-sm font-semibold">Project progress</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="progress" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="mb-4 text-sm font-semibold">Health distribution</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={healthData} dataKey="value" innerRadius={60} outerRadius={100}>
                {healthData.map((h, i) => <Cell key={i} fill={h.fill} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-5 py-4 text-sm font-semibold">Project comparison</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b">
                <th className="px-5 py-3 text-left font-medium">Project</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Health</th>
                <th className="px-5 py-3 text-left font-medium">Progress</th>
                <th className="px-5 py-3 text-left font-medium">Open tasks</th>
                <th className="px-5 py-3 text-left font-medium">Open bugs</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-5 py-3 font-medium">
                    <span className="mr-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{p.key}</span>
                    {p.name}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3"><HealthBadge health={p.health} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded bg-muted">
                        <div className="h-full bg-indigo-500" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">{p.openTasks}</td>
                  <td className="px-5 py-3">{p.openBugs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
