import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function ComingSoon({ title, description, icon: Icon = Sparkles }: ComingSoonProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="grid place-items-center rounded-2xl border border-dashed bg-card px-6 py-24 text-center">
        <div className="mb-4 grid size-14 place-items-center rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/10 text-indigo-600">
          <Icon className="size-7" />
        </div>
        <div className="text-lg font-semibold">Coming soon</div>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          This module is on our roadmap. In the meantime, explore the parts of NeuroForge that are
          already available.
        </p>
        <div className="mt-4 flex gap-2">
          <Button asChild>
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/projects">View projects</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
