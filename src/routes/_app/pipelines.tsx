import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/_app/pipelines")({
  component: () => (
    <ComingSoon
      title="pipelines"
      description="This NeuroForge module is under active development."
    />
  ),
});
