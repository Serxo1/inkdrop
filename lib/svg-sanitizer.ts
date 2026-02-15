const DANGEROUS_ELEMENTS = new Set([
  "script",
  "foreignobject",
  "iframe",
  "embed",
  "object",
]);

function sanitizeNode(node: Element): void {
  // Remove dangerous elements
  const children = Array.from(node.children);
  for (const child of children) {
    if (DANGEROUS_ELEMENTS.has(child.tagName.toLowerCase())) {
      child.remove();
      continue;
    }
    // Remove on* event handler attributes
    const attrs = Array.from(child.attributes);
    for (const attr of attrs) {
      if (attr.name.toLowerCase().startsWith("on")) {
        child.removeAttribute(attr.name);
      }
      // Remove javascript: URIs from href/xlink:href
      if (
        (attr.name.toLowerCase() === "href" ||
          attr.name.toLowerCase() === "xlink:href") &&
        attr.value.trim().toLowerCase().startsWith("javascript:")
      ) {
        child.removeAttribute(attr.name);
      }
    }
    // Recurse into children
    sanitizeNode(child);
  }
}

export function sanitizeSvg(svgString: string): string {
  if (!svgString) return svgString;

  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");

  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    // If the SVG can't be parsed, return empty string to avoid injection
    return "";
  }

  const svg = doc.documentElement;
  sanitizeNode(svg);

  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
}

export function sanitizeSvgForThumbnail(svgString: string): string {
  return sanitizeSvg(svgString);
}
