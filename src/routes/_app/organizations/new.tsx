import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { extractErrorMessage } from "@/lib/api/errors";

const schema = z.object({
  name: z.string().trim().min(2).max(40),
  displayName: z.string().trim().min(2).max(60),
  industry: z.string().min(1, "Required"),
  size: z.string().min(1, "Required"),
  plan: z.enum(["Free", "Team", "Business", "Enterprise"]),
  website: z.string().url().or(z.literal("")).optional(),
  description: z.string().max(400).optional(),
});
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/_app/organizations/new")({
  component: NewOrganizationPage,
});

function NewOrganizationPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { plan: "Team", size: "11-50", industry: "Software" },
  });

  const create = useMutation({
    mutationFn: (v: FormValues) =>
      organizationsApi.create({
        name: v.name,
        displayName: v.displayName,
        industry: v.industry,
        size: v.size,
        plan: v.plan,
      }),
    onSuccess: (org) => {
      qc.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization created");
      navigate({ to: "/organizations/$organizationId", params: { organizationId: org.id } });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Create organization" description="Set up a new workspace in NeuroForge." />
      <form className="space-y-6 rounded-xl border bg-card p-6" onSubmit={handleSubmit((v) => create.mutate(v))} noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Slug" error={errors.name?.message}>
            <Input placeholder="acme" {...register("name")} />
          </Field>
          <Field label="Display name" error={errors.displayName?.message}>
            <Input placeholder="Acme Corp" {...register("displayName")} />
          </Field>
          <Field label="Industry" error={errors.industry?.message}>
            <Input {...register("industry")} />
          </Field>
          <Field label="Company size">
            <Select defaultValue={watch("size")} onValueChange={(v) => setValue("size", v, { shouldValidate: true })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Plan">
            <Select defaultValue={watch("plan")} onValueChange={(v) => setValue("plan", v as FormValues["plan"], { shouldValidate: true })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Free", "Team", "Business", "Enterprise"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Website" error={errors.website?.message}>
            <Input placeholder="https://" {...register("website")} />
          </Field>
        </div>
        <Field label="Description">
          <Textarea rows={4} {...register("description")} placeholder="What does this organization do?" />
        </Field>
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/organizations" })}>
            Cancel
          </Button>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Creating..." : "Create organization"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
