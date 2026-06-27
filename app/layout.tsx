import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Engagement Assistant",
  description:
    "Ryan Fire Protection-style internal employee preparation workspace for AI-generated inspection, training, and service visit guidance.",
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
