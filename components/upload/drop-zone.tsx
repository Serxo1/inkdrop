"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { sanitizeSvg } from "@/lib/svg-sanitizer";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function DropZone() {
  const { t } = useI18n();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!file.name.toLowerCase().endsWith(".svg") || file.type !== "image/svg+xml") {
        setError(t.upload.invalidFile);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(t.upload.fileTooLarge);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const svgContent = sanitizeSvg(reader.result as string);
        if (!svgContent) {
          setError(t.upload.invalidFile);
          return;
        }
        sessionStorage.setItem("inkdrop-upload", svgContent);
        router.push("/tool");
      };
      reader.onerror = () => {
        setError(t.upload.invalidFile);
      };
      reader.readAsText(file);
    },
    [router, t],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleBrowseClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex w-full max-w-[480px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border transition-colors",
          "h-[220px]",
          isDragging && "border-primary bg-primary/5",
        )}
      >
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="text-[15px] font-medium">{t.upload.dropTitle}</p>
        <span className="text-[13px] text-muted-foreground">
          {t.upload.dropOr}
        </span>
        <button
          type="button"
          onClick={handleBrowseClick}
          className="h-9 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t.upload.browseFiles}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".svg"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{t.upload.hint}</p>
      )}
    </div>
  );
}
