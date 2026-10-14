"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { homeAnchor, otherLang, type Lang } from "@/lib/i18n";
import { LogoMark } from "./LogoMark";

const copy = {
  es: {
    links: [
      { id: "problema", label: "El problema" },
      { id: "como-funciona", label: "Así funciona" },
      { id: "informe", label: "Informe" },
      { id: "piloto", label: "Precio" },
    ],
    cta: "Agenda un piloto",
    menu: "Menú",
    close: "Cerrar",
    switchLabel: "Read in English",
  },
  en: {
    links: [
      { id: "problema", label: "The problem" },
      { id: "como-funciona", label: "How it works" },
      { id: "informe", label: "Report" },
      { id: "piloto", label: "Pricing" },
    ],
    cta: "Book a pilot",
    menu: "Menu",
    close: "Close",
    switchLabel: "Leer en español",
  },
} satisfies Record<Lang, unknown>;

const ease = [0.23, 1, 0.32, 1] as const;

function useActive(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line && el.getBoundingClientRect().bottom > line) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);
  return active;
}

function useScrolled(px = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > px);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [px]);
  return scrolled;
}

export function Nav({ lang, alt }: { lang: Lang; alt: string }) {
  const t = copy[lang];
  const reduce = useReducedMotion();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const [ids] = useState(() => t.links.map((l) => l.id));
  const active = useActive(ids);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const home = lang === "es" ? "/" : "/en";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const island = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-6">
      <nav
        className={`relative mx-auto flex h-[60px] items-center justify-between gap-3 rounded-[22px] border pr-2 pl-3 transition-[max-width,background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] sm:pl-4 ${
          island
            ? "max-w-[1080px] border-white/10 bg-[#0b1120]/[0.86] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_24px_60px_-24px_rgba(0,0,0,0.75)] backdrop-blur-2xl backdrop-saturate-150"
            : "max-w-[1400px] border-transparent bg-transparent shadow-none"
        }`}
      >
        <Link href={home} className="group flex items-center gap-2.5 text-[19px] font-semibold tracking-[-0.03em] text-white" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center drop-shadow-[0_0_12px_rgba(61,123,255,0.45)] transition-transform duration-300 ease-out group-hover:rotate-[-8deg] group-active:scale-95">
            <LogoMark onDark className="h-[30px] w-[30px]" />
          </span>
          axiomic
        </Link>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full p-1 lg:flex">
          {t.links.map((l) => {
            const on = active === l.id;
            return (
              <li key={l.id} className="relative">
                {on && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.09] ring-1 ring-white/15"
                    transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.45, bounce: 0.18 }}
                  />
                )}
                <Link
                  href={homeAnchor(lang, l.id)}
                  className={`relative block rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-200 ${on ? "text-white" : "text-white/60 hover:text-white"}`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full bg-white/[0.06] p-1 text-[13px] font-semibold ring-1 ring-white/10 sm:flex" role="group" aria-label={t.switchLabel}>
            {(["es", "en"] as const).map((l) =>
              l === lang ? (
                <span key={l} className="rounded-full bg-white px-2.5 py-1 text-[#0b1120]">
                  {l.toUpperCase()}
                </span>
              ) : (
                <Link key={l} href={alt} hrefLang={l} aria-label={t.switchLabel} className="rounded-full px-2.5 py-1 text-white/60 transition-colors hover:text-white">
                  {l.toUpperCase()}
                </Link>
              ),
            )}
          </div>

          <Link
            href={homeAnchor(lang, "contacto")}
            className="group relative flex items-center gap-1.5 overflow-hidden rounded-full bg-accent py-2.5 pr-3.5 pl-4 text-[15px] font-semibold whitespace-nowrap text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_-8px_rgba(61,123,255,0.8)] transition-[background-color,transform,box-shadow] duration-200 ease-out hover:bg-[#2f6dff] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_30px_-8px_rgba(61,123,255,1)] active:scale-[0.97]"
          >
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[420%] group-hover:opacity-100" />
            <span className="relative">{t.cta}</span>
            <svg viewBox="0 0 16 16" className="relative h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 8h9M8.5 4l4 4-4 4" />
            </svg>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? t.close : t.menu}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white ring-1 ring-white/10 transition-transform duration-150 active:scale-95 lg:hidden"
          >
            <span className="relative h-3 w-4">
              <span className={`absolute left-0 h-[2px] w-4 rounded-full bg-current transition-transform duration-300 ease-out ${open ? "top-[5px] rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-[2px] w-4 rounded-full bg-current transition-transform duration-300 ease-out ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
            </span>
          </button>
        </div>

        <motion.span
          aria-hidden
          className={`pointer-events-none absolute right-5 -bottom-px left-5 h-px origin-left bg-gradient-to-r from-accent via-sky to-accent transition-opacity duration-500 ${island ? "opacity-100" : "opacity-0"}`}
          style={{ scaleX: progress }}
        />
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease }}
            className="mx-auto mt-2 max-w-[1080px] origin-top rounded-[22px] border border-white/10 bg-[#0b1120]/85 p-3 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-2xl lg:hidden"
          >
            <ul>
              {t.links.map((l, i) => (
                <motion.li key={l.id} initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease, delay: 0.04 + i * 0.04 }}>
                  <Link
                    href={homeAnchor(lang, l.id)}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-[14px] px-4 py-3.5 text-[19px] font-semibold tracking-[-0.02em] transition-colors ${active === l.id ? "bg-white/[0.07] text-white" : "text-white/75 hover:bg-white/[0.04] hover:text-white"}`}
                  >
                    {l.label}
                    <span className="text-white/30">→</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-2 flex items-center justify-between border-t border-white/10 px-4 pt-3 pb-1">
              <span className="text-[14px] text-white/50">{t.switchLabel}</span>
              <Link href={alt} hrefLang={otherLang(lang)} onClick={() => setOpen(false)} className="rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-[#0b1120]">
                {otherLang(lang).toUpperCase()}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
