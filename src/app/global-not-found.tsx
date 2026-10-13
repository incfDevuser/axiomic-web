import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { fontVars } from "@/lib/fonts";
import { siteUrl } from "@/lib/i18n";

export const metadata: Metadata = { metadataBase: new URL(siteUrl), title: "404 · Axiomic" };

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${fontVars} antialiased`}>
      <body className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-white"><LogoMark className="h-12 w-12" /></span>
        <p className="font-semibold mt-8 text-[15px] text-accent">404</p>
        <h1 className="mt-3 text-[40px] leading-[1.05] font-semibold tracking-[-0.028em]">Esta página no existe.</h1>
        <p className="mt-2 text-[20px] text-muted">This page doesn&apos;t exist.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/" className="rounded-full bg-accent px-5 py-2.5 text-[17px] font-medium text-on-accent">
            Ir al inicio
          </Link>
          <Link href="/en" className="rounded-full border border-edge px-5 py-2.5 text-[17px] text-fg">
            Go home
          </Link>
        </div>
      </body>
    </html>
  );
}
