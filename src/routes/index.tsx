import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  Boxes,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  CheckCircle2,
  GitBranch,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteNav />
      <Hero />
      <Stats />
      <Capabilities />
      <Roles />
      <AiSection />
      <Security />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link to="/">
          <Logo variant="dark" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#capabilities" className="hover:text-white">Features</a>
          <a href="#roles" className="hover:text-white">Platform</a>
          <a href="#security" className="hover:text-white">Security</a>
          <a href="#final" className="hover:text-white">About</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="text-slate-200 hover:bg-white/5 hover:text-white">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90">
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(700px 400px at 20% 10%, rgba(99,102,241,0.25), transparent), radial-gradient(700px 400px at 80% 20%, rgba(217,70,239,0.15), transparent)",
        }}
      />
      <div className="mx-auto grid max-w-7xl gap-16 px-4 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <Sparkles className="size-3.5 text-indigo-300" />
            AI-first SDLC · Now with NeuroBot copilot
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Build Better Software with an{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              AI-First SDLC
            </span>{" "}
            Platform
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            NeuroForge brings planning, development, testing, release management and AI assistance
            into one platform your enterprise engineering org actually wants to use.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90">
              <Link to="/register">
                Start Building <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              <a href="#capabilities">View Platform</a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <div className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-400" /> SOC 2 aligned</div>
            <div className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-400" /> Role-based access</div>
            <div className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-400" /> End-to-end traceability</div>
          </div>
        </div>
        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-fuchsia-500/20 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/5 bg-slate-950/60 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-rose-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <div className="ml-3 text-xs text-slate-400">neuroforge.app / dashboard</div>
        </div>
        <div className="grid grid-cols-6 gap-0">
          <div className="col-span-2 border-r border-white/5 bg-slate-950 p-4">
            <Logo variant="dark" size="sm" />
            <div className="mt-4 space-y-1.5">
              {["Dashboard", "Organizations", "Projects", "Portfolio", "Pipelines", "NeuroBot"].map(
                (i, idx) => (
                  <div
                    key={i}
                    className={
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs " +
                      (idx === 0
                        ? "bg-gradient-to-r from-indigo-500/30 to-violet-500/10 text-white"
                        : "text-slate-400")
                    }
                  >
                    <span className="size-1.5 rounded-full bg-current opacity-60" />
                    {i}
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="col-span-4 space-y-3 p-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: "Active Projects", v: "12", t: "text-emerald-300" },
                { l: "At Risk", v: "3", t: "text-amber-300" },
                { l: "Bugs Open", v: "43", t: "text-rose-300" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg border border-white/5 bg-slate-900 p-2.5">
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">{s.l}</div>
                  <div className={"mt-1 text-lg font-semibold " + s.t}>{s.v}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-white/5 bg-slate-900 p-3">
              <div className="mb-2 text-xs font-medium text-slate-300">Portfolio Health</div>
              <div className="flex h-24 items-end gap-1.5">
                {[40, 60, 45, 72, 55, 82, 66, 90, 74, 62, 78, 88].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 rounded-sm bg-gradient-to-t from-indigo-500/40 to-violet-400/80"
                  />
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-white/5 bg-slate-900 p-3">
              <div className="mb-2 text-xs font-medium text-slate-300">Recent Activity</div>
              <div className="space-y-1.5">
                {[
                  "Priya merged NBT-142 into main",
                  "Quinn verified 8 tests on ATL",
                  "NeuroBot summarised sprint 24",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="size-1.5 rounded-full bg-indigo-400" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const items = [
    { v: "15", l: "SDLC modules" },
    { v: "6", l: "Role-based workspaces" },
    { v: "7", l: "AI features" },
    { v: "E2E", l: "Traceability" },
  ];
  return (
    <section className="border-y border-white/5 bg-slate-950/70">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 lg:px-8">
        {items.map((s) => (
          <div key={s.l} className="text-center">
            <div className="text-3xl font-semibold tracking-tight text-white">{s.v}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-slate-400">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Capabilities() {
  const items = [
    { icon: Boxes, title: "One platform, whole SDLC", desc: "Plan, build, test, ship and observe from a single system of record." },
    { icon: Workflow, title: "Unified pipelines", desc: "CI/CD with policy gates, progressive delivery and audit trail." },
    { icon: BrainCircuit, title: "NeuroBot copilot", desc: "AI that drafts requirements, reviews PRs and summarises sprints." },
    { icon: Users, title: "Role-based workspaces", desc: "Tailored views for admins, PMs, engineers, QA and stakeholders." },
    { icon: GitBranch, title: "Traceable delivery", desc: "Requirements → code → tests → releases, linked automatically." },
    { icon: ShieldCheck, title: "Enterprise ready", desc: "SSO, RBAC, audit logs and residency controls out of the box." },
  ];
  return (
    <section id="capabilities" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <SectionHead eyebrow="Capabilities" title="Everything your engineering org needs" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <div key={f.title} className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-indigo-400/30 hover:bg-white/[0.07]">
            <div className="mb-4 grid size-10 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <f.icon className="size-5" />
            </div>
            <div className="text-lg font-semibold">{f.title}</div>
            <p className="mt-1.5 text-sm text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Roles() {
  const roles = [
    { title: "Super Admin", desc: "Platform-wide visibility, org lifecycle and plans." },
    { title: "Org Admin", desc: "Manage teams, members and organization-wide settings." },
    { title: "Project Manager", desc: "Own portfolios, milestones, sprints and delivery." },
    { title: "Developer", desc: "Focused workspace for tasks, PRs and code review." },
    { title: "QA Tester", desc: "Test cases, execution runs and defect verification." },
    { title: "Stakeholder", desc: "Read-only insight into progress, milestones and risk." },
  ];
  return (
    <section id="roles" className="border-y border-white/5 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <SectionHead eyebrow="Role-based collaboration" title="A workspace that adapts to every role" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="rounded-xl border border-white/10 bg-slate-950/70 p-6">
              <div className="text-base font-semibold text-white">{r.title}</div>
              <p className="mt-1.5 text-sm text-slate-400">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHead eyebrow="AI-powered workflow" title="NeuroBot copilot across your SDLC" align="left" />
          <ul className="mt-6 space-y-3 text-slate-300">
            {[
              "Draft requirements and acceptance criteria from a brief",
              "Summarise sprints, pull requests and standups automatically",
              "Suggest test cases and detect regressions in CI",
              "Route incidents and surface at-risk projects proactively",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3 text-sm text-slate-300">
            <BrainCircuit className="size-4 text-indigo-300" />
            NeuroBot
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-lg bg-white/5 p-3 text-slate-300">
              Summarise this sprint and highlight blockers.
            </div>
            <div className="rounded-lg border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 p-3 text-slate-200">
              Sprint 24 shipped 34 of 41 story points. 3 issues blocked on auth service. Deployment
              window scheduled for Thursday, 09:00 UTC. Two at-risk items assigned to Priya.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Security() {
  const items = [
    { title: "Enterprise SSO", desc: "SAML, OIDC and SCIM provisioning." },
    { title: "Granular RBAC", desc: "Six built-in roles with per-project scopes." },
    { title: "Audit & compliance", desc: "Full audit trail, exportable evidence." },
    { title: "Data residency", desc: "Choose region, keep control." },
  ];
  return (
    <section id="security" className="border-t border-white/5 bg-slate-950/70">
      <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <SectionHead eyebrow="Secure by architecture" title="Enterprise controls, without the drag" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <div key={i.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <ShieldCheck className="size-5 text-emerald-400" />
              <div className="mt-3 text-base font-semibold">{i.title}</div>
              <p className="mt-1 text-sm text-slate-400">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section id="final" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-10 text-center text-white shadow-2xl">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Ship better software, together.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/80">
          Start with NeuroForge today. Bring your teams, projects and pipelines into one AI-first
          workspace.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-white/90">
            <Link to="/register">
              Get Started <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row lg:px-8">
        <Logo variant="dark" size="sm" />
        <div className="text-xs text-slate-500">© {new Date().getFullYear()} NeuroForge. All rights reserved.</div>
        <div className="flex items-center gap-3 text-slate-400">
          <a aria-label="Github" href="#" className="hover:text-white"><Github className="size-4" /></a>
          <a aria-label="Twitter" href="#" className="hover:text-white"><Twitter className="size-4" /></a>
          <a aria-label="LinkedIn" href="#" className="hover:text-white"><Linkedin className="size-4" /></a>
        </div>
      </div>
    </footer>
  );
}

function SectionHead({ eyebrow, title, align = "center" }: { eyebrow: string; title: string; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
    </div>
  );
}
