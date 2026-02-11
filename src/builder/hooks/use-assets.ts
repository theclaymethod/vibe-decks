import { useState, useCallback, useEffect } from "react";

const API_BASE = "http://localhost:3333";

export interface Asset {
  filename: string;
  path: string;
  size: number;
  mime: string;
  modified: number;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useAssets(folder?: string) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const qs = folder ? `?folder=${encodeURIComponent(folder)}` : "";
      const res = await fetch(`${API_BASE}/api/assets/list${qs}`);
      const data = await res.json();
      setAssets(data.assets ?? []);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [folder]);

  const upload = useCallback(
    async (file: File): Promise<Asset> => {
      const data = await fileToBase64(file);
      const res = await fetch(`${API_BASE}/api/assets/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, data, folder }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Upload failed");
      await refresh();
      return { ...result, mime: file.type, modified: Date.now() };
    },
    [folder, refresh]
  );

  const remove = useCallback(
    async (filename: string) => {
      const deletePath = folder ? `${folder}/${filename}` : filename;
      const res = await fetch(`${API_BASE}/api/assets/${encodeURIComponent(deletePath)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      await refresh();
    },
    [folder, refresh]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { assets, loading, refresh, upload, remove };
}
