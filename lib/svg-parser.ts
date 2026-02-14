export interface SvgTransform {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export interface SvgLayer {
  id: string;
  tagName: string;
  fill: string;
  stroke: string;
  strokeWidth: string;
  opacity: string;
  name: string;
  transform: SvgTransform;
}

const SHAPE_TAGS = ["path", "rect", "circle", "ellipse", "polygon", "line"];

function parseTransform(el: Element): SvgTransform {
  const attr = el.getAttribute("transform") || "";
  let x = 0,
    y = 0,
    rotation = 0,
    scaleX = 1,
    scaleY = 1;

  const translateMatch = attr.match(/translate\(([^,)]+),?\s*([^)]*)\)/);
  if (translateMatch) {
    x = parseFloat(translateMatch[1]) || 0;
    y = parseFloat(translateMatch[2]) || 0;
  }

  const rotateMatch = attr.match(/rotate\(([^)]+)\)/);
  if (rotateMatch) {
    rotation = parseFloat(rotateMatch[1]) || 0;
  }

  const scaleMatch = attr.match(/scale\(([^,)]+),?\s*([^)]*)\)/);
  if (scaleMatch) {
    scaleX = parseFloat(scaleMatch[1]) || 1;
    scaleY = parseFloat(scaleMatch[2] || scaleMatch[1]) || 1;
  }

  return { x, y, rotation, scaleX, scaleY };
}

function buildTransformString(t: SvgTransform): string {
  const parts: string[] = [];
  if (t.x !== 0 || t.y !== 0) parts.push(`translate(${t.x}, ${t.y})`);
  if (t.rotation !== 0) parts.push(`rotate(${t.rotation})`);
  if (t.scaleX !== 1 || t.scaleY !== 1) parts.push(`scale(${t.scaleX}, ${t.scaleY})`);
  return parts.join(" ");
}

/**
 * Parse an SVG string and extract all shape elements as layers.
 */
export function parseSvg(svgString: string): {
  svg: string;
  layers: SvgLayer[];
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgEl = doc.querySelector("svg");

  if (!svgEl) {
    return { svg: svgString, layers: [] };
  }

  const layers: SvgLayer[] = [];
  const counters: Record<string, number> = {};

  const elements = svgEl.querySelectorAll(SHAPE_TAGS.join(","));

  elements.forEach((el) => {
    const tagName = el.tagName.toLowerCase();

    if (!el.id) {
      counters[tagName] = (counters[tagName] || 0) + 1;
      el.id = `${tagName}-${counters[tagName]}`;
    }

    const fill = getComputedFill(el);
    const stroke = el.getAttribute("stroke") || "none";
    const strokeWidth = el.getAttribute("stroke-width") || "1";
    const opacity = el.getAttribute("opacity") || "1";
    const transform = parseTransform(el);

    layers.push({
      id: el.id,
      tagName,
      fill,
      stroke,
      strokeWidth,
      opacity,
      name: el.id,
      transform,
    });
  });

  const serializer = new XMLSerializer();
  const updatedSvg = serializer.serializeToString(svgEl);

  return { svg: updatedSvg, layers };
}

function getComputedFill(el: Element): string {
  const fillAttr = el.getAttribute("fill");
  if (fillAttr) return fillAttr;

  const style = el.getAttribute("style");
  if (style) {
    const match = style.match(/fill\s*:\s*([^;]+)/);
    if (match) return match[1].trim();
  }

  return "#000000";
}

export function getElementFill(svgString: string, elementId: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const el = doc.getElementById(elementId);
  if (!el) return "#000000";
  return getComputedFill(el);
}

/**
 * Update a specific attribute on a shape element within an SVG string.
 */
export function updateSvgElement(
  svgString: string,
  elementId: string,
  attribute: string,
  value: string
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const el = doc.getElementById(elementId);

  if (!el) return svgString;

  if (attribute === "fill" || attribute === "stroke") {
    const style = el.getAttribute("style");
    if (style) {
      const cleaned = style
        .replace(new RegExp(`${attribute}\\s*:[^;]+;?`), "")
        .trim();
      if (cleaned) {
        el.setAttribute("style", cleaned);
      } else {
        el.removeAttribute("style");
      }
    }
  }

  el.setAttribute(attribute, value);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc.documentElement);
}

/**
 * Update the transform of a shape element.
 */
export function updateSvgTransform(
  svgString: string,
  elementId: string,
  transform: SvgTransform
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const el = doc.getElementById(elementId);

  if (!el) return svgString;

  const str = buildTransformString(transform);
  if (str) {
    el.setAttribute("transform", str);
  } else {
    el.removeAttribute("transform");
  }

  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc.documentElement);
}

/**
 * Apply random colors to all shape elements.
 * If a palette is provided, colors are picked from it; otherwise uses HSL random generation.
 */
export function randomizeColors(svgString: string, palette?: string[]): {
  svg: string;
  layers: SvgLayer[];
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgEl = doc.querySelector("svg");

  if (!svgEl) return { svg: svgString, layers: [] };

  const layers: SvgLayer[] = [];
  const elements = svgEl.querySelectorAll(SHAPE_TAGS.join(","));

  // Generate a harmonious palette based on a random hue
  const baseHue = Math.random() * 360;

  // Shuffle palette if provided for variety
  const shuffled = palette ? [...palette].sort(() => Math.random() - 0.5) : null;

  elements.forEach((el, i) => {
    const color = shuffled
      ? shuffled[i % shuffled.length]
      : hslToHex((baseHue + i * 37) % 360, 60 + Math.random() * 30, 45 + Math.random() * 30);

    // Remove fill from inline style
    const style = el.getAttribute("style");
    if (style) {
      const cleaned = style.replace(/fill\s*:[^;]+;?/, "").trim();
      if (cleaned) el.setAttribute("style", cleaned);
      else el.removeAttribute("style");
    }

    el.setAttribute("fill", color);

    const tagName = el.tagName.toLowerCase();
    const stroke = el.getAttribute("stroke") || "none";
    const strokeWidth = el.getAttribute("stroke-width") || "1";
    const opacity = el.getAttribute("opacity") || "1";
    const transform = parseTransform(el);

    layers.push({
      id: el.id,
      tagName,
      fill: color,
      stroke,
      strokeWidth,
      opacity,
      name: el.id,
      transform,
    });
  });

  const serializer = new XMLSerializer();
  return { svg: serializer.serializeToString(svgEl), layers };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
