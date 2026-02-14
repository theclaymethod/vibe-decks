import { createFileRoute } from "@tanstack/react-router";
import { BuilderLayout } from "@/builder/components/builder-layout";

export const Route = createFileRoute("/builder/$fileKey")({
  component: BuilderPage,
});

function BuilderPage() {
  const { fileKey } = Route.useParams();
  return <BuilderLayout fileKey={fileKey} />;
}
