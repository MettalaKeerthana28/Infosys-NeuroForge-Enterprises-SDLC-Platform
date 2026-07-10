import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organizationsApi } from "@/lib/api/organizationsApi";
import { projectsApi } from "@/lib/api/projectsApi";
import type { Methodology, Project, ProjectHealth, ProjectStatus } from "@/mocks/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/projects/new")({
  component: NewProjectPage,
});

interface WizardState {
  name: string;
  key: string;
  description: string;
  methodology: Methodology;
  startDate: string;
  targetEndDate: string;
  priority: Project["priority"];
  tech: string;
  organizationId: string;
  status: ProjectStatus;
  health: ProjectHealth;
}

const steps = ["Basics", "Timeline", "Team", "Review"];

function NewProjectPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const { data: orgs = [] } = useQuery({ queryKey: ["organizations"], queryFn: () => organizationsApi.list() });

  const [v, setV] = useState<WizardState>({
    name: "",
    key: "",
    description: "",
    methodology: "AGILE",
    startDate: new Date().toISOString().slice(0, 10),
    targetEndDate: "",
    priority: "MEDIUM",
    tech: "",
    organizationId: orgs[0]?.id ?? "org_neuroforge",
    status: "PLANNING",
    health: "ON_TRACK",
  });

  const create = useMutation({
    mutationFn: () =>
      projectsApi.create({
        name: v.name,
        key: v.key.toUpperCase(),
        description: v.description,
        methodology: v.methodology,
        startDate: v.startDate,
        targetEndDate: v.targetEndDate || v.startDate,
        priority: v.priority,
        tech: v.tech.split(",").map((t) => t.trim()).filter(Boolean),
        organizationId: v.organizationId || "org_neuroforge",
        status: v.status,
        health: v.health,
        managerId: "m3",
        memberIds: ["m3"],
      }),
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created");
      navigate({ to: "/projects/$projectId", params: { projectId: p.id } });
    },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New project" description="Set up a project in four short steps." />
      <div className="mb-6 flex gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={cn("h-1 rounded-full", i <= step ? "bg-indigo-500" : "bg-muted")} />
            <div className={cn("mt-1 text-xs", i === step ? "font-semibold text-foreground" : "text-muted-foreground")}>{s}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-6">
        {step === 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name"><Input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /></Field>
            <Field label="Key (short code)"><Input maxLength={6} value={v.key} onChange={(e) => setV({ ...v, key: e.target.value })} placeholder="NF" /></Field>
            <Field label="Description" className="md:col-span-2">
              <Textarea rows={3} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} />
            </Field>
            <Field label="Methodology">
              <Select value={v.methodology} onValueChange={(x) => setV({ ...v, methodology: x as Methodology })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="AGILE">Agile</SelectItem>
                  <SelectItem value="WATERFALL">Waterfall</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Priority">
              <Select value={v.priority} onValueChange={(x) => setV({ ...v, priority: x as Project["priority"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
        ) : null}
        {step === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Start date"><Input type="date" value={v.startDate} onChange={(e) => setV({ ...v, startDate: e.target.value })} /></Field>
            <Field label="Target end date"><Input type="date" value={v.targetEndDate} onChange={(e) => setV({ ...v, targetEndDate: e.target.value })} /></Field>
            <Field label="Technology stack (comma separated)" className="md:col-span-2">
              <Input value={v.tech} onChange={(e) => setV({ ...v, tech: e.target.value })} placeholder="React, Node, Postgres" />
            </Field>
          </div>
        ) : null}
        {step === 2 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Organization">
              <Select value={v.organizationId} onValueChange={(x) => setV({ ...v, organizationId: x })}>
                <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>
                  {orgs.map((o) => <SelectItem key={o.id} value={o.id}>{o.displayName}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status">
              <Select value={v.status} onValueChange={(x) => setV({ ...v, status: x as ProjectStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["PLANNING", "ACTIVE", "ON_HOLD"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
        ) : null}
        {step === 3 ? (
          <div className="space-y-2 text-sm">
            <Row label="Name" value={v.name} />
            <Row label="Key" value={v.key.toUpperCase()} />
            <Row label="Methodology" value={v.methodology} />
            <Row label="Priority" value={v.priority} />
            <Row label="Timeline" value={`${v.startDate} → ${v.targetEndDate || "—"}`} />
            <Row label="Tech" value={v.tech || "—"} />
            <Row label="Organization" value={orgs.find((o) => o.id === v.organizationId)?.displayName ?? v.organizationId} />
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
        {step < steps.length - 1 ? (
          <Button
            disabled={step === 0 && (!v.name || !v.key)}
            onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          >
            Next <ArrowRight className="ml-2 size-4" />
          </Button>
        ) : (
          <Button disabled={create.isPending} onClick={() => create.mutate()}>
            <Check className="mr-2 size-4" /> {create.isPending ? "Creating..." : "Create project"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
