"use client";

import { MousePointer2, Paintbrush, PaintBucket } from "lucide-react";

function ToolbarIcon({
  icon: Icon,
  active,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  active?: boolean;
}) {
  return (
    <div
      className={`flex h-7 w-7 items-center justify-center rounded ${active ? "bg-muted" : ""}`}
    >
      <Icon
        className={`h-3.5 w-3.5 ${active ? "text-foreground" : "text-muted-foreground"}`}
      />
    </div>
  );
}

function LayerItem({
  name,
  color,
  active,
}: {
  name: string;
  color: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex h-7 items-center gap-2 rounded px-2 ${active ? "bg-primary/10" : ""}`}
    >
      <div
        className="h-2.5 w-2.5 rounded-sm"
        style={{
          backgroundColor: color !== "transparent" ? color : undefined,
          border:
            color === "transparent" ? "1.5px solid #E11D48" : undefined,
        }}
      />
      <span
        className={`text-[11px] ${active ? "font-medium text-foreground" : "text-muted-foreground"}`}
      >
        {name}
      </span>
    </div>
  );
}

export function AppPreview() {
  return (
    <section className="flex justify-center px-6 pb-16 md:px-20">
      <div className="w-full max-w-[1000px] overflow-hidden rounded-xl border border-border bg-muted/50">
        {/* Title bar */}
        <div className="flex h-11 items-center justify-between border-b border-border bg-background px-4">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
            <div className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            Inkdrop
          </span>
          <div className="w-[52px]" />
        </div>

        {/* Body */}
        <div className="flex h-[340px] md:h-[480px]">
          {/* Sidebar tools */}
          <div className="flex w-11 flex-col items-center gap-1.5 border-r border-border bg-background py-2.5">
            <ToolbarIcon icon={MousePointer2} active />
            <ToolbarIcon icon={Paintbrush} />
            <ToolbarIcon icon={PaintBucket} />
          </div>

          {/* Canvas */}
          <div className="relative flex-1 bg-muted/30">
            <div className="absolute left-[15%] top-[18%] h-[28%] w-[24%] rounded-2xl bg-primary" />
            <div className="absolute left-[42%] top-[14%] aspect-square w-[18%] rounded-full bg-foreground" />
            <div className="absolute left-[30%] top-[52%] h-[20%] w-[26%] rounded-lg border-2 border-primary bg-primary/5" />
            <div className="absolute left-[58%] top-[44%] aspect-square w-[16%] rounded-full border-2 border-dashed border-border bg-muted/50" />
            <div className="absolute left-[10%] top-[56%] h-[16%] w-[20%] rounded-full bg-primary/10" />
            <MousePointer2 className="absolute left-[38%] top-[32%] h-5 w-5 text-primary" />
          </div>

          {/* Right panel */}
          <div className="hidden w-[200px] flex-col gap-3 border-l border-border bg-background p-3.5 md:flex">
            <span className="text-[11px] font-semibold tracking-wide">
              Layers
            </span>
            <div className="flex flex-col gap-0.5">
              <LayerItem name="shape-1" color="#E11D48" active />
              <LayerItem name="circle-1" color="#09090B" />
              <LayerItem name="rect-outline" color="transparent" />
            </div>
            <div className="h-px bg-border" />
            <span className="text-[11px] font-semibold tracking-wide">
              Fill
            </span>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md border border-border bg-primary" />
              <div className="flex h-7 flex-1 items-center rounded border border-border px-2 text-[11px]">
                #E11D48
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
