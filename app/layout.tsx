import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nearbeat — Your city pulse",
  description: "AI-powered city wallet that knows where you're going and what you do on Tuesdays.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ backgroundColor: "var(--nb-bg)", color: "var(--nb-text)" }}>
        {children}
      </body>
    </html>
  );
}
