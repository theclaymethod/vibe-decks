import { createFileRoute } from "@tanstack/react-router";
import { DesignerView } from "@/builder/components/designer-view";

export const Route = createFileRoute("/builder/designer")({
  component: DesignerPage,
});

function DesignerPage() {
  return <DesignerView />;
}
