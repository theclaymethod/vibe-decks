import { useState } from "react";
import { useGitStatus } from "../hooks/use-git-status";

export function GitStatusIndicator() {
  const git = useGitStatus();
  const [confirmRevert, setConfirmRevert] = useState(false);

  if (git.unpushedCount === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-amber-100 text-amber-700 tabular-nums">
        {git.unpushedCount} unpushed
      </span>

      <button
        onClick={git.push}
        disabled={git.pushing}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-md hover:bg-neutral-800 disabled:opacity-50 transition-colors"
      >
        {git.pushing ? (
          <>
            <svg className="w-3 h-3 animate-spin" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" />
            </svg>
            Pushing…
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 12V4M5 7l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Push
          </>
        )}
      </button>

      {confirmRevert ? (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-red-600 font-medium">Discard all unpushed?</span>
          <button
            onClick={async () => {
              await git.revert();
              setConfirmRevert(false);
            }}
            disabled={git.reverting}
            className="px-2 py-1 text-[11px] font-medium rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {git.reverting ? "Reverting…" : "Yes, revert"}
          </button>
          <button
            onClick={() => setConfirmRevert(false)}
            className="px-2 py-1 text-[11px] font-medium rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirmRevert(true)}
          disabled={git.reverting}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-300 text-neutral-600 text-xs font-medium rounded-md hover:bg-neutral-50 disabled:opacity-50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M4 7l-2 2 2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 9h8a3 3 0 0 0 0-6H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Revert
        </button>
      )}

      {git.pushError && (
        <span className="text-[11px] text-red-600">{git.pushError}</span>
      )}
      {git.revertError && (
        <span className="text-[11px] text-red-600">{git.revertError}</span>
      )}
    </div>
  );
}
