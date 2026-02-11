import { Link, useNavigate } from "@tanstack/react-router";
import { SLIDE_CONFIG } from "@/deck/config";

interface SlidePickerProps {
  selectedFileKey: string | null;
}

export function SlidePicker({ selectedFileKey }: SlidePickerProps) {
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fileKey = e.target.value;
    if (fileKey) {
      navigate({ to: "/builder/$fileKey", params: { fileKey } });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Slide
        </h3>
        <Link
          to="/builder"
          className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          All Slides
        </Link>
      </div>
      <select
        value={selectedFileKey ?? ""}
        onChange={handleChange}
        className="w-full px-2 py-1.5 border border-neutral-200 rounded text-sm bg-white focus:border-neutral-400 outline-none"
      >
        <option value="" disabled>
          Select a slide...
        </option>
        {SLIDE_CONFIG.map((slide, i) => (
          <option key={slide.fileKey} value={slide.fileKey}>
            {String(i + 1).padStart(2, "0")} — {slide.title}
          </option>
        ))}
      </select>
    </div>
  );
}
