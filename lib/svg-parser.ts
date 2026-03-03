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

export interface LayerGroup {
  id: string;
  name: string;
  layerIds: string[];
  collapsed: boolean;
}

const SHAPE_TAGS = ["path", "rect", "circle", "ellipse", "polygon", "line"];

// ---------- Shared parse/serialize helpers ----------

function parseSvgDocument(svgString: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Invalid SVG");
  }
  return doc;
}

function serializeSvgDocument(doc: Document): string {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc.documentElement);
}

// ---------- Transform helpers ----------

/**
 * Collect all transform attributes from an element up to (but not including) the <svg> root.
 * Returns them in document order (outermost first) so they can be concatenated.
 */
export function getAncestorTransformChain(el: Element): string[] {
  const transforms: string[] = [];
  let current: Element | null = el;
  while (current && current.tagName.toLowerCase() !== "svg") {
    const t = current.getAttribute("transform");
    if (t) transforms.unshift(t);
    current = current.parentElement;
  }
  return transforms;
}

export function parseTransform(el: Element): SvgTransform {
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
  try {
    const doc = parseSvgDocument(svgString);
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

    const updatedSvg = serializeSvgDocument(doc);

    return { svg: updatedSvg, layers };
  } catch {
    return { svg: svgString, layers: [] };
  }
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
  try {
    const doc = parseSvgDocument(svgString);
    const el = doc.getElementById(elementId);
    if (!el) return "#000000";
    return getComputedFill(el);
  } catch {
    return "#000000";
  }
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
  try {
    const doc = parseSvgDocument(svgString);
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

    return serializeSvgDocument(doc);
  } catch {
    return svgString;
  }
}

/**
 * Update the transform of a shape element.
 */
export function updateSvgTransform(
  svgString: string,
  elementId: string,
  transform: SvgTransform
): string {
  try {
    const doc = parseSvgDocument(svgString);
    const el = doc.getElementById(elementId);

    if (!el) return svgString;

    const str = buildTransformString(transform);
    if (str) {
      el.setAttribute("transform", str);
    } else {
      el.removeAttribute("transform");
    }

    return serializeSvgDocument(doc);
  } catch {
    return svgString;
  }
}

/**
 * Delete a shape element from the SVG and return updated SVG + layers.
 */
export function deleteSvgElement(
  svgString: string,
  elementId: string
): { svg: string; layers: SvgLayer[] } {
  try {
    const doc = parseSvgDocument(svgString);
    const el = doc.getElementById(elementId);
    if (el) el.remove();

    const svg = serializeSvgDocument(doc);
    const { layers } = parseSvg(svg);
    return { svg, layers };
  } catch {
    return { svg: svgString, layers: [] };
  }
}

/**
 * Duplicate a shape element. The clone gets a new id and a small translate offset.
 */
export function duplicateSvgElement(
  svgString: string,
  elementId: string
): { svg: string; layers: SvgLayer[]; newId: string } {
  try {
    const doc = parseSvgDocument(svgString);
    const el = doc.getElementById(elementId);
    if (!el) return { svg: svgString, layers: [], newId: "" };

    const clone = el.cloneNode(true) as Element;
    const newId = `${elementId}-copy-${Date.now().toString(36)}`;
    clone.id = newId;

    // Offset the clone slightly
    const transform = parseTransform(clone);
    transform.x += 10;
    transform.y += 10;
    const str = buildTransformString(transform);
    if (str) {
      clone.setAttribute("transform", str);
    }

    el.parentNode?.insertBefore(clone, el.nextSibling);

    const svg = serializeSvgDocument(doc);
    const { layers } = parseSvg(svg);
    return { svg, layers, newId };
  } catch {
    return { svg: svgString, layers: [], newId: "" };
  }
}

/**
 * Update the `d` attribute of a path element.
 */
export function updateSvgPathD(
  svgString: string,
  elementId: string,
  newD: string
): string {
  try {
    const doc = parseSvgDocument(svgString);
    const el = doc.getElementById(elementId);

    if (!el || el.tagName.toLowerCase() !== "path") return svgString;

    el.setAttribute("d", newD);

    return serializeSvgDocument(doc);
  } catch {
    return svgString;
  }
}

/**
 * Apply random colors to all shape elements.
 * If a palette is provided, colors are picked from it; otherwise uses HSL random generation.
 */
export function randomizeColors(svgString: string, palette?: string[]): {
  svg: string;
  layers: SvgLayer[];
} {
  try {
    const doc = parseSvgDocument(svgString);
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

    return { svg: serializeSvgDocument(doc), layers };
  } catch {
    return { svg: svgString, layers: [] };
  }
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
