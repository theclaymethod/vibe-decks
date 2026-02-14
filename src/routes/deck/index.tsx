import { createFileRoute, redirect } from "@tanstack/react-router";
import { TOTAL_SLIDES } from "@/deck/config";

export const Route = createFileRoute("/deck/")({
  beforeLoad: () => {
    if (TOTAL_SLIDES === 0) return;
    throw redirect({ to: "/deck/$slide", params: { slide: "1" } });
  },
  component: EmptyDeck,
});

function EmptyDeck() {
  return (
    <div className="h-screen flex items-center justify-center bg-neutral-900 text-white">
      <p className="text-sm text-neutral-400">
        No slides yet. Open the builder to get started.
      </p>
    </div>
  );
}
