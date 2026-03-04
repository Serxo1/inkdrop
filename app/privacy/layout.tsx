import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Inkdrop protects your privacy. Your SVG files never leave your browser. We explain our use of cookies, analytics, and advertisements.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
