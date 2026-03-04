import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Inkdrop is a free, open-source SVG editor that runs entirely in your browser. Built by Polyaxis, a software studio based in Brazil.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
