"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { Lang } from "@/lib/i18n";
import { LogoMark } from "./LogoMark";
import { SpotlightGrid, useSpotlight } from "./Night";
import { Rosette } from "./Rosette";
import { Stage, useProgress, useStage } from "./Stage";

const ease = [0.23, 1, 0.32, 1] as const;

const copy = {
  es: {
    eyebrow: "Siguiente paso · piloto",
    title: (
      <>
        Tres semanas, un flujo tuyo, <span className="title-accent">precio fijo.</span>
      </>
    ),
    pass: "Pase de piloto",
    terms: [
      { k: "Duración", v: "3 semanas" },
      { k: "Alcance", v: "1 flujo" },
      { k: "Precio", v: "Desde 30 UF" },
    ],
    priceNote: "Precio fijo por alcance, acordado antes de empezar. No depende de cuántas fallas encontremos." as string | null,
    weeksTitle: "Cómo se trabaja",
    weeks: [
      { w: "Semana 1", t: "Conectamos tu agente" },
      { w: "Semana 2", t: "Medición, con un set reservado" },
      { w: "Semana 3", t: "Informe y re-evaluación" },
    ],
    chips: ["Tu agente tal como es", "Token por episodio", "Sin dinero real", "Sin credenciales de producción"],
    cta: "Agenda un piloto",
    stamp: {
      eyebrow: "Niveles de evidencia",
      level: "Nivel",
      title: (
        <>
          Cada evaluación deja un nivel de evidencia. <span className="title-accent">Describe esa versión, esos escenarios y esa fecha.</span>
        </>
      ),
      tiers: [
        {
          theme: "graphite",
          name: "Grafito",
          tag: "Evaluado",
          body: "Medimos su riesgo por millón y entregamos las reglas que evitarían sus pérdidas.",
          criteria: ["Pasó una medición preregistrada en su flujo real", "Conocemos su riesgo por millón, en pesos", "Recibió las reglas que evitarían sus pérdidas"],
        },
        {
          theme: "platinum",
          name: "Platino",
          tag: "Sin fallas críticas",
          body: "No perdió dinero simulado en el set reservado de escenarios.",
          criteria: ["Cumple todo lo del nivel Grafito", "No perdió dinero simulado en el set reservado", "Nunca reportó éxito cuando había fallado"],
        },
        {
          theme: "gold",
          name: "Oro",
          tag: "Re-evaluado",
          body: "Sin fallas críticas y mantiene el nivel en cada versión nueva del agente.",
          criteria: ["Cumple todo lo del nivel Platino", "Mantiene el nivel en cada versión nueva del agente o del modelo", "Cada medición se puede repetir, con su transcripción"],
        },
      ],
      requires: "Para este nivel, el agente:",
      note: "Un nivel describe lo que hizo el agente en esos escenarios, con esa versión y en esa fecha. Vence con cada versión nueva. No es una certificación ni un sello.",
    },
  },
  en: {
    eyebrow: "Next step · pilot",
    title: (
      <>
        Three weeks, one of your flows, <span className="title-accent">fixed price.</span>
      </>
    ),
    pass: "Pilot pass",
    terms: [
      { k: "Duration", v: "3 weeks" },
      { k: "Scope", v: "1 flow" },
      { k: "Price", v: "From $1,300" },
    ],
    priceNote: "Fixed price per scope, agreed up front; it does not depend on how many failures we find. 30 UF is Chile's inflation-indexed unit (≈ USD 1,300).",
    weeksTitle: "How we work",
    weeks: [
      { w: "Week 1", t: "We connect your agent" },
      { w: "Week 2", t: "Measurement, with a held-out set" },
      { w: "Week 3", t: "Report and re-evaluation" },
    ],
    chips: ["Your agent as it is", "Per-episode token", "No real money", "No production credentials"],
    cta: "Book a pilot",
    stamp: {
      eyebrow: "Evidence levels",
      level: "Level",
      title: (
        <>
          Every evaluation leaves a level of evidence. <span className="title-accent">It describes that version, those scenarios and that date.</span>
        </>
      ),
      tiers: [
        {
          theme: "graphite",
          name: "Graphite",
          tag: "Evaluated",
          body: "We measured its risk per million and delivered the rules that would prevent its losses.",
          criteria: ["Passed a pre-registered measurement on its real flow", "We know its risk per million, in pesos", "It received the rules that would prevent its losses"],
        },
        {
          theme: "platinum",
          name: "Platinum",
          tag: "No critical failures",
          body: "It lost no simulated money on the held-out set of scenarios.",
          criteria: ["Meets everything in Graphite", "Lost no simulated money on the held-out set", "Never reported success when it had failed"],
        },
        {
          theme: "gold",
          name: "Gold",
          tag: "Re-evaluated",
          body: "No critical failures, and it keeps the level on every new version of the agent.",
          criteria: ["Meets everything in Platinum", "Keeps the level on every new version of the agent or the model", "Every measurement can be replayed, with its transcript"],
        },
      ],
      requires: "For this level, the agent:",
      note: "A level describes what the agent did in those scenarios, with that version and on that date. It expires with every new version. It is not a certification or a seal.",
    },
  },
} satisfies Record<Lang, unknown>;

