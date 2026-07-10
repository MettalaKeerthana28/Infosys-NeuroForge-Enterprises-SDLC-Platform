import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/_app/notifications")({
  component: () => (
    <ComingSoon
      title="notifications"
      description="This NeuroForge module is under active development."
    />
  ),
});
