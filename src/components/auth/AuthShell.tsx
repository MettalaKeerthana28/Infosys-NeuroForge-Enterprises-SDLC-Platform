import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Sparkles, ShieldCheck, Workflow } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-8 inline-block">
            <Logo />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p> : null}
          <div className="mt-8">{children}</div>
          {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-slate-950 text-white lg:block">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(700px 400px at 20% 10%, rgba(99,102,241,0.35), transparent), radial-gradient(700px 400px at 80% 80%, rgba(217,70,239,0.25), transparent)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo variant="dark" size="lg" />
          <div className="max-w-md">
            <div className="text-3xl font-semibold leading-snug">
              The AI-first SDLC platform enterprise engineering teams actually want to use.
            </div>
            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <Feature icon={Sparkles} title="NeuroBot copilot" desc="Drafts, reviews, summarises across your SDLC." />
              <Feature icon={Workflow} title="Unified pipelines" desc="CI/CD, policy gates and progressive delivery." />
              <Feature icon={ShieldCheck} title="Enterprise grade" desc="SSO, RBAC, audit trail, data residency." />
            </div>
          </div>
          <div className="text-xs text-slate-500">© {new Date().getFullYear()} NeuroForge</div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: typeof Sparkles; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-white/10">
        <Icon className="size-4" />
      </div>
      <div>
        <div className="font-medium text-white">{title}</div>
        <div className="text-slate-400">{desc}</div>
      </div>
    </div>
  );
}