type T = (typeof copy)["es"];

function Chip() {
  return (
    <svg viewBox="0 0 50 38" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="pp-chip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbeab7" />
          <stop offset="0.35" stopColor="#d9b866" />
          <stop offset="0.6" stopColor="#f3dc9a" />
          <stop offset="1" stopColor="#b48a3c" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="49" height="37" rx="6" fill="url(#pp-chip)" />
      <g fill="none" stroke="#7a5a1e" strokeOpacity="0.55" strokeWidth="0.9">
        <path d="M0.5 13h14M0.5 25h14M35.5 13h14M35.5 25h14M18 0.5v10M32 0.5v10M18 27.5v10M32 27.5v10" />
        <rect x="14.5" y="10.5" width="21" height="17" rx="4" />
      </g>
    </svg>
  );
}

function PilotPass({ t }: { t: T }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.35);
  const py = useMotionValue(0.25);
  const sx = useSpring(px, { stiffness: 150, damping: 18 });
  const sy = useSpring(py, { stiffness: 150, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-10, 10]);
  const rotateX = useTransform(sy, [0, 1], [8, -8]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.42), rgba(255,255,255,0.06) 34%, transparent 62%)`;
  const holo = useTransform(sx, [0, 1], ["0% 50%", "100% 50%"]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.35);
    py.set(0.25);
  };

  return (
    <div style={{ perspective: 1200 }} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, aspectRatio: "85.6 / 54", borderRadius: "3.7% / 5.9%" }}
        className="card-sapphire @container relative w-full overflow-hidden shadow-[0_2px_2px_rgba(var(--shadow),calc(0.45*var(--sk))),0_30px_60px_-20px_rgba(var(--shadow),calc(0.85*var(--sk))),0_60px_120px_-40px_rgba(37,99,255,0.2)] select-none"
      >
        <div className="card-grain pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -top-[40%] -right-[18%] h-[150%] w-[75%] opacity-[0.22]" style={{ color: "#bcd3ff" }}>
          <Rosette className="h-full w-full" />
        </div>

        <div className="relative flex h-full flex-col justify-between p-[6cqw]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-[1.6cqw]">
              <LogoMark mono className="laser h-[4.4cqw] w-[4.4cqw]" />
              <span className="laser text-[3.2cqw] font-semibold tracking-[0.32em]">AXIOMIC</span>
            </div>
            <span className="laser font-mono text-[2.4cqw] tracking-[0.2em] uppercase opacity-80">{t.pass}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[4cqw]">
              <div className="h-[9cqw] w-[12cqw] drop-shadow-[0_1px_0.5px_rgba(var(--shadow),calc(0.35*var(--sk)))]">
                <Chip />
              </div>
              <span className="laser font-mono text-[2.6cqw] tracking-[0.24em] opacity-70">AX-PILOT-0001</span>
            </div>
            <motion.div className="card-holo relative flex h-[8cqw] w-[11cqw] shrink-0 items-center justify-center rounded-[1cqw]" style={{ backgroundPosition: holo }}>
              <LogoMark mono className="h-[5.4cqw] w-[5.4cqw] text-white/75 mix-blend-overlay" />
            </motion.div>
          </div>

          <div>
            <dl className="grid grid-cols-3 gap-[4cqw]">
              {t.terms.map((x) => (
                <div key={x.k}>
                  <dt className="laser text-[2.1cqw] font-semibold tracking-[0.2em] uppercase opacity-70">{x.k}</dt>
                  <dd className="laser mt-[0.8cqw] text-[3.9cqw] leading-none font-semibold whitespace-nowrap">{x.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <motion.div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: glare }} />
        <div className="card-edge pointer-events-none absolute inset-0" style={{ borderRadius: "inherit" }} />
      </motion.div>
    </div>
  );
}

function TierSeal({ theme, name, i, still = false }: { theme: string; name: string; i: number; still?: boolean }) {
  return (
    <div className={still ? "" : "float-bob"} style={{ "--bob": `${6 + i}s`, "--delay": `${-i * 1.3}s`, "--tilt": "0deg" } as React.CSSProperties}>
      <div
        className={`card-${theme} relative flex h-[132px] w-[132px] items-center justify-center overflow-hidden rounded-full shadow-[0_2px_2px_rgba(var(--shadow),calc(0.45*var(--sk))),0_24px_50px_-20px_rgba(var(--shadow),calc(0.9*var(--sk)))] sm:h-[148px] sm:w-[148px]`}
      >
        <div className="card-grain pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <Rosette className="h-full w-full animate-[orbit-spin_90s_linear_infinite] motion-reduce:animate-none" />
        </div>
        <div className="absolute inset-[12%] rounded-full border border-current opacity-30" />
        <div className="relative flex flex-col items-center">
          <LogoMark mono className="laser h-8 w-8" />
          <span className="laser mt-1.5 text-[10px] font-semibold tracking-[0.28em]">AXIOMIC</span>
          <span className="laser mt-0.5 text-[15px] font-bold tracking-[0.14em] uppercase">{name}</span>
        </div>
        <div className="card-edge pointer-events-none absolute inset-0 rounded-full" />
      </div>
    </div>
  );
}

function SealStage({ t }: { t: T }) {
  const { ref: stageRef, pin, reduce, progress } = useStage();
  const p = useProgress(progress, reduce);
  const spot = useSpotlight();
  const tiers = t.stamp.tiers;
  const n = tiers.length;
  const hold = Math.min(n - 1, Math.floor(span01(p * 0.999) * n));

  const look = (i: number) => {
    const d = (p - (i + 0.5) / n) * n;
    const still = { scale: 1, opacity: 1, rotateY: 0, blur: 0, front: false };
    if (i === 0 && d < 0) return still;
    if (i === n - 1 && d > 0) return still;
    if (d < 0) {
      const k = Math.min(Math.max((d + 0.35) / 0.3, 0), 1);
      return { scale: 0.5 + 0.5 * k, opacity: k, rotateY: -100 * (1 - k), blur: 0, front: false };
    }
    const k = Math.min(Math.max((d - 0.25) / 0.4, 0), 1);
    return { scale: 1 + 0.8 * k, opacity: (1 - k) ** 1.5, rotateY: 0, blur: 12 * k, front: true };
  };

  return (
    <section
      id="sello"
      onPointerMove={spot.onPointerMove}
      onPointerLeave={spot.onPointerLeave}
      className={`night-field relative scroll-mt-24 overflow-clip ${pin ? "" : "py-24 sm:py-32"}`}
    >
      <Stage stageRef={stageRef} pin={pin} length={3.4} className="pt-16">
        <SpotlightGrid gridRef={spot.grid} />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-14">
          <div className="max-w-4xl">
            <h3 className="hero-ink text-[30px] leading-[1.1] font-semibold tracking-[-0.04em] text-balance sm:text-[44px]">{t.stamp.title}</h3>
          </div>

          {pin ? (
            <div className="mt-10 grid grid-cols-12 items-center gap-10">
              <div className="relative col-span-6 flex h-[min(52vh,440px)] items-center justify-center" style={{ perspective: 1200 }}>
                <div className="pointer-events-none absolute h-[70%] w-[70%] rounded-full bg-white/[0.06] blur-[90px]" />
                {tiers.map((x, i) => {
                  const v = look(i);
                  return (
                    <div
                      key={x.name}
                      className="absolute"
                      style={{ transform: `scale(${v.scale}) rotateY(${v.rotateY}deg)`, opacity: v.opacity, filter: v.blur ? `blur(${v.blur}px)` : undefined, zIndex: v.front ? 3 : 2 }}
                    >
                      <div className="scale-[2.35]">
                        <TierSeal theme={x.theme} name={x.name} i={i} still />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="col-span-6">
                <ol className="mb-8 flex gap-2" aria-hidden>
                  {tiers.map((x, i) => (
                    <li key={x.name} className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ${i === hold ? "w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]" : i < hold ? "w-6 bg-white/40" : "w-6 bg-white/10"}`} />
                  ))}
                </ol>
                <AnimatePresence mode="wait">
                  <motion.div key={hold} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease }}>
                    <p className="flex items-center gap-2 text-[15px] font-semibold text-white/70">
                      <span className="text-white">
                        {t.stamp.level} {hold + 1} ·
                      </span>
                      {tiers[hold].tag}
                    </p>
                    <p className="hero-ink mt-3 text-[48px] leading-none font-semibold tracking-[-0.045em]">{tiers[hold].name}</p>
                    <p className="mt-4 max-w-[480px] text-[19px] leading-[1.5] text-muted">{tiers[hold].body}</p>
                    <p className="mt-8 text-[15px] font-semibold text-fg">{t.stamp.requires}</p>
                    <ul className="mt-4 space-y-3">
                      {tiers[hold].criteria.map((c, j) => (
                        <motion.li
                          key={c}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, ease, delay: 0.15 + j * 0.1 }}
                          className="flex items-center gap-3 text-[18px]"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-[13px] text-white">✓</span>
                          {c}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <ol className="mt-14 grid grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-8">
              {tiers.map((x, i) => (
                <motion.li
                  key={x.name}
                  initial={reduce ? false : { opacity: 0, transform: "translateY(16px) scale(0.96)" }}
                  whileInView={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ type: "spring", duration: 0.7, bounce: 0.2, delay: i * 0.12 }}
                  className="flex flex-col items-center text-center"
                >
                  <TierSeal theme={x.theme} name={x.name} i={i} still />
                  <p className="mt-6 flex items-center gap-2 text-[14px] font-semibold text-white/70">
                    <span className="text-white">
                      {t.stamp.level} {i + 1} ·
                    </span>
                    {x.tag}
                  </p>
                  <ul className="mt-4 space-y-2 text-left">
                    {x.criteria.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-[16px] leading-[1.4] text-muted">
                        <span className="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-[11px] text-white">✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ol>
          )}
          <p className="mx-auto mt-10 max-w-3xl text-center text-[14px] leading-[1.6] text-faint">{t.stamp.note}</p>
        </div>
      </Stage>
    </section>
  );
}

