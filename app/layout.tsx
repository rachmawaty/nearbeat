import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/nearbeat/ThemeProvider";

export const metadata: Metadata = {
  title: "Nearbeat — Your city pulse",
  description: "AI-powered city wallet that knows where you're going and what you do on Tuesdays.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
