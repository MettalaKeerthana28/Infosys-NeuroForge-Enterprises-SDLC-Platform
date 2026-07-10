import { BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
  showSubtitle?: boolean;
}

const sizeMap = {
  sm: { icon: "size-6", title: "text-sm", sub: "text-[10px]" },
  md: { icon: "size-8", title: "text-base", sub: "text-xs" },
  lg: { icon: "size-10", title: "text-lg", sub: "text-xs" },
};

export function Logo({ className, size = "md", variant = "light", showSubtitle = true }: LogoProps) {
  const s = sizeMap[size];
  const isDark = variant === "dark";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "grid place-items-center rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-md",
          s.icon,
        )}
        aria-hidden="true"
      >
        <BrainCircuit className="size-[70%]" />
      </div>
      <div className="leading-tight">
        <div className={cn("font-semibold tracking-tight", isDark ? "text-white" : "text-foreground", s.title)}>
          NeuroForge
        </div>
        {showSubtitle ? (
          <div className={cn("uppercase tracking-wider", isDark ? "text-white/60" : "text-muted-foreground", s.sub)}>
            AI-First SDLC
          </div>
        ) : null}
      </div>
    </div>
  );
}