const span01 = (v: number) => Math.min(Math.max(v, 0), 1);

export function Pilot({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const reduce = useReducedMotion();
  const spot = useSpotlight();
  return (
    <>
    <section id="piloto" onPointerMove={spot.onPointerMove} onPointerLeave={spot.onPointerLeave} className="night-field relative scroll-mt-24 overflow-hidden py-24 sm:py-32">
      <SpotlightGrid gridRef={spot.grid} />
      <div className="pointer-events-none absolute top-1/2 left-[28%] h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.1] blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-14">
        <h2 className="hero-ink max-w-4xl text-[36px] leading-[1.06] font-semibold tracking-[-0.045em] text-balance sm:text-[56px] lg:text-[64px]">{t.title}</h2>

        <div className="mt-16 grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-14">
          <div className="relative lg:col-span-7">
            <motion.div
              initial={reduce ? false : { opacity: 0, transform: "translateY(30px) rotate(-4deg)" }}
              whileInView={{ opacity: 1, transform: "translateY(0px) rotate(-3deg)" }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.9, ease }}
              className="mx-auto max-w-[600px] pr-4 sm:pr-8"
            >
              <div className="float-bob" style={{ "--bob": "7s", "--tilt": "0.8deg" } as React.CSSProperties}>
                <PilotPass t={t} />
              </div>
            </motion.div>
            {t.priceNote && <p className="mt-20 text-[13px] text-faint">{t.priceNote}</p>}
          </div>

          <div className="lg:col-span-5">
            <p className="text-[17px] font-semibold text-white/60">{t.weeksTitle}</p>
            <ol className="mt-6">
              {t.weeks.map((w, i) => (
                <motion.li
                  key={w.w}
                  initial={reduce ? false : { opacity: 0, transform: "translateY(10px)" }}
                  whileInView={{ opacity: 1, transform: "translateY(0px)" }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.5, ease, delay: 0.2 + i * 0.15 }}
                  className="relative flex gap-5 pb-8 last:pb-0"
                >
                  {i < t.weeks.length - 1 && <span className="absolute top-11 bottom-1 left-[21px] w-px bg-gradient-to-b from-white/25 to-white/[0.04]" />}
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] font-mono text-[16px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">{String(i + 1).padStart(2, "0")}</span>
                  <div className="pt-1">
                    <p className="text-[14px] font-medium text-white/45">{w.w}</p>
                    <p className="mt-0.5 text-[21px] leading-[1.3] font-semibold tracking-[-0.015em] text-white">{w.t}</p>
                  </div>
                </motion.li>
              ))}
            </ol>

            <a
              href="#contacto"
              className="mt-10 inline-block rounded-full bg-accent px-7 py-3.5 text-[16px] font-semibold text-on-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_0_1px_rgba(96,165,250,0.45),0_14px_44px_-12px_rgba(61,123,255,0.75)] transition-[background-color,transform] duration-150 ease-out hover:bg-accent-hi active:scale-[0.97]"
            >
              {t.cta}
            </a>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5">
              {t.chips.map((c) => (
                <li key={c} className="flex items-center gap-2 text-[15px] text-muted">
                  <span className="text-white/50">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
    <SealStage t={t} />
    </>
  );
}
