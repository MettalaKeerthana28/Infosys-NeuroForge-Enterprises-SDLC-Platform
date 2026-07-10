import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth/context";
import { ROLE_LABEL } from "@/lib/auth/permissions";
import { initials } from "@/lib/utils/format";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div>
      <PageHeader title="Profile" description="Your account details." />
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-lg text-white">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            <Badge className="mt-2" variant="secondary">{ROLE_LABEL[user.role]}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
