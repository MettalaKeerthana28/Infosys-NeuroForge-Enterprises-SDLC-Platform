import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  tone?: "default" | "success" | "warn" | "danger" | "info";
  className?: string;
}

const toneRing: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-muted text-foreground",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warn: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  info: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
};

export function StatCard({ label, value, icon: Icon, hint, tone = "default", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm transition hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
          {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
        </div>
        {Icon ? (
          <div className={cn("grid size-10 shrink-0 place-items-center rounded-lg", toneRing[tone])}>
            <Icon className="size-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
