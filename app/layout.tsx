import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fire Protection Field Assistant",
  description:
    "Ryan Fire Protection-style internal field assistant concept for public recall lookup and AI-assisted engagement preparation.",
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
