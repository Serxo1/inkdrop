import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Inkdrop — Edit SVGs like you mean it";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const svgBuffer = await readFile(
    join(process.cwd(), "public", "my-icon.svg")
  );
  const svgDataUri = `data:image/svg+xml;base64,${svgBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          gap: 32,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={svgDataUri}
          alt=""
          width={180}
          height={180}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            Inkdrop
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#a1a1aa",
              fontWeight: 400,
            }}
          >
            Edit SVGs like you mean it.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
