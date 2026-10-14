"use client";

import { useRef, useState } from "react";
import type { Discipline } from "@/lib/content";
import { totals } from "@/lib/evidence";
import { fmt, type Lang } from "@/lib/i18n";
import { AgentCard } from "./AgentCard";
import { useCase } from "./CaseContext";
import { SpotlightGrid, useSpotlight } from "./Night";
import { Stage, span, useProgress, useStage } from "./Stage";

const copy = {
  es: {
    eyebrow: "Cómo funciona",
    title: "Así probamos a tu agente.",
    steps: ["Sandbox", "Trampas", "Tu agente", "Veredicto"],
    stepSub: ["Un mundo financiero simulado.", "Escondidas en documentos normales. Pásale el cursor.", "Recibe el documento y actúa, como lo haría con dinero real.", "Medimos cada decisión."],
    docs: {
      transferencias: "Orden de transferencia",
      incidentes: "Reclamo de cliente",
      asincronos: "Pago pendiente",
      compartido: "Orden de compra",
      "cuentas-por-pagar": "Factura de proveedor",
    } as Record<string, string>,
    simulated: "simulado",
    agentName: "Tu agente de IA",
    receives: "Recibe",
    log: ["Lee la orden", "Decide qué hacer", "Ejecuta el pago simulado"],
    statusIdle: "en espera",
    statusWorking: "trabajando",
    statusDone: "terminó",
    checks: "controles",
    pass: "Aprobado",
    fail: "Falla",
    found: "Falla medida",
    looksFor: "Falla que buscamos",
    rule: "Regla que la rechazaría",
    risk: "CLP de riesgo por millón",
    illustrative: "Escenario ilustrativo · sin cifras medidas",
  },
  en: {
    eyebrow: "How it works",
    title: "This is how we test your agent.",
    steps: ["Sandbox", "Traps", "Your agent", "Verdict"],
    stepSub: ["A simulated financial world.", "Hidden inside ordinary documents. Hover over it.", "It gets the document and acts, as it would with real money.", "We measure every decision."],
    docs: {
      transferencias: "Transfer order",
      incidentes: "Customer claim",
      asincronos: "Pending payment",
      compartido: "Purchase order",
      "cuentas-por-pagar": "Supplier invoice",
    } as Record<string, string>,
    simulated: "simulated",
    agentName: "Your AI agent",
    receives: "Receives",
    log: ["Reads the order", "Decides what to do", "Runs the simulated payment"],
    statusIdle: "waiting",
    statusWorking: "working",
    statusDone: "done",
    checks: "checks",
    pass: "Passed",
    fail: "Failed",
    found: "Measured failure",
    looksFor: "Failure we look for",
    rule: "Rule that would reject it",
    risk: "CLP of risk per million",
    illustrative: "Illustrative scenario · no measured figures",
  },
} satisfies Record<Lang, unknown>;

type T = (typeof copy)["es"];

// Scroll beats (0..1 of the stage)
const B = {
  t12: [0.06, 0.14],
  scan: [0.14, 0.42],
  t23: [0.42, 0.5],
  agent: [0.5, 0.62],
  t34: [0.62, 0.68],
  count: [0.68, 0.8],
  report: [0.8, 0.88],
} as const;

// The document has 7 redacted lines; three of them hide a trap.
const LINES = 7;
const TRAP_AT = [1, 3, 5];
const LINE_W = [82, 64, 90, 58, 76, 70, 46];
const DOC_H = 262;
const lineY = (i: number) => 60 + i * 26;

function StationHead({ i, t, on }: { i: number; t: T; on: boolean }) {
  return (
    <div className="text-center">
      <p className="flex items-center justify-center gap-2.5">
        <span className={`font-mono text-[14px] tabular-nums transition-colors duration-500 ${on ? "text-white" : "text-white/30"}`}>{String(i + 1).padStart(2, "0")}</span>
        <span className={`text-[19px] font-semibold tracking-[-0.02em] transition-colors duration-500 ${on ? "text-white" : "text-white/40"}`}>{t.steps[i]}</span>
      </p>
      <p className={`mx-auto mt-1.5 max-w-[240px] text-[15px] leading-[1.45] text-balance transition-colors duration-500 ${on ? "text-muted" : "text-white/25"}`}>{t.stepSub[i]}</p>
    </div>
  );
}

