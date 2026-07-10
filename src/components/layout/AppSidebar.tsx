import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Users,
  FolderKanban,
  Briefcase,
  ListTodo,
  KanbanSquare,
  FileText,
  Bug,
  GitPullRequest,
  Workflow,
  FlaskConical,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Settings,
  Sparkle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/context";
import type { AppRole } from "@/lib/auth/types";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles?: AppRole[];
  soon?: boolean;
}

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Workspace",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/organizations", label: "Organizations", icon: Building2 },
      { to: "/projects", label: "Projects", icon: FolderKanban },
      { to: "/portfolio", label: "Portfolio", icon: Briefcase },
    ],
  },
  {
    section: "Delivery",
    items: [
      { to: "/sprints", label: "Sprints", icon: KanbanSquare, soon: true },
      { to: "/tasks", label: "Tasks", icon: ListTodo, soon: true },
      { to: "/requirements", label: "Requirements", icon: FileText, soon: true },
      { to: "/bugs", label: "Bugs", icon: Bug, soon: true },
    ],
  },
  {
    section: "Engineering",
    items: [
      { to: "/code-review", label: "Code Review", icon: GitPullRequest, soon: true },
      { to: "/pipelines", label: "Pipelines", icon: Workflow, soon: true },
      { to: "/testing", label: "Testing", icon: FlaskConical, soon: true },
      { to: "/security", label: "Security", icon: ShieldCheck, soon: true },
    ],
  },
  {
    section: "Intelligence",
    items: [
      { to: "/analytics", label: "Analytics", icon: BarChart3, soon: true },
      { to: "/neurobot", label: "NeuroBot", icon: Sparkles, soon: true },
    ],
  },
  {
    section: "Personal",
    items: [
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) =>
    to === "/dashboard" ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const canSee = (roles?: AppRole[]) => (!roles ? true : !!user && roles.includes(user.role));

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 bg-slate-950 text-slate-200 shadow-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Primary navigation"
      >
        <div className="flex h-16 items-center border-b border-white/5 px-5">
          <Logo variant="dark" size="md" />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV.map((section) => (
            <div key={section.section} className="mb-5">
              <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {section.section}
              </div>
              <ul className="space-y-0.5">
                {section.items.filter((i) => canSee(i.roles)).map((item) => {
                  const active = isActive(item.to);
                  const Icon = item.icon;
                  const disabled = item.soon;
                  const content = (
                    <span
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                        active
                          ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-white ring-1 ring-inset ring-indigo-400/30"
                          : "text-slate-300 hover:bg-white/5 hover:text-white",
                        disabled ? "cursor-not-allowed opacity-60 hover:bg-transparent hover:text-slate-400" : "",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.soon ? (
                        <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium uppercase text-slate-400">
                          Soon
                        </span>
                      ) : null}
                    </span>
                  );
                  return (
                    <li key={item.to}>
                      {disabled ? (
                        <div aria-disabled="true">{content}</div>
                      ) : (
                        <Link to={item.to} onClick={onClose}>
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-transparent p-3 text-xs text-slate-300 ring-1 ring-inset ring-white/5">
            <Sparkle className="size-4 shrink-0 text-indigo-300" />
            <div>
              <div className="font-medium text-white">NeuroBot v0.9</div>
              <div className="text-slate-400">AI copilot for your SDLC</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
