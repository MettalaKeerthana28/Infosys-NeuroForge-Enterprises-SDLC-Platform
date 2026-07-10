import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organizationsApi } from "@/lib/api/organizationsApi";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { ALL_ROLES } from "@/lib/auth/types";
import { useAuth } from "@/lib/auth/context";
import { can } from "@/lib/auth/permissions";

export const Route = createFileRoute("/_app/organizations/$organizationId/members")({
  component: MembersPage,
});

function MembersPage() {
  const { organizationId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: members = [] } = useQuery({
    queryKey: ["members", organizationId],
    queryFn: () => organizationsApi.membersFor(organizationId),
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "DEVELOPER" });

  const invite = useMutation({
    mutationFn: () =>
      organizationsApi.inviteMember({
        organizationId,
        name: form.name || form.email,
        email: form.email,
        role: form.role,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members", organizationId] });
      toast.success("Invitation sent");
      setOpen(false);
      setForm({ name: "", email: "", role: "DEVELOPER" });
    },
  });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        {can(user?.role, "members.invite") ? (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 size-4" /> Invite member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Invite a new member</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ALL_ROLES.map((r) => <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={!form.email || invite.isPending} onClick={() => invite.mutate()}>
                  <Mail className="mr-2 size-4" /> Send invite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr className="border-b">
                <th className="px-5 py-3 text-left font-medium">Name</th>
                <th className="px-5 py-3 text-left font-medium">Email</th>
                <th className="px-5 py-3 text-left font-medium">Role</th>
                <th className="px-5 py-3 text-left font-medium">Team</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="px-5 py-3 font-medium">{m.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{m.email}</td>
                  <td className="px-5 py-3">{ROLE_LABEL[m.role as keyof typeof ROLE_LABEL] ?? m.role}</td>
                  <td className="px-5 py-3">{m.team ?? "—"}</td>
                  <td className="px-5 py-3">
                    <Badge variant={m.status === "ACTIVE" ? "secondary" : "outline"}>{m.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{m.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
