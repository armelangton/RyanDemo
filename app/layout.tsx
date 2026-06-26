import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fire Protection Field Assistant",
  description:
    "Ryan Fire Protection-style internal employee preparation workspace for public recall lookup and AI-assisted engagement readiness packets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
