import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { organizationsApi } from "@/lib/api/organizationsApi";
import { useAuth } from "@/lib/auth/context";
import { can } from "@/lib/auth/permissions";

export const Route = createFileRoute("/_app/organizations/$organizationId/teams")({
  component: TeamsPage,
});

function TeamsPage() {
  const { organizationId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: teams = [] } = useQuery({
    queryKey: ["teams", organizationId],
    queryFn: () => organizationsApi.teamsFor(organizationId),
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", lead: "", tech: "" });

  const create = useMutation({
    mutationFn: () =>
      organizationsApi.createTeam({
        organizationId,
        name: form.name,
        description: form.description,
        lead: form.lead,
        tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teams", organizationId] });
      qc.invalidateQueries({ queryKey: ["organization", organizationId] });
      toast.success("Team created");
      setOpen(false);
      setForm({ name: "", description: "", lead: "", tech: "" });
    },
  });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        {can(user?.role, "teams.manage") ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 size-4" /> New team</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create team</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Team name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Team lead</Label>
                    <Input value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Technology (comma separated)</Label>
                    <Input value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => create.mutate()} disabled={!form.name || create.isPending}>
                  {create.isPending ? "Creating..." : "Create team"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
      {teams.length === 0 ? (
        <EmptyState icon={Users} title="No teams yet" description="Create a team to start organizing your members." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((t) => (
            <div key={t.id} className="rounded-xl border bg-card p-5">
              <div className="text-base font-semibold">{t.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{t.description}</div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-muted-foreground">Lead: <span className="text-foreground">{t.lead}</span></div>
                <div className="flex items-center gap-1 text-muted-foreground"><Users className="size-3.5" /> {t.memberCount}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.tech.map((x) => <Badge key={x} variant="secondary">{x}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
