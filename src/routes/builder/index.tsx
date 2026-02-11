import { createFileRoute, Link } from "@tanstack/react-router";
import { SLIDE_CONFIG } from "@/deck/config";

export const Route = createFileRoute("/builder/")({
  component: BuilderIndex,
});

function BuilderIndex() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900">Slides</h1>
          <Link
            to="/builder/$fileKey"
            params={{ fileKey: "new" }}
            className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            + Create New Slide
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SLIDE_CONFIG.map((slide, i) => (
            <Link
              key={slide.fileKey}
              to="/builder/$fileKey"
              params={{ fileKey: slide.fileKey }}
              className="group block border border-neutral-200 rounded-lg bg-white hover:border-neutral-400 hover:shadow-sm transition-all"
            >
              <div className="aspect-video bg-neutral-100 rounded-t-lg flex items-center justify-center">
                <span className="text-3xl font-semibold text-neutral-300 group-hover:text-neutral-400 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-sm font-medium text-neutral-800 truncate">
                  {slide.title}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {slide.fileKey}.tsx
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
