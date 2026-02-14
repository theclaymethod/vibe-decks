import { createFileRoute } from "@tanstack/react-router";
import { DesignSystemWizard } from "@/builder/components/design-system-wizard";

export const Route = createFileRoute("/builder/create-design-system")({
  component: CreateDesignSystemPage,
});

function CreateDesignSystemPage() {
  return <DesignSystemWizard />;
}
