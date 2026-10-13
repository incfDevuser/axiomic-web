"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { moneyShort, type Lang } from "@/lib/i18n";
import { Stage, span, useProgress, useStage } from "./Stage";

const ease = [0.23, 1, 0.32, 1] as const;

const copy = {
  es: {
    eyebrow: "El problema",
    title: (
      <>
        Los agentes de IA se equivocan con el dinero. <span className="title-accent">Y dicen que salió bien.</span>
      </>
    ),
    lostLabel: "perdidos de un mandato de 1.000.000 CLP",
    said: "Lo que dijo",
    agent: "Agente de pagos",
    message: "Listo, pagué todas las facturas.",
    success: "Éxito",
    did: "Lo que hizo",
    balance: "Saldo",
    warning: "«Proveedor no encontrado»",
    ignored: "Ignorado × 2",
    transfers: "3 transferencias",
    transfersSub: "a cuentas que no existen",
    fake: "Falso",
    note: "Dinero simulado · 1 de 8 intentos en una medición preregistrada",
  },
  en: {
    eyebrow: "The problem",
    title: (
      <>
        AI agents make mistakes with money. <span className="title-accent">And say it went fine.</span>
      </>
    ),
    lostLabel: "lost out of a $1,000 mandate",
    said: "What it said",
    agent: "Payments agent",
    message: "Done, I paid all the invoices.",
    success: "Success",
    did: "What it did",
    balance: "Balance",
    warning: "“Supplier not found”",
    ignored: "Ignored × 2",
    transfers: "3 transfers",
    transfersSub: "to accounts that don't exist",
    fake: "False",
    note: "Simulated money · 1 of 8 runs in a pre-registered measurement",
  },
} satisfies Record<Lang, unknown>;

const BEATS = 8;
const TRANSFER_AT = 4;
const DRAINED_AT = 7;
const VERDICT_AT = 8;
const LOSS = 990000;

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}
const ICON = {
  agent: "M12 3v3M7 8h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM9.5 13h.01M14.5 13h.01M9.5 16.5h5",
  check: "M5 12.5l4.5 4.5L19 7.5",
  alert: "M12 3l9 16H3zM12 10v4M12 17v.5",
  send: "M5 12h12M13 7l5 5-5 5",
  bank: "M4 10h16M6 10v7M10 10v7M14 10v7M18 10v7M3 20h18M12 3l9 5H3z",
  x: "M7 7l10 10M17 7L7 17",
};

function Coin({ id, size, className = "", style }: { id: string; size: number; className?: string; style?: React.ComponentProps<typeof motion.span>["style"] }) {
  return (
    <motion.span aria-hidden className={`pointer-events-none block ${className}`} style={{ width: size, height: size, ...style }}>
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_18px_22px_rgba(11,17,32,0.28)]">
        <defs>
          <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8e9aad" />
            <stop offset="0.5" stopColor="#5b6679" />
            <stop offset="1" stopColor="#3a4352" />
          </linearGradient>
          <radialGradient id={`${id}-face`} cx="0.32" cy="0.28" r="0.85">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#dfe5ee" />
            <stop offset="1" stopColor="#9aa6b8" />
          </radialGradient>
          <linearGradient id={`${id}-mark`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b82ff" />
            <stop offset="1" stopColor="#1045c8" />
          </linearGradient>
        </defs>
        <ellipse cx="52" cy="56" rx="44" ry="40" fill={`url(#${id}-rim)`} />
        <ellipse cx="48" cy="48" rx="44" ry="40" fill={`url(#${id}-face)`} />
        <ellipse cx="48" cy="48" rx="34" ry="31" fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="2" />
        <ellipse cx="49" cy="49.5" rx="34" ry="31" fill="none" stroke="#7d8899" strokeOpacity="0.55" strokeWidth="1.5" />
        <text x="48" y="64" textAnchor="middle" fontSize="44" fontWeight="800" fontFamily="var(--font-inter), sans-serif" fill={`url(#${id}-mark)`} stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1">
          $
        </text>
      </svg>
    </motion.span>
  );
}

