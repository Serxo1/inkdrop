export type ExportFormat = "svg" | "png" | "jpeg" | "webp";

interface ExportOptions {
  svgContent: string;
  fileName: string;
  format: ExportFormat;
  /** Scale multiplier for raster exports (default: 2 for retina) */
  scale?: number;
}

/**
 * Renders the SVG onto a canvas and exports as a raster image blob.
 */
function svgToRasterBlob(
  svgContent: string,
  format: "png" | "jpeg" | "webp",
  scale: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    const svgEl = doc.documentElement;

    // Determine intrinsic size from viewBox or width/height attributes
    let width = 0;
    let height = 0;

    const viewBox = svgEl.getAttribute("viewBox");
    if (viewBox) {
      const parts = viewBox.split(/[\s,]+/).map(Number);
      if (parts.length === 4) {
        width = parts[2];
        height = parts[3];
      }
    }

    if (!width || !height) {
      const w = svgEl.getAttribute("width");
      const h = svgEl.getAttribute("height");
      width = w ? parseFloat(w) || 512 : 512;
      height = h ? parseFloat(h) || 512 : 512;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }

    // For JPEG, fill white background (JPEG has no transparency)
    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const img = new Image();
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const mimeType =
        format === "png"
          ? "image/png"
          : format === "jpeg"
            ? "image/jpeg"
            : "image/webp";

      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Canvas toBlob returned null"));
          }
        },
        mimeType,
        format === "jpeg" ? 0.92 : undefined
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load SVG as image"));
    };

    img.src = url;
  });
}

/**
 * Downloads the SVG content in the given format.
 */
export async function exportSvg({ svgContent, fileName, format, scale = 2 }: ExportOptions) {
  const baseName = fileName.replace(/\.[^.]+$/, "");

  if (format === "svg") {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    downloadBlob(blob, `${baseName}.svg`);
    return;
  }

  const blob = await svgToRasterBlob(svgContent, format, scale);
  downloadBlob(blob, `${baseName}.${format}`);
}

/**
 * Copies the raw SVG code to the clipboard.
 */
export async function copySvgCode(svgContent: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(svgContent);
    return true;
  } catch {
    return false;
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
