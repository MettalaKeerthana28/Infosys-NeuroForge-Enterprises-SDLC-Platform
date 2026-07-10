import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/common/ComingSoon";

export const Route = createFileRoute("/_app/testing")({
  component: () => (
    <ComingSoon
      title="testing"
      description="This NeuroForge module is under active development."
    />
  ),
});
