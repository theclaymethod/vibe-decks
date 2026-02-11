import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAssets, type Asset } from "../hooks/use-assets";

interface AssetBrowserProps {
  open: boolean;
  onClose: () => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AssetCard({
  asset,
  onCopy,
  onDelete,
}: {
  asset: Asset;
  onCopy: (path: string) => void;
  onDelete: (filename: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isImage = asset.mime.startsWith("image/");

  const handleCopy = () => {
    onCopy(asset.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white hover:border-neutral-300 transition-colors group">
      <div className="aspect-[4/3] bg-neutral-50 flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img src={`${asset.path}?t=${asset.modified}`} alt={asset.filename} className="w-full h-full object-cover" />
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-300">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        )}
      </div>
      <div className="p-2 space-y-1">
        <p className="text-xs font-medium text-neutral-700 truncate" title={asset.filename}>
          {asset.filename}
        </p>
        <p className="text-[10px] text-neutral-400">{formatSize(asset.size)}</p>
        <div className="flex gap-1 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 text-[10px] px-2 py-1 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            {copied ? "Copied!" : "Copy Path"}
          </button>
          <button
            onClick={() => onDelete(asset.filename)}
            className="text-[10px] px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function AssetBrowser({ open, onClose }: AssetBrowserProps) {
  const { assets, loading, upload, remove } = useAssets();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploading(true);
      try {
        for (const file of Array.from(files)) {
          await upload(file);
        }
      } finally {
        setUploading(false);
      }
    },
    [upload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) handleFiles(files);
    },
    [handleFiles]
  );

  const handleCopy = useCallback((path: string) => {
    navigator.clipboard.writeText(path);
  }, []);

  const handleDelete = useCallback(
    async (filename: string) => {
      await remove(filename);
    },
    [remove]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col mx-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-800">Assets</h2>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs px-3 py-1.5 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 2l8 8M10 2l-8 8" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto p-5"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {loading && assets.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-neutral-400">
              Loading...
            </div>
          ) : assets.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-full py-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer",
                dragging
                  ? "border-blue-400 bg-blue-50"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-sm text-neutral-400">Drop files here or click to upload</p>
            </button>
          ) : (
            <div
              className={cn(
                "grid grid-cols-3 gap-3",
                dragging && "ring-2 ring-blue-300 ring-offset-2 rounded-lg"
              )}
            >
              {assets.map((asset) => (
                <AssetCard
                  key={asset.filename}
                  asset={asset}
                  onCopy={handleCopy}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
