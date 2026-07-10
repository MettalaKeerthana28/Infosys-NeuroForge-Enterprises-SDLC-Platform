import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/_app/sprints")({
  component: () => (
    <ComingSoon
      title="sprints"
      description="This NeuroForge module is under active development."
    />
  ),
});
