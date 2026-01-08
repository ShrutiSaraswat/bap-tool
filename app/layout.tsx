// app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Academic Pathways",
  description:
    "Explore CNC Business Administration programs, jobs and earning potential.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900" id="top">
        <main className="min-h-[calc(100vh-120px)]">{children}</main>
      </body>
    </html>
  );
}
