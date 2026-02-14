import { useState, useCallback } from "react";

interface UseClearExamplesReturn {
  clearing: boolean;
  clearExamples: () => Promise<void>;
}

export function useClearExamples(): UseClearExamplesReturn {
  const [clearing, setClearing] = useState(false);

  const clearExamples = useCallback(async () => {
    setClearing(true);
    try {
      const resp = await fetch("/api/clear-examples", { method: "POST" });
      if (!resp.ok) throw new Error("Failed to clear examples");
      window.location.reload();
    } catch (err) {
      console.error("Failed to clear examples:", err);
      setClearing(false);
    }
  }, []);

  return { clearing, clearExamples };
}
