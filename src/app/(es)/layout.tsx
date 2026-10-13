import "../globals.css";
import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";
import { siteUrl } from "@/lib/i18n";

export { viewport } from "@/lib/metadata";

export const metadata: Metadata = { metadataBase: new URL(siteUrl) };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${fontVars} antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