/* 02 · a normal-looking document whose traps are written in invisible ink */
function InkDoc({ d, t, scan }: { d: Discipline; t: T; scan: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [uv, setUv] = useState<{ x: number; y: number } | null>(null);
  const tests = d.sandbox?.tests ?? [];
  const beamPx = scan * DOC_H;
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setUv({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setUv(null)}
      className="relative w-[248px] cursor-crosshair overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] px-5 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_40px_80px_-40px_rgba(0,0,0,1)] ring-1 ring-white/10 backdrop-blur-md"
      style={{ height: DOC_H }}
    >
      <p className="font-mono text-[12px] tracking-[0.12em] text-white/45 uppercase">{t.docs[d.id] ?? d.name}</p>
      <div className="mt-2 h-px bg-white/10" />
      {Array.from({ length: LINES }, (_, i) => {
        const trap = TRAP_AT.indexOf(i);
        const y = lineY(i);
        const shown = trap >= 0 && ((scan > 0 && beamPx >= y + 8) || (uv !== null && Math.abs(uv.y - y) < 32));
        return (
          <div key={i} className="absolute right-5 left-5 h-[18px]" style={{ top: y - 9 }}>
            <span className="absolute inset-y-[4px] left-0 rounded-full bg-white/[0.09] transition-opacity duration-500" style={{ width: `${LINE_W[i]}%`, opacity: shown ? 0 : 1 }} />
            {trap >= 0 && (
              <span
                className="absolute inset-0 flex items-center gap-1.5 overflow-hidden text-[13px] font-semibold whitespace-nowrap text-white transition-[opacity,filter] duration-500"
                style={{ opacity: shown ? 1 : 0, filter: shown ? "blur(0px)" : "blur(6px)", textShadow: "0 0 14px rgba(255,255,255,0.55)" }}
              >
                <span className="text-white/55">⚠</span>
                <span className="truncate">{tests[trap]}</span>
              </span>
            )}
          </div>
        );
      })}
      <p className="absolute right-5 bottom-4 left-5 flex justify-between font-mono text-[12px] text-white/30">
        <span>{d.mandate}</span>
        <span>{t.simulated}</span>
      </p>

      {scan > 0 && scan < 1 && (
        <span aria-hidden className="pointer-events-none absolute inset-x-0" style={{ top: beamPx }}>
          <span className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-b from-transparent to-white/[0.07]" />
          <span className="absolute inset-x-0 top-0 h-[2px] bg-white shadow-[0_0_18px_rgba(255,255,255,0.9),0_0_40px_rgba(147,197,253,0.6)]" />
        </span>
      )}
      {uv && (
        <span
          aria-hidden
          className="pointer-events-none absolute h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(147,197,253,0.18),transparent)]"
          style={{ left: uv.x, top: uv.y }}
        />
      )}
    </div>
  );
}

/* 03 · the agent at work: a small agent window that receives the document and acts on it */
function AgentWindow({ d, t, k, on }: { d: Discipline; t: T; k: number; on: boolean }) {
  const steps = [`${t.receives}: ${t.docs[d.id] ?? d.name}`, ...t.log];
  const status = k >= 1 ? t.statusDone : on ? t.statusWorking : t.statusIdle;
  return (
    <div
      className={`w-[268px] overflow-hidden rounded-[14px] bg-[linear-gradient(180deg,rgba(20,28,48,0.92),rgba(7,10,18,0.96))] ring-1 backdrop-blur-md transition-[box-shadow] duration-700 ${
        on ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_60px_-10px_rgba(61,123,255,0.45)] ring-accent/40" : "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_40px_80px_-40px_rgba(0,0,0,1)] ring-white/10"
      }`}
    >
      <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
        <span className={`flex h-7 w-7 items-center justify-center rounded-[8px] transition-colors duration-500 ${on ? "bg-accent/20 text-accent-hi" : "bg-white/[0.06] text-white/40"}`}>
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3v3M7 8h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM9.5 13h.01M14.5 13h.01M9.5 16.5h5" />
          </svg>
        </span>
        <span className={`text-[15px] font-semibold transition-colors duration-500 ${on ? "text-white" : "text-white/45"}`}>{t.agentName}</span>
        <span className={`ml-auto flex items-center gap-1.5 text-[12px] transition-colors duration-500 ${on ? "text-white/60" : "text-white/30"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${k >= 1 ? "bg-white/60" : on ? "breathe bg-accent" : "bg-white/20"}`} />
          {status}
        </span>
      </div>
      <ol className="space-y-2 px-4 py-3.5 text-[14px]">
        {steps.map((l, i) => {
          const at = i / steps.length;
          const state = !on ? "idle" : k >= at + 1 / steps.length ? "done" : k >= at ? "active" : "idle";
          return (
            <li key={l} className="flex items-center gap-2.5">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] transition-colors duration-300 ${
                  state === "done" ? "bg-white/15 text-white" : state === "active" ? "border border-accent text-accent" : "border border-white/15 text-transparent"
                }`}
              >
                {state === "done" ? "✓" : state === "active" ? <span className="breathe h-1.5 w-1.5 rounded-full bg-accent" /> : ""}
              </span>
              <span className={`truncate transition-colors duration-300 ${state === "idle" ? "text-white/30" : state === "active" ? "text-white" : "text-white/70"}`}>{l}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* 04 · the verdict: every check counted, then the report line */
function Verdict({ d, t, count, report, lang }: { d: Discipline; t: T; count: number; report: number; lang: Lang }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const done = count >= 1;
  return (
    <div className="flex flex-col items-center">
      <span className="relative flex h-[120px] w-[120px] items-center justify-center">
        <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - count)}
            style={{ opacity: count > 0 ? 1 : 0, filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }}
          />
        </svg>
        <span className="text-center">
          <span className={`block text-[26px] leading-none font-semibold tabular-nums transition-colors duration-300 ${count > 0 ? "text-white" : "text-white/30"}`}>
            {fmt(lang, Math.round(totals.checks * count))}
          </span>
          <span className="mt-1 block text-[13px] text-white/45">{t.checks}</span>
        </span>
      </span>

      <div className="mt-4 flex gap-2">
        <span className="rounded-full px-3 py-1 text-[14px] font-semibold text-white/30 ring-1 ring-white/10">✓ {t.pass}</span>
        <span
          className={`rounded-full px-3 py-1 text-[14px] font-semibold ring-1 transition-[background-color,box-shadow,color] duration-500 ${
            done ? "bg-white/[0.1] text-white shadow-[0_0_24px_rgba(255,255,255,0.25)] ring-white/70" : "text-white/30 ring-white/10"
          }`}
        >
          ✕ {t.fail}
        </span>
      </div>

      <div className="mt-4 w-[280px] text-center transition-[opacity,transform] duration-700" style={{ opacity: report, transform: `translateY(${(1 - report) * 8}px)` }}>
        <p className="text-[14px] text-white/45">{d.example ? t.looksFor : t.found}</p>
        <p className="mt-0.5 text-[15px] leading-[1.4] font-semibold text-balance text-white">{d.failure}</p>
        <p className="mt-2 text-[14px] text-white/45">{t.rule}</p>
        <p className="mt-0.5 text-[15px] leading-[1.4] text-balance text-accent-hi">{d.rule}</p>
        <p className="mt-2 text-[13px] text-white/35">{d.example ? t.illustrative : `${d.riskPerMillion} ${t.risk}`}</p>
      </div>
    </div>
  );
}

const THREAD_Y = 131;

function Chamber({ d, t, p, lang }: { d: Discipline; t: T; p: number; lang: Lang }) {
  const legs = [span(p, ...B.t12), span(p, ...B.t23), span(p, ...B.t34)];
  const lit = [true, legs[0] >= 1, legs[1] >= 1, legs[2] >= 1];
  const filled = (legs[0] + legs[1] + legs[2]) / 3;
  const moving = legs.findIndex((k) => k > 0 && k < 1);
  const tokenX = moving < 0 ? null : 12.5 + (moving + legs[moving]) * 25;

  const stations = [
    <span key="card" className="block w-[118px] rotate-[-6deg] drop-shadow-[0_30px_40px_rgba(0,0,0,0.8)]">
      <AgentCard discipline={d} lang={lang} sandbox />
    </span>,
    <InkDoc key="doc" d={d} t={t} scan={span(p, ...B.scan)} />,
    <AgentWindow key="agent" d={d} t={t} k={span(p, ...B.agent)} on={lit[2]} />,
    <Verdict key="verdict" d={d} t={t} count={span(p, ...B.count)} report={span(p, ...B.report)} lang={lang} />,
  ];

  return (
    <div>
      {/* step names in one row (desktop) */}
      <div className="hidden grid-cols-4 gap-6 lg:grid">
        {t.steps.map((_, i) => (
          <StationHead key={i} i={i} t={t} on={lit[i]} />
        ))}
      </div>

      <div className="relative lg:mt-5">
        {/* the light thread through every station (desktop) */}
        <div aria-hidden className="pointer-events-none absolute right-[12.5%] left-[12.5%] hidden h-px bg-white/[0.08] lg:block" style={{ top: THREAD_Y }}>
          <div className="h-full origin-left bg-gradient-to-r from-accent via-accent-hi to-white shadow-[0_0_12px_rgba(96,165,250,0.9)]" style={{ transform: `scaleX(${filled})` }} />
        </div>
        {tokenX !== null && (
          <span
            aria-hidden
            className="pointer-events-none absolute z-10 hidden h-[16px] w-[12px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-white shadow-[0_0_18px_rgba(255,255,255,0.9),0_0_40px_rgba(96,165,250,0.8)] lg:block"
            style={{ left: `${tokenX}%`, top: THREAD_Y }}
          />
        )}

        <div className="grid grid-cols-1 gap-20 lg:grid-cols-4 lg:gap-6">
          {stations.map((node, i) => (
            <div key={i} className="relative flex flex-col items-center">
              {i > 0 && (
                <span aria-hidden className="absolute -top-14 left-1/2 h-9 w-px -translate-x-1/2 bg-white/10 lg:hidden">
                  <span className="block h-full origin-top bg-accent" style={{ transform: `scaleY(${legs[i - 1]})` }} />
                </span>
              )}
              <div className="mb-6 lg:hidden">
                <StationHead i={i} t={t} on={lit[i]} />
              </div>
              {/* every visual is centred on the thread: boxes of THREAD_Y*2, or a 120px disc whose centre sits on it */}
              <div
                className={`flex w-full items-center justify-center ${i === 3 ? "lg:items-start lg:pt-[var(--pt)]" : ""}`}
                style={{ minHeight: i < 3 ? THREAD_Y * 2 : undefined, "--pt": `${i === 3 ? THREAD_Y - 60 : 0}px` } as React.CSSProperties}
              >
                {node}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Arena() {
  const { current, choose, disciplines, lang } = useCase();
  const t = copy[lang];
  const { ref: stageRef, pin, reduce, progress } = useStage();
  const p = useProgress(progress, reduce);
  const spot = useSpotlight();

  return (
    <section
      id="como-funciona"
      onPointerMove={spot.onPointerMove}
      onPointerLeave={spot.onPointerLeave}
      className={`night-field relative scroll-mt-24 overflow-clip ${pin ? "" : "py-24 sm:py-32"}`}
    >
      <Stage stageRef={stageRef} pin={pin} length={3} className="pt-20">
        <SpotlightGrid gridRef={spot.grid} />
        <div aria-hidden className="pointer-events-none absolute top-[58%] left-1/2 h-[520px] w-[1100px] max-w-[110vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(61,123,255,0.09),transparent)] blur-2xl" />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-14">
          <div className="text-center">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[14px] font-medium text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(61,123,255,0.9)]" />
              {t.eyebrow}
            </p>
            <h2 className="hero-ink mt-4 text-[36px] leading-[1.08] font-semibold tracking-[-0.045em] sm:text-[48px]">{t.title}</h2>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {disciplines.map((d) => {
              const on = d.id === current.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => choose(d.id)}
                  aria-pressed={on}
                  className={`flex shrink-0 items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-3 transition-[border-color,background-color,transform] duration-200 ease-out active:scale-[0.97] sm:gap-3 sm:py-2 sm:pr-5 sm:pl-4 ${
                    on ? "border-white/25 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" : "border-white/10 bg-white/[0.025] hover:border-white/20"
                  }`}
                >
                  <span className="w-[18px] shrink-0">
                    <AgentCard discipline={d} lang={lang} sandbox />
                  </span>
                  <span className={`text-[14px] font-semibold whitespace-nowrap sm:text-[15px] ${on ? "text-fg" : "text-muted"}`}>{d.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-12 lg:mt-8">
            <Chamber key={current.id} d={current} t={t} p={p} lang={lang} />
          </div>

        </div>
      </Stage>
    </section>
  );
}
