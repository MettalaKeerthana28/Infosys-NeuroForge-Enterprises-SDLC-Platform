import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed bg-card px-6 py-16 text-center">
      {Icon ? (
        <div className="mb-4 grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-6" />
        </div>
      ) : null}
      <div className="text-lg font-semibold">{title}</div>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
