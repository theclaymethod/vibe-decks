import { useEffect, useRef } from "react";

interface DesignBriefModalProps {
  open: boolean;
  content: string | null;
  onClose: () => void;
}

export function DesignBriefModal({ open, content, onClose }: DesignBriefModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open || !content) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-8"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-800">Design Brief</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 transition-colors text-lg leading-none"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">
          <pre className="text-sm text-neutral-700 whitespace-pre-wrap font-sans leading-relaxed">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}
