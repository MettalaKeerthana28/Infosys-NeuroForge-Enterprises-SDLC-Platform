import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/_app/requirements")({
  component: () => (
    <ComingSoon
      title="requirements"
      description="This NeuroForge module is under active development."
    />
  ),
});
