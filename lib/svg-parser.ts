export interface SvgLayer {
  id: string;
  tagName: string;
  fill: string;
  stroke: string;
  strokeWidth: string;
  name: string;
}

const SHAPE_TAGS = ["path", "rect", "circle", "ellipse", "polygon", "line"];

/**
 * Parse an SVG string and extract all shape elements as layers.
 * Assigns auto-generated IDs to elements that lack them.
 * Returns the modified SVG string and the extracted layers.
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

    // Assign ID if missing
    if (!el.id) {
      counters[tagName] = (counters[tagName] || 0) + 1;
      el.id = `${tagName}-${counters[tagName]}`;
    }

    const fill = getComputedFill(el);
    const stroke = el.getAttribute("stroke") || "none";
    const strokeWidth = el.getAttribute("stroke-width") || "1";

    layers.push({
      id: el.id,
      tagName,
      fill,
      stroke,
      strokeWidth,
      name: el.id,
    });
  });

  // Serialize back to string
  const serializer = new XMLSerializer();
  const updatedSvg = serializer.serializeToString(svgEl);

  return { svg: updatedSvg, layers };
}

/**
 * Get the effective fill color of an SVG element.
 * Checks the element's fill attribute, then style attribute.
 */
function getComputedFill(el: Element): string {
  const fillAttr = el.getAttribute("fill");
  if (fillAttr) return fillAttr;

  const style = el.getAttribute("style");
  if (style) {
    const match = style.match(/fill\s*:\s*([^;]+)/);
    if (match) return match[1].trim();
  }

  // SVG default fill is black
  return "#000000";
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
    // Also remove from inline style if present
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
