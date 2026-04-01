import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "myClaude Links",
  description: "The marketplace for the Claude Code ecosystem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
