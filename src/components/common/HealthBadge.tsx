import { Badge } from "@/components/ui/badge";
import type { ProjectHealth, ProjectStatus } from "@/mocks/data";
import { cn } from "@/lib/utils";

const healthTone: Record<ProjectHealth, string> = {
  ON_TRACK: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  AT_RISK: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  DELAYED: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
};

const statusTone: Record<ProjectStatus, string> = {
  PLANNING: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
  ACTIVE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  ON_HOLD: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
  COMPLETED: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  ARCHIVED: "bg-muted text-muted-foreground border-border",
};

const healthLabel: Record<ProjectHealth, string> = {
  ON_TRACK: "On Track",
  AT_RISK: "At Risk",
  DELAYED: "Delayed",
};

const statusLabel: Record<ProjectStatus, string> = {
  PLANNING: "Planning",
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

export function HealthBadge({ health }: { health: ProjectHealth }) {
  return (
    <Badge variant="outline" className={cn("border", healthTone[health])}>
      {healthLabel[health]}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant="outline" className={cn("border", statusTone[status])}>
      {statusLabel[status]}
    </Badge>
  );
}
