import { useState, useEffect, useCallback, useRef } from "react";

interface GitCommit {
  hash: string;
  message: string;
}

interface GitStatus {
  branch: string;
  unpushedCount: number;
  unpushedCommits: GitCommit[];
  hasUncommittedChanges: boolean;
  uncommittedFileCount: number;
}

const EMPTY_STATUS: GitStatus = {
  branch: "",
  unpushedCount: 0,
  unpushedCommits: [],
  hasUncommittedChanges: false,
  uncommittedFileCount: 0,
};

const POLL_INTERVAL = 5_000;

export function useGitStatus() {
  const [status, setStatus] = useState<GitStatus>(EMPTY_STATUS);
  const [pushing, setPushing] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);
  const [reverting, setReverting] = useState(false);
  const [revertError, setRevertError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/git/status");
      if (res.ok) {
        setStatus(await res.json());
      }
    } catch {
      // network error — keep stale status
    }
  }, []);

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [refresh]);

  const push = useCallback(async () => {
    setPushing(true);
    setPushError(null);
    try {
      const res = await fetch("/api/git/push", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setPushError(data.error ?? "Push failed");
      } else {
        await refresh();
      }
    } catch (err) {
      setPushError(err instanceof Error ? err.message : "Push failed");
    } finally {
      setPushing(false);
    }
  }, [refresh]);

  const revert = useCallback(async () => {
    setReverting(true);
    setRevertError(null);
    try {
      const res = await fetch("/api/git/revert", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setRevertError(data.error ?? "Revert failed");
      } else {
        await refresh();
      }
    } catch (err) {
      setRevertError(err instanceof Error ? err.message : "Revert failed");
    } finally {
      setReverting(false);
    }
  }, [refresh]);

  return { ...status, pushing, pushError, push, reverting, revertError, revert, refresh };
}
