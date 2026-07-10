import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/_app/tasks")({
  component: () => (
    <ComingSoon
      title="tasks"
      description="This NeuroForge module is under active development."
    />
  ),
});
