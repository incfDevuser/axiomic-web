"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Discipline } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { LogoMark } from "./LogoMark";

const rings = Array.from({ length: 22 }, (_, i) => i);

function Guilloche() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      {rings.map((i) => (
        <ellipse
          key={i}
          cx="100"
          cy="100"
          rx={30 + i * 3.2}
          ry={18 + i * 3.6}
          transform={`rotate(${i * 8.2} 100 100)`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
        />
      ))}
    </svg>
  );
}

function Chip() {
  return (
    <svg viewBox="0 0 38 50" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="chip-plate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbeab7" />
          <stop offset="0.35" stopColor="#d9b866" />
          <stop offset="0.6" stopColor="#f3dc9a" />
          <stop offset="1" stopColor="#b48a3c" />
        </linearGradient>
        <radialGradient id="chip-shine" cx="0.3" cy="0.2" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0.5" y="0.5" width="37" height="49" rx="6" fill="url(#chip-plate)" />
      <rect x="0.5" y="0.5" width="37" height="49" rx="6" fill="url(#chip-shine)" />
      <g fill="none" stroke="#7a5a1e" strokeOpacity="0.55" strokeWidth="0.9">
        <path d="M13 0.5v14M25 0.5v14M13 35.5v14M25 35.5v14" />
        <path d="M0.5 18h9M28.5 18h9M0.5 32h9M28.5 32h9" />
        <rect x="9.5" y="14.5" width="19" height="21" rx="4" />
        <path d="M19 14.5v-14M19 35.5v14" />
      </g>
      <rect x="0.5" y="0.5" width="37" height="49" rx="6" fill="none" stroke="#000" strokeOpacity="0.25" />
    </svg>
  );
}

function Contactless() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8 8.5a5 5 0 0 1 0 7" />
        <path d="M11.5 6a8.5 8.5 0 0 1 0 12" />
        <path d="M15 3.5a12 12 0 0 1 0 17" />
      </g>
    </svg>
  );
}

const labels = {
  es: { risk: "Riesgo", cur: "CLP", perMillion: "CLP / millón", measured: "medición 09 · simulado", illustrative: "Escenario ilustrativo", episodes: "episodios", untested: "sin cifras medidas", mandate: "MANDATO",
    report: "Informe", sandbox: "Sandbox", simulates: "Qué simula", tests: "Qué pone a prueba", with: "Con qué", looksFor: "Falla que buscamos", found: "Falla medida", scenarios: "Episodios", failures: "Fallas", where: "Dónde falló", rule: "Regla que la rechazaría", gateway: "Rechazada por la pasarela v0 · en simulación", riskPerMillion: "Riesgo por millón", illustrativeNote: "Escenario ilustrativo · sin cifras medidas", openFlow: "Ver en el flujo →" },
  en: { risk: "Risk", cur: "CLP", perMillion: "CLP / million", measured: "measurement 09 · simulated", illustrative: "Illustrative scenario", episodes: "episodes", untested: "no measured figures", mandate: "MANDATE",
    report: "Report", sandbox: "Sandbox", simulates: "What it simulates", tests: "What it tests", with: "With", looksFor: "Failure we look for", found: "Measured failure", scenarios: "Episodes", failures: "Failures", where: "Where it failed", rule: "Rule that would reject it", gateway: "Rejected by gateway v0 · in simulation", riskPerMillion: "Risk per million", illustrativeNote: "Illustrative scenario · no measured figures", openFlow: "See it in the flow →" },
} satisfies Record<Lang, Record<string, string>>;

function Stamp({ discipline, lang }: { discipline: Discipline; lang: Lang }) {
  const l = labels[lang];
  if (discipline.example) return null;
  return (
    <div className="card-stamp card-stamp-ink absolute top-[47%] right-[6cqw] rotate-[-9deg] rounded-[1.6cqw] border-[0.7cqw] px-[2.4cqw] py-[1.4cqw] text-center font-mono uppercase">
      <div className="text-[2.8cqw] leading-none tracking-[0.18em]">{l.risk}</div>
      <div className="mt-[0.8cqw] text-[4.6cqw] leading-none font-bold">{discipline.riskPerMillion}</div>
      <div className="mt-[0.6cqw] text-[2.6cqw] leading-none tracking-[0.1em]">{l.perMillion}</div>
      <div className="mt-[1cqw] text-[2.2cqw] leading-none tracking-[0.14em] opacity-75">{l.measured}</div>
    </div>
  );
}