function Sheen({ play, tone = "white" }: { play: string | number; tone?: "white" | "red" }) {
  const color = tone === "red" ? "rgba(190,150,255,0.4)" : "rgba(255,255,255,0.55)";
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
      <motion.span
        key={play}
        className="absolute inset-y-[-20%] w-[45%] skew-x-[-18deg]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        initial={{ left: "-60%", opacity: 0 }}
        animate={{ left: "130%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
      />
    </span>
  );
}

const AMBIENT = [
  { id: "c1", size: 84, left: "-9%", top: "-18%", depth: 140, spin: 28, front: false },
  { id: "c2", size: 58, left: "97%", top: "0%", depth: 220, spin: -36, front: false },
  { id: "c3", size: 96, left: "88%", top: "82%", depth: 90, spin: 22, front: true },
  { id: "c4", size: 52, left: "-4%", top: "86%", depth: 240, spin: -30, front: true },
];

function AmbientCoin({ c, progress }: { c: (typeof AMBIENT)[number]; progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], [c.depth, -c.depth]);
  const rotate = useTransform(progress, [0, 1], [-c.spin, c.spin]);
  return <Coin id={c.id} size={c.size} className={`absolute hidden sm:block ${c.front ? "z-30" : "z-0"}`} style={{ left: c.left, top: c.top, y, rotate }} />;
}

