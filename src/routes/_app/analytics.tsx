import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/_app/analytics")({
  component: () => (
    <ComingSoon
      title="analytics"
      description="This NeuroForge module is under active development."
    />
  ),
});
