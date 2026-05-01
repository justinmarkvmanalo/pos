import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life OS",
  description: "A personal command center for focus, goals, habits, capture, and weekly reviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