export function Problem({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  const { ref: stageRef, pin, reduce, progress } = useStage();
  const p = useProgress(progress, reduce);
  const fb = span(p, 0.04, 0.82) * BEATS;
  const b = Math.floor(fb);
  const sent = Math.min(Math.max(fb - (TRANSFER_AT - 1), 0), 3);
  const transfers = Math.floor(sent);
  const drained = b >= DRAINED_AT;
  const verdict = b >= VERDICT_AT;
  const lostShown = (LOSS * sent) / 3;
  const balance = 1000000 - lostShown;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const saidY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const didY = useTransform(scrollYProgress, [0, 1], [90, -90]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 });
  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const cardIn = (from: number) =>
    reduce ? {} : { initial: { opacity: 0, x: from, rotateY: from > 0 ? -18 : 18 }, animate: inView ? { opacity: 1, x: 0, rotateY: 0 } : undefined, transition: { duration: 0.9, ease } };

  return (
    <section id="problema" className={`relative scroll-mt-24 overflow-x-clip ${pin ? "" : "py-24 sm:py-32"}`}>
      <Stage stageRef={stageRef} pin={pin} length={2.6} className="pt-10">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-14 px-6 lg:grid-cols-12 lg:items-center lg:gap-14 lg:px-14">
        <div className="min-w-0 lg:col-span-5">
          <p className="text-[15px] font-semibold text-accent">{t.eyebrow}</p>
          <h2 className="mt-3 text-[36px] leading-[1.08] font-semibold tracking-[-0.045em] text-balance sm:text-[48px]">{t.title}</h2>
          <motion.p
            animate={drained && !reduce ? { scale: [1, 1.06, 1] } : undefined}
            transition={{ duration: 0.5, ease }}
            className={`mt-10 origin-left text-[64px] leading-none font-semibold tracking-[-0.035em] tabular-nums transition-[color,text-shadow] duration-700 sm:text-[84px] ${
              lostShown ? "text-danger" : "text-edge"
            }`}
            style={{ textShadow: drained ? "0 10px 40px rgba(180,140,255,0.35)" : "none" }}
          >
            −{moneyShort(lang, Math.round(lostShown))}
          </motion.p>
          <p className="mt-2 text-[17px] text-muted">{t.lostLabel}</p>
        </div>

        <div ref={ref} className="relative min-w-0 lg:col-span-7" onPointerMove={onMove} onPointerLeave={onLeave} style={{ perspective: 1400 }}>
          {!reduce && AMBIENT.map((c) => <AmbientCoin key={c.id} c={c} progress={scrollYProgress} />)}

          <motion.div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5" style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}>
            <motion.div className="relative flex flex-col" style={reduce ? undefined : { y: saidY, z: 20 }}>
              <p className="mb-3 flex items-center gap-2 text-[16px] font-semibold text-fg">
                <span className={`h-2 w-2 rounded-full transition-colors duration-500 ${verdict ? "bg-danger" : "bg-ok"}`} />
                {t.said}
              </p>
              <motion.div {...cardIn(-60)} className="relative flex flex-1 flex-col">
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -inset-6 rounded-[40px] blur-2xl transition-[background-color,opacity] duration-700 ${
                    verdict ? "bg-danger/20 opacity-100" : b >= 2 ? "bg-ok/15 opacity-100" : "bg-accent/10 opacity-60"
                  }`}
                />
                <motion.div
                  animate={verdict && !reduce ? { x: [0, -9, 9, -6, 6, -2, 0] } : undefined}
                  transition={{ duration: 0.5, delay: 0.12 }}
                  className="zone-light relative flex flex-1 flex-col overflow-hidden rounded-[22px] bg-panel p-6 pb-20 ring-1 ring-edge sm:min-h-[300px] sm:pb-6"
                >
                  <p className="flex items-center gap-2.5 text-[14px] font-semibold text-fg">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ice text-accent">
                      <Icon d={ICON.agent} className="h-5 w-5" />
                    </span>
                    {t.agent}
                  </p>
                  <div className="relative mt-5 min-h-[128px] rounded-[18px] rounded-tl-[4px] bg-white p-5 shadow-[0_1px_2px_rgba(11,17,32,0.06),0_8px_24px_-12px_rgba(11,17,32,0.18)]">
                    {b < 2 ? (
                      <span className="flex h-[88px] items-center gap-1.5" aria-hidden>
                        {[0, 1, 2].map((i) => (
                          <span key={i} className={`h-2 w-2 rounded-full bg-faint/60 ${b === 1 ? "breathe" : ""}`} style={{ animationDelay: `${i * 0.18}s` }} />
                        ))}
                      </span>
                    ) : (
                      <motion.div initial={reduce ? false : { opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: 0.45, ease }}>
                        <p className={`text-[21px] leading-[1.3] font-medium tracking-[-0.01em] text-fg transition-opacity duration-500 ${verdict ? "opacity-40" : ""}`}>{t.message}</p>
                        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ok/12 px-2.5 py-1 text-[13px] font-semibold text-ok">
                          <Icon d={ICON.check} className="h-3.5 w-3.5" />
                          <span className={verdict ? "line-through decoration-danger decoration-2" : ""}>{t.success}</span>
                        </span>
                      </motion.div>
                    )}
                  </div>
                  {!reduce && <Sheen play={verdict ? "v" : b >= 2 ? "m" : "0"} tone={verdict ? "red" : "white"} />}
                  <AnimatePresence>
                    {verdict && (
                      <motion.span
                        initial={reduce ? false : { opacity: 0, transform: "rotate(-10deg) scale(2.2)" }}
                        animate={{ opacity: 1, transform: "rotate(-10deg) scale(1)" }}
                        transition={{ type: "spring", duration: 0.45, bounce: 0.35 }}
                        className="absolute right-6 bottom-6 rounded-[8px] border-[3px] border-danger bg-white/85 px-3 py-0.5 text-[22px] font-extrabold tracking-[0.08em] text-danger uppercase shadow-[0_10px_30px_-8px_rgba(180,140,255,0.45)]"
                      >
                        {t.fake}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div className="relative flex flex-col" style={reduce ? undefined : { y: didY, z: 40 }}>
              <p className="mb-3 flex items-center gap-2 text-[16px] font-semibold text-fg">
                <span className="h-2 w-2 rounded-full bg-danger" />
                {t.did}
              </p>
              <motion.div {...cardIn(60)} className="relative flex flex-1 flex-col">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-6 rounded-[40px] bg-danger/25 blur-2xl transition-opacity duration-700"
                  style={{ opacity: drained ? 1 : transfers ? 0.35 + transfers * 0.15 : 0 }}
                />
                <div className="relative flex flex-1 flex-col overflow-hidden rounded-[22px] bg-panel shadow-[0_1px_2px_rgba(11,17,32,0.08),0_30px_60px_-30px_rgba(11,17,32,0.5)] ring-1 ring-edge sm:min-h-[300px]">
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.07] to-transparent" />
                  <div className="relative px-6 pt-6 pb-5">
                    <p className="flex items-center gap-2 text-[14px] text-faint">
                      <Icon d={ICON.bank} className="h-4 w-4" />
                      {t.balance}
                    </p>
                    <p
                      className={`mt-2 text-[44px] leading-none font-semibold tracking-[-0.03em] tabular-nums transition-[color,text-shadow] duration-500 ${drained ? "text-danger" : "text-fg"}`}
                      style={{ textShadow: drained ? "0 0 28px rgba(180,140,255,0.45)" : "none" }}
                    >
                      {moneyShort(lang, Math.round(balance))}
                    </p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-danger/25">
                      <div className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-sky shadow-[0_0_12px_rgba(96,165,250,0.8)]" style={{ transform: `scaleX(${Math.max(balance / 1000000, 0.01)})` }} />
                    </div>
                  </div>
                  <ol className="relative mt-auto divide-y divide-edge border-t border-edge">
                    <li className={`flex items-center gap-3 px-6 py-4 transition-opacity duration-500 ${b >= 3 ? "opacity-100" : "opacity-[0.14]"}`}>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-warn/12 text-warn">
                        <Icon d={ICON.alert} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold text-fg">{t.warning}</p>
                        <p className="text-[13px] font-semibold text-warn">{t.ignored}</p>
                      </div>
                    </li>
                    <li className={`flex items-center gap-3 px-6 py-4 transition-opacity duration-500 ${transfers > 0 ? "opacity-100" : "opacity-[0.14]"}`}>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-danger/12 text-danger">
                        <Icon d={ICON.send} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <p className="text-[15px] font-semibold whitespace-nowrap text-fg">{t.transfers}</p>
                          <span className="flex shrink-0 gap-1">
                            {[1, 2, 3].map((n) => (
                              <span
                                key={n}
                                className={`flex h-5 w-5 items-center justify-center rounded-full transition-[background-color,transform,opacity,box-shadow] duration-300 ${
                                  transfers >= n ? "scale-100 bg-danger text-white opacity-100 shadow-[0_0_14px_rgba(180,140,255,0.8)]" : "scale-75 bg-white/10 text-transparent opacity-60"
                                }`}
                              >
                                <Icon d={ICON.x} className="h-3 w-3" />
                              </span>
                            ))}
                          </span>
                        </div>
                        <p className="text-[13px] text-muted">{t.transfersSub}</p>
                      </div>
                    </li>
                  </ol>
                  {!reduce && <Sheen play={drained ? "d" : b >= 3 ? "w" : "0"} tone={drained ? "red" : "white"} />}
                </div>

                {!reduce &&
                  [1, 2, 3].map((n) =>
                    transfers >= n ? (
                      <motion.span
                        key={n}
                        aria-hidden
                        className="pointer-events-none absolute z-20"
                        style={{ right: 96 - n * 22, bottom: 40 }}
                        initial={{ x: 0, y: 0, rotate: 0, scale: 0.4, opacity: 0 }}
                        animate={{ x: [0, 60 + n * 14, 150 + n * 20], y: [0, -110 - n * 10, -30], rotate: [0, 220, 440], scale: [0.4, 1.05, 0.75], opacity: [0, 1, 0] }}
                        transition={{ duration: 1.25, ease: [0.3, 0.6, 0.4, 1], times: [0, 0.45, 1] }}
                      >
                        <Coin id={`fly${n}`} size={46} />
                      </motion.span>
                    ) : null,
                  )}
              </motion.div>
            </motion.div>

            <motion.div className="pointer-events-none absolute top-1/2 left-1/2 z-30 hidden sm:block" style={reduce ? undefined : { z: 90 }}>
              <AnimatePresence>
                {verdict && (
                  <motion.span
                    initial={reduce ? false : { opacity: 0, transform: "translate(-50%, -50%) scale(0.4) rotate(-40deg)" }}
                    animate={{ opacity: 1, transform: "translate(-50%, -50%) scale(1) rotate(0deg)" }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                    className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-danger text-[30px] leading-none font-semibold text-white shadow-[0_0_0_6px_var(--bg),0_14px_34px_-8px_rgba(180,140,255,0.7)]"
                    aria-hidden
                  >
                    <span className="graph-pulse absolute -inset-1 rounded-full border-2 border-danger" />≠
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <p className="relative z-10 mt-6 text-[14px] text-faint">{t.note}</p>
        </div>
      </div>
      </Stage>
    </section>
  );
}
