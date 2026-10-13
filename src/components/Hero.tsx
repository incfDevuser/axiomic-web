"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { REAL_CASE_ID } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { AgentCard } from "./AgentCard";
import { CardZoom } from "./CardZoom";
import { useCase } from "./CaseContext";
import { Rosette } from "./Rosette";

const copy = {
  es: {
    badge: "Infraestructura financiera para agentes de IA",
    title: (
      <>
        Probamos tu agente de IA <br className="hidden sm:block" />
        <span className="title-accent">antes de que maneje dinero real.</span>
      </>
    ),
    lead: "Lo ponemos a prueba con dinero simulado y te decimos, en pesos, cuánto podría perder y qué reglas lo evitan.",
    cta: "Agenda un piloto",
    how: "Cómo funciona",
    story: "Cada tarjeta es un sandbox · tócala para ver qué pone a prueba",
    open: "ver el informe",
  },
  en: {
    badge: "Financial infrastructure for AI agents",
    title: (
      <>
        We test your AI agent <br className="hidden sm:block" />
        <span className="title-accent">before it handles real money.</span>
      </>
    ),
    lead: "We test it with simulated money and tell you, in pesos, how much it could lose and which rules prevent it.",
    cta: "Book a pilot",
    how: "How it works",
    story: "Each card is a sandbox · tap it to see what it tests",
    open: "read the report",
  },
} satisfies Record<Lang, unknown>;

const rise = (delay: string) => ({ animationDelay: delay }) as React.CSSProperties;
const riseClass = "animate-[rise_0.9s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none";

const FAN_DEG = 8;
function useSpread() {
  const [spread, setSpread] = useState(64);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setSpread(w < 640 ? 34 : w < 1024 ? 54 : w < 1280 ? 66 : 76);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return spread;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const spread = useSpread();
  const { choose, disciplines, lang } = useCase();
  const t = copy[lang];
  const [active, setActive] = useState(() => Math.max(0, disciplines.findIndex((d) => d.id === REAL_CASE_ID)));
  const [hovering, setHovering] = useState(false);
  const [flipped, setFlipped] = useState<number | null>(null);

  useEffect(() => {
    if (hovering || flipped !== null || reduce) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % disciplines.length), 3200);
    return () => clearInterval(timer);
  }, [hovering, flipped, reduce, disciplines.length]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fanY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const fanScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const fanOpacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  const tap = (i: number) => {
    setActive(i);
    setFlipped(i);
  };

  const closeZoom = useCallback(() => setFlipped(null), []);

  const openFlow = (i: number) => {
    choose(disciplines[i].id);
    setFlipped(null);
    scrollTo("como-funciona");
  };

  const btn = "rounded-full px-6 py-3 text-[17px] font-medium transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.97]";

  return (
    <section ref={ref} className="relative overflow-hidden pb-24">
      <div className="relative pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="pointer-events-none absolute top-[62%] left-1/2 h-[1100px] w-[1100px] -translate-x-1/2 -translate-y-1/2 text-accent/[0.13]">
          <Rosette className="h-full w-full animate-[orbit-spin_240s_linear_infinite] motion-reduce:animate-none" />
        </div>
        <div className="pointer-events-none absolute top-[66%] left-1/2 h-[380px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.12] blur-[110px]" />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        <h1
          style={rise("0.08s")}
          className={`${riseClass} mt-7 text-[44px] leading-[1.02] font-semibold tracking-[-0.05em] text-balance text-fg sm:text-[56px] lg:text-[66px] xl:text-[72px]`}
        >
          {t.title}
        </h1>
        <p style={rise("0.16s")} className={`${riseClass} mt-6 max-w-xl text-[19px] leading-[1.5] text-muted text-pretty sm:text-[20px]`}>
          {t.lead}
        </p>
        <div style={rise("0.24s")} className={`${riseClass} mt-8 flex flex-wrap items-center justify-center gap-3`}>
          <a href="#contacto" className={`${btn} bg-accent text-on-accent shadow-[0_10px_30px_-10px_rgba(37,99,255,0.36)] hover:bg-accent-hi`}>
            {t.cta}
          </a>
          <button type="button" onClick={() => scrollTo("como-funciona")} className={`${btn} border border-edge bg-panel text-fg hover:border-faint`}>
            {t.how}
          </button>
        </div>
      </motion.div>

      <motion.div style={{ y: fanY, scale: fanScale, opacity: fanOpacity }} className="relative mt-16 sm:mt-24">
        <div className="relative mx-auto h-[272px] sm:h-[332px] lg:h-[392px] xl:h-[440px]" onMouseLeave={() => setHovering(false)}>
          {disciplines.map((d, i) => {
            const offset = i - 2;
            const isActive = i === active;
            return (
              <motion.div
                key={d.id}
                initial={reduce ? false : { x: 0, y: 140, rotate: 0, opacity: 0 }}
                animate={{ x: offset * spread, y: Math.abs(offset) * 6, rotate: offset * FAN_DEG, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 20, delay: reduce ? 0 : 0.35 + i * 0.07 }}
                style={{ zIndex: isActive ? 20 : 10 + i, transformOrigin: "50% 150%" }}
                className="absolute top-6 left-1/2 -ml-[65px] w-[130px] sm:-ml-[85px] sm:w-[170px] lg:-ml-[105px] lg:w-[210px] xl:-ml-[120px] xl:w-[240px]"
              >
                <motion.button
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={`${d.name}: ${t.open}`}
                  onMouseEnter={() => {
                    setHovering(true);
                    setActive(i);
                  }}
                  onFocus={() => setActive(i)}
                  onClick={() => tap(i)}
                  animate={{ y: isActive ? -34 : 0, scale: isActive ? 1.04 : 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  className="block w-full cursor-pointer origin-bottom rounded-[14px] outline-none focus-visible:ring-4 focus-visible:ring-accent"
                >
                  <AgentCard discipline={d} interactive lang={lang} sandbox />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      </div>

        <button
          type="button"
          onClick={() => scrollTo("problema")}
          className="font-semibold group relative mx-auto mt-10 flex max-w-[340px] flex-col items-center gap-2 px-6 text-center text-[14px] text-balance text-muted transition-colors hover:text-fg sm:mt-14 sm:max-w-none"
        >
          {t.story}
          <span className="flex h-9 w-6 items-start justify-center rounded-full border border-edge pt-1.5">
            <span className="scroll-dot h-1.5 w-1 rounded-full bg-accent" />
          </span>
        </button>

      <CardZoom
        discipline={flipped === null ? null : disciplines[flipped]}
        onClose={closeZoom}
        onOpenFlow={() => flipped !== null && openFlow(flipped)}
        lang={lang}
      />
    </section>
  );
}