export function AgentCard({ discipline, interactive = false, lang = "es", sandbox = false }: { discipline: Discipline; interactive?: boolean; lang?: Lang; sandbox?: boolean }) {
  const { theme, name, mandate, agent, episode, episodes, example } = discipline;
  const l = labels[lang];
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.3);
  const py = useMotionValue(0.2);
  const sx = useSpring(px, { stiffness: 160, damping: 18 });
  const sy = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-11, 11]);
  const rotateX = useTransform(sy, [0, 1], [9, -9]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.38), rgba(255,255,255,0.06) 32%, transparent 60%)`;
  const holoShift = useTransform(sx, [0, 1], ["0% 50%", "100% 50%"]);

  const onMove = (e: React.PointerEvent) => {
    if (!interactive || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.3);
    py.set(0.2);
  };

  return (
    <div style={{ perspective: 900 }} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        ref={ref}
        style={interactive ? { rotateX, rotateY } : undefined}
        className={`agent-card card-${theme} @container relative w-full overflow-hidden select-none`}
      >
        <div className="card-grain pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-[55%] top-[16%] h-[95%] w-[150%] opacity-[0.11]">
          <Guilloche />
        </div>

        <div className="relative flex h-full flex-col p-[8.5cqw]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[2.6cqw]">
              <LogoMark mono className="laser h-[8cqw] w-[8cqw]" />
              <span className="laser text-[5.4cqw] font-semibold tracking-[0.32em]">AXIOMIC</span>
            </div>
            <div className="laser h-[8.5cqw] w-[8.5cqw] opacity-80">
              <Contactless />
            </div>
          </div>

          <div className="mt-[9cqw] flex items-start justify-between">
            <div className="h-[20cqw] w-[15.2cqw] drop-shadow-[0_1px_0.5px_rgba(0,0,0,0.35)]">
              <Chip />
            </div>
            <div className="laser max-w-[52cqw] text-right font-mono leading-tight">
              {example ? (
                <>
                  <div className="text-[3.4cqw] leading-[1.15] tracking-[0.06em] uppercase">{l.illustrative}</div>
                  <div className="mt-[0.6cqw] text-[2.9cqw] opacity-70">{l.untested}</div>
                </>
              ) : (
                <>
                  <div className="text-[4.2cqw] tracking-[0.08em] uppercase">{episode}</div>
                  <div className="text-[3.2cqw] opacity-70">{`${episodes} ${l.episodes}`}</div>
                </>
              )}
            </div>
          </div>

          <Stamp discipline={discipline} lang={lang} />

          <div className="mt-auto">
            <div className="laser truncate text-[3.3cqw] font-medium tracking-[0.18em] uppercase opacity-75">
              {sandbox || !agent ? l.sandbox : agent}
            </div>
            <div className="laser mt-[1.2cqw] text-[6.8cqw] leading-[1.12] font-semibold uppercase tracking-[0.05em]">{name}</div>

            <div className="mt-[6cqw] flex items-end justify-between gap-[3cqw]">
              <div>
                <div className="laser text-[3.3cqw] font-medium tracking-[0.22em] opacity-70">{l.mandate}</div>
                <div className="laser mt-[1cqw] font-mono text-[5.2cqw] font-semibold">{mandate}</div>
              </div>
              <motion.div
                className="card-holo relative flex h-[13cqw] w-[17cqw] shrink-0 items-center justify-center rounded-[1.6cqw]"
                style={{ backgroundPosition: holoShift }}
              >
                <LogoMark mono className="h-[8cqw] w-[8cqw] text-white/75 mix-blend-overlay" />
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: glare }} />
        <div className="card-edge pointer-events-none absolute inset-0" />
      </motion.div>
    </div>
  );
}

export function CardBack({
  discipline,
  onOpenFlow,
  lang = "es",
  mode = "report",
}: {
  discipline: Discipline;
  onOpenFlow?: () => void;
  lang?: Lang;
  mode?: "report" | "sandbox";
}) {
  const { theme, episode, agent, episodes, failures, failure, rule, riskPerMillion, example } = discipline;
  const l = labels[lang];
  const box = discipline.sandbox;
  const openButton = onOpenFlow && (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenFlow();
      }}
      className="mt-[4cqw] w-full rounded-full bg-black/80 py-[2.4cqw] text-[4cqw] font-medium text-white transition-transform duration-150 ease-out active:scale-[0.97]"
    >
      {l.openFlow}
    </button>
  );

  if (mode === "sandbox" && box) {
    return (
      <div className={`agent-card card-${theme} @container relative w-full overflow-hidden select-none`}>
        <div className="card-grain pointer-events-none absolute inset-0" />
        <div className="absolute inset-y-0 left-[7cqw] w-[13cqw] bg-[linear-gradient(90deg,#0b0b0c,#1d1d20_40%,#0d0d0f)]" />
        <div className="card-back-shade pointer-events-none absolute inset-0" />

        <div className="relative flex h-full flex-col py-[8cqw] pr-[7cqw] pl-[27cqw]">
          <div className="laser font-mono text-[3.6cqw] tracking-[0.14em] uppercase opacity-80">{l.sandbox}</div>
          <div className="laser mt-[1cqw] text-[6.4cqw] leading-[1.1] font-semibold">{discipline.name}</div>

          <div className="mt-[4.5cqw]">
            <div className="laser text-[3.3cqw] font-semibold opacity-70">{l.simulates}</div>
            <div className="laser mt-[0.8cqw] text-[4.3cqw] leading-snug">{box.simulates}</div>
          </div>

          <div className="mt-[4cqw]">
            <div className="laser text-[3.3cqw] font-semibold opacity-70">{l.tests}</div>
            <ul className="mt-[1cqw] space-y-[1cqw]">
              {box.tests.map((x) => (
                <li key={x} className="laser flex gap-[1.6cqw] text-[4.1cqw] leading-snug">
                  <span aria-hidden>•</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-[4cqw]">
            <div className="laser text-[3.3cqw] font-semibold opacity-70">{l.with}</div>
            <div className="laser mt-[0.8cqw] text-[3.9cqw] leading-snug">{box.with}</div>
          </div>

          <div className="mt-auto">
            <div className="laser text-[3.3cqw] font-semibold opacity-70">{example ? l.looksFor : l.found}</div>
            <div className="laser mt-[0.8cqw] text-[3.9cqw] leading-snug font-semibold">✕ {failure}</div>
            {!example && <div className="laser mt-[1.2cqw] text-[3.3cqw] leading-snug opacity-80">✓ {l.gateway}</div>}
            {example && <div className="laser mt-[1.2cqw] font-mono text-[2.7cqw] tracking-[0.12em] uppercase opacity-60">{l.illustrativeNote}</div>}
            {openButton}
          </div>
        </div>
        <div className="card-edge pointer-events-none absolute inset-0" />
      </div>
    );
  }

  return (
    <div className={`agent-card card-${theme} @container relative w-full overflow-hidden select-none`}>
      <div className="card-grain pointer-events-none absolute inset-0" />
      <div className="absolute inset-y-0 left-[7cqw] w-[13cqw] bg-[linear-gradient(90deg,#0b0b0c,#1d1d20_40%,#0d0d0f)]" />
      <div className="card-back-shade pointer-events-none absolute inset-0" />

      <div className="relative flex h-full flex-col py-[8cqw] pr-[7cqw] pl-[27cqw]">
        <div className="laser font-mono text-[3.6cqw] tracking-[0.14em] uppercase opacity-80">{l.report} · {example ? l.illustrative : episode}</div>
        <div className="laser mt-[1.5cqw] text-[5.2cqw] leading-tight font-semibold">{agent || discipline.name}</div>

        <div className="mt-[5cqw] grid grid-cols-2 gap-[3cqw]">
          <div>
            <div className="laser text-[3.2cqw] tracking-[0.16em] uppercase opacity-65">{l.scenarios}</div>
            <div className="laser font-mono text-[6cqw] font-semibold">{episodes}</div>
          </div>
          <div>
            <div className="laser text-[3.2cqw] tracking-[0.16em] uppercase opacity-65">{l.failures}</div>
            <div className="laser font-mono text-[6cqw] font-semibold">{failures}</div>
          </div>
        </div>

        <div className="mt-[4cqw]">
          <div className="laser text-[3.2cqw] tracking-[0.16em] uppercase opacity-65">{l.where}</div>
          <div className="laser mt-[0.8cqw] text-[4.4cqw] leading-snug">{failure}</div>
        </div>

        <div className="mt-[4cqw]">
          <div className="laser text-[3.2cqw] tracking-[0.16em] uppercase opacity-65">{l.rule}</div>
          <div className="laser mt-[0.8cqw] text-[4.4cqw] leading-snug font-semibold">✓ {rule}</div>
          {!example && <div className="laser mt-[0.8cqw] text-[3.3cqw] leading-snug opacity-75">{l.gateway}</div>}
        </div>

        <div className="mt-auto">
          <div className="laser text-[3.2cqw] tracking-[0.16em] uppercase opacity-65">{l.riskPerMillion}</div>
          <div className="laser font-mono text-[5.4cqw] font-semibold">{example ? "—" : `${riskPerMillion} ${l.cur}`}</div>
          {example && <div className="laser mt-[0.6cqw] font-mono text-[2.6cqw] tracking-[0.18em] uppercase opacity-60">{l.illustrativeNote}</div>}
          {openButton}
        </div>
      </div>
      <div className="card-edge pointer-events-none absolute inset-0" />
    </div>
  );
}
