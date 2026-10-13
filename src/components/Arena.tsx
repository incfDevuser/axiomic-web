"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Discipline } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { AgentCard } from "./AgentCard";
import { useCase } from "./CaseContext";
import { Stage, span, useProgress, useStage } from "./Stage";

const copy = {
  es: {
    eyebrow: "Cómo funciona",
    title: "Así probamos a tu agente.",
    nodes: { sandbox: "Sandbox", agent: "Tu agente", evalr: "Evaluador", evalSub: "423 controles", pass: "Aprobado", fail: "Falla", report: "Informe", reportSub: "riesgo por millón" },
  },
  en: {
    eyebrow: "How it works",
    title: "This is how we test your agent.",
    nodes: { sandbox: "Sandbox", agent: "Your agent", evalr: "Grader", evalSub: "423 checks", pass: "Passed", fail: "Failed", report: "Report", reportSub: "risk per million" },
  },
} satisfies Record<Lang, unknown>;

type T = (typeof copy)["es"];

const BLUE = "var(--accent)";
const RED = "var(--danger)";
const LIGHT = "var(--fg)";
const IDLE = "var(--edge)";

const SEG = {
  feed: [0, 0.14],
  hit: [0.14, 0.3],
  order: [0.3, 0.44],
  evalr: [0.44, 0.52],
  result: [0.52, 0.68],
  out: [0.68, 0.84],
} as const;

type Fill = { feed: number; hit: number; order: number; result: number; out: number };
const fills = (p: number): Fill => ({
  feed: span(p, ...SEG.feed),
  hit: span(p, ...SEG.hit),
  order: span(p, ...SEG.order),
  result: span(p, ...SEG.result),
  out: span(p, ...SEG.out),
});

type Glow = "idle" | "done" | "on";

function glows(p: number) {
  const at = (on: number, off: number): Glow => (p < on ? "idle" : p < off ? "on" : "done");
  const sit = at(SEG.hit[0], SEG.hit[1]);
  return {
    card: at(0, SEG.feed[1]),
    sit,
    agent: at(SEG.order[0], SEG.evalr[0]),
    evalr: at(SEG.evalr[0], SEG.evalr[1]),
    pass: at(SEG.out[0], SEG.out[1]),
    fail: at(SEG.out[0], SEG.out[1]),
    report: (p >= SEG.out[1] ? "on" : "idle") as Glow,
  };
}

function Path({ d, fill, color = BLUE, width = 2.6, dashed = false }: { d: string; fill: number; color?: string; width?: number; dashed?: boolean }) {
  return (
    <>
      <path d={d} style={{ stroke: IDLE }} strokeWidth={width} strokeDasharray={dashed ? "5 7" : undefined} className={dashed ? "dash-slow" : ""} />
      <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - fill} strokeWidth={width + 0.6} strokeLinecap="round" style={{ stroke: color, opacity: fill > 0 ? 1 : 0, filter: `drop-shadow(0 0 6px ${color})` }} />
    </>
  );
}

const hcurve = (x1: number, y1: number, x2: number, y2: number) => {
  const k = (x2 - x1) / 2;
  return `M${x1} ${y1} C${x1 + k} ${y1}, ${x2 - k} ${y2}, ${x2} ${y2}`;
};
const vcurve = (x1: number, y1: number, x2: number, y2: number) => {
  const k = Math.max(30, (y2 - y1) / 2);
  return `M${x1} ${y1} C${x1} ${y1 + k}, ${x2} ${y2 - k}, ${x2} ${y2}`;
};

function Icon({ children, className = "h-7 w-7" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const glyph = {
  alert: <path d="M12 3l9 16H3zM12 10v4M12 17v.5" />,
  grader: <path d="M4 19h16M7 16V11M12 16V6M17 16v-3" />,
  pass: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  fail: <path d="M7 7l10 10M17 7L7 17" />,
  report: <path d="M6 3h9l3 3v15H6zM9 17v-3M12 17v-6M15 17v-2" />,
  agent: <path d="M12 3v3M7 8h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM9.5 13h.01M14.5 13h.01M9.5 16.5h5" />,
};

function Node({ x, y, size, glow, tone = "blue", shape = "rounded-[22px]", children }: { x: number; y: number; size: number; glow: Glow; tone?: "blue" | "bad"; shape?: string; children: React.ReactNode }) {
  const bad = tone === "bad";
  const look =
    glow === "on"
      ? bad
        ? "border-danger bg-danger/10 text-danger"
        : "border-accent bg-accent/10 text-accent"
      : glow === "done"
        ? bad
          ? "border-danger/40 bg-panel text-danger/70"
          : "border-accent/40 bg-panel text-accent/70"
        : "border-edge bg-panel text-faint";
  const halo = bad ? "var(--danger)" : "var(--accent)";
  return (
    <span
      className={`absolute flex items-center justify-center border-2 transition-[border-color,background-color,color,box-shadow,transform] duration-300 ease-out ${shape} ${look}`}
      style={{
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        boxShadow: glow === "on" ? `0 0 0 8px color-mix(in srgb, ${halo} 9%, transparent), 0 0 50px color-mix(in srgb, ${halo} 36%, transparent)` : "0 14px 30px -18px rgba(var(--shadow),calc(0.8*var(--sk)))",
        transform: glow === "on" ? "scale(1.07)" : "scale(1)",
      }}
    >
      {children}
      {glow === "on" && <span className={`graph-pulse pointer-events-none absolute -inset-[2px] border-2 ${shape} ${bad ? "border-danger" : "border-accent"}`} />}
    </span>
  );
}

function Caption({ x, y, title, sub, glow, w = 200, tone = "blue" }: { x: number; y: number; title: string; sub?: string; glow: Glow; w?: number; tone?: "blue" | "bad" }) {
  const color = glow === "on" ? (tone === "bad" ? "text-danger" : "text-fg") : glow === "done" ? "text-fg/80" : "text-muted";
  return (
    <span className="pointer-events-none absolute flex -translate-x-1/2 flex-col items-center text-center" style={{ left: x, top: y, width: w }}>
      <span className={`text-[17px] leading-[1.25] font-semibold transition-colors duration-400 ${color}`}>{title}</span>
      {sub && <span className="mt-0.5 text-[14px] text-faint">{sub}</span>}
    </span>
  );
}

function useFit(width: number, max: number, fit?: { height: number; reserved: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);
  const fitH = fit?.height;
  const reserved = fit?.reserved ?? 0;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const byWidth = el.clientWidth / width;
      const byHeight = fitH ? (window.innerHeight - reserved) / fitH : Infinity;
      setScale(Math.max(0.5, Math.min(max, byWidth, byHeight)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [width, max, fitH, reserved]);
  return { ref, scale };
}

type Wires = { feed: (i: number) => string; hit: (i: number) => string; order: string; pass: string; fail: string; passOut: string; failOut: string };

function Heads({ f, w, n, reduce }: { f: Fill; w: Wires; n: number; reduce: boolean }) {
  if (reduce) return null;
  const live: { d: string; at: number; color: string }[] = [];
  const add = (d: string, at: number, color: string) => at > 0 && at < 1 && live.push({ d, at, color });
  for (let i = 0; i < n; i++) {
    add(w.feed(i), f.feed, BLUE);
    add(w.hit(i), f.hit, RED);
  }
  add(w.order, f.order, LIGHT);
  add(w.pass, f.result, BLUE);
  add(w.fail, f.result, RED);
  add(w.passOut, f.out, BLUE);
  add(w.failOut, f.out, RED);
  return (
    <>
      {live.map(({ d, at, color }) => (
        <span
          key={d}
          className="absolute top-0 left-0 h-[12px] w-[12px] rounded-full"
          style={{ offsetPath: `path("${d}")`, offsetDistance: `${at * 100}%`, offsetRotate: "0deg", backgroundColor: color, boxShadow: `0 0 20px ${color}, 0 0 6px ${color}` } as React.CSSProperties}
        />
      ))}
    </>
  );
}

const HW = 1240;
const HH = 560;
const HP = {
  card: { x: 90, y: 280 },
  sits: [
    { x: 330, y: 120 },
    { x: 330, y: 280 },
    { x: 330, y: 440 },
  ],
  agent: { x: 580, y: 280 },
  evalr: { x: 790, y: 280 },
  pass: { x: 985, y: 190 },
  fail: { x: 985, y: 370 },
  report: { x: 1165, y: 280 },
};
const hw = {
  feed: (i: number) => hcurve(HP.card.x + 72, HP.card.y, HP.sits[i].x - 32, HP.sits[i].y),
  hit: (i: number) => hcurve(HP.sits[i].x + 32, HP.sits[i].y, HP.agent.x - 56, HP.agent.y),
  order: hcurve(HP.agent.x + 56, HP.agent.y, HP.evalr.x - 40, HP.evalr.y),
  pass: hcurve(HP.evalr.x + 40, HP.evalr.y, HP.pass.x - 34, HP.pass.y),
  fail: hcurve(HP.evalr.x + 40, HP.evalr.y, HP.fail.x - 34, HP.fail.y),
  passOut: hcurve(HP.pass.x + 34, HP.pass.y, HP.report.x - 38, HP.report.y),
  failOut: hcurve(HP.fail.x + 34, HP.fail.y, HP.report.x - 38, HP.report.y),
};

function Wide({ d, lang, t, p, situations, reduce }: { d: Discipline; lang: Lang; t: T; p: number; situations: string[]; reduce: boolean }) {
  const { ref, scale } = useFit(HW, 1.1, { height: HH, reserved: 400 });
  const f = fills(p);
  const g = glows(p);

  return (
    <div ref={ref} className="w-full">
      <div className="mx-auto" style={{ width: HW * scale, height: HH * scale }}>
        <div className="relative" style={{ width: HW, height: HH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <svg className="absolute inset-0 overflow-visible" width={HW} height={HH} viewBox={`0 0 ${HW} ${HH}`} fill="none" aria-hidden>
            {situations.map((_, i) => (
              <Path key={`f${i}`} d={hw.feed(i)} fill={f.feed} dashed />
            ))}
            {situations.map((_, i) => (
              <Path key={`h${i}`} d={hw.hit(i)} fill={f.hit} color={RED} dashed />
            ))}
            <Path d={hw.order} fill={f.order} color={LIGHT} />
            <Path d={hw.pass} fill={f.result} />
            <Path d={hw.fail} fill={f.result} color={RED} />
            <Path d={hw.passOut} fill={f.out} />
            <Path d={hw.failOut} fill={f.out} color={RED} />
          </svg>

          <Heads f={f} w={hw} n={situations.length} reduce={reduce} />

          <Node x={HP.card.x} y={HP.card.y} size={144} glow={g.card} shape="rounded-[28px]">
            <span className="w-[66px] rotate-[-6deg]">
              <AgentCard discipline={d} lang={lang} sandbox />
            </span>
          </Node>
          <Caption x={HP.card.x} y={HP.card.y + 86} title={t.nodes.sandbox} sub={d.name} glow={g.card} />

          {situations.map((txt, i) => {
            const q = HP.sits[i];
            return (
              <span key={txt} className="absolute" style={{ left: q.x - 34, top: q.y - 34, width: 68, height: 68 }}>
                <Node x={34} y={34} size={64} glow={g.sit} tone="bad" shape="rounded-full">
                  <Icon>{glyph.alert}</Icon>
                </Node>
              </span>
            );
          })}
          {situations.map((txt, i) => (
            <span
              key={`l${txt}`}
              className={`pointer-events-none absolute flex w-[160px] -translate-x-1/2 justify-center text-center text-[16px] leading-[1.25] font-semibold text-balance transition-colors duration-400 ${
                g.sit === "on" ? "text-danger" : g.sit === "done" ? "text-fg/80" : "text-muted"
              } ${i === 2 ? "" : "-translate-y-full"}`}
              style={{ left: HP.sits[i].x, top: i === 2 ? HP.sits[i].y + 42 : HP.sits[i].y - 42 }}
            >
              {txt}
            </span>
          ))}

          <Node x={HP.agent.x} y={HP.agent.y} size={104} glow={g.agent} shape="rounded-t-[52px] rounded-b-[24px]">
            <Icon className="h-11 w-11">{glyph.agent}</Icon>
          </Node>
          <Caption x={HP.agent.x} y={HP.agent.y + 66} title={t.nodes.agent} glow={g.agent} />

          <Node x={HP.evalr.x} y={HP.evalr.y} size={80} glow={g.evalr}>
            <Icon className="h-8 w-8">{glyph.grader}</Icon>
          </Node>
          <Caption x={HP.evalr.x} y={HP.evalr.y + 54} title={t.nodes.evalr} sub={t.nodes.evalSub} glow={g.evalr} />

          <Node x={HP.pass.x} y={HP.pass.y} size={68} glow={g.pass} shape="rounded-full">
            <Icon>{glyph.pass}</Icon>
          </Node>
          <Caption x={HP.pass.x} y={HP.pass.y - 72} title={t.nodes.pass} glow={g.pass} w={140} />

          <Node x={HP.fail.x} y={HP.fail.y} size={68} glow={g.fail} tone="bad" shape="rounded-full">
            <Icon>{glyph.fail}</Icon>
          </Node>
          <Caption x={HP.fail.x} y={HP.fail.y + 44} title={t.nodes.fail} glow={g.fail} w={140} tone="bad" />

          <Node x={HP.report.x} y={HP.report.y} size={76} glow={g.report}>
            <Icon className="h-8 w-8">{glyph.report}</Icon>
          </Node>
          <Caption x={HP.report.x} y={HP.report.y + 50} title={t.nodes.report} sub={t.nodes.reportSub} glow={g.report} w={150} />
        </div>
      </div>
    </div>
  );
}

const VW = 400;
const VH = 990;
const VX = VW / 2;
const VP = {
  card: { x: VX, y: 80 },
  sits: [
    { x: 70, y: 260 },
    { x: VX, y: 260 },
    { x: 330, y: 260 },
  ],
  agent: { x: VX, y: 530 },
  evalr: { x: VX, y: 685 },
  pass: { x: 110, y: 815 },
  fail: { x: 290, y: 815 },
  report: { x: VX, y: 935 },
};
const SIT_LABEL = 128;
const hitFrom = (labelH?: number) => (labelH ? 30 + 8 + labelH + 10 : SIT_LABEL);
const vw = {
  feed: (i: number) => vcurve(VP.card.x, VP.card.y + 62, VP.sits[i].x, VP.sits[i].y - 30),
  hit: (i: number, labelH?: number) => vcurve(VP.sits[i].x, VP.sits[i].y + hitFrom(labelH), VP.agent.x, VP.agent.y - 50),
  order: vcurve(VP.agent.x, VP.agent.y + 50, VP.evalr.x, VP.evalr.y - 36),
  pass: vcurve(VP.evalr.x, VP.evalr.y + 36, VP.pass.x, VP.pass.y - 30),
  fail: vcurve(VP.evalr.x, VP.evalr.y + 36, VP.fail.x, VP.fail.y - 30),
  passOut: vcurve(VP.pass.x, VP.pass.y + 30, VP.report.x, VP.report.y - 32),
  failOut: vcurve(VP.fail.x, VP.fail.y + 30, VP.report.x, VP.report.y - 32),
};

function Tall({ d, lang, t, p, situations, reduce }: { d: Discipline; lang: Lang; t: T; p: number; situations: string[]; reduce: boolean }) {
  const { ref, scale } = useFit(VW, 1);
  const f = fills(p);
  const g = glows(p);

  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const [labelH, setLabelH] = useState<number[]>([]);
  useEffect(() => {
    const els = labels.current.filter((el): el is HTMLSpanElement => !!el);
    const ro = new ResizeObserver(() => setLabelH(labels.current.map((el) => el?.offsetHeight ?? 0)));
    els.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [situations]);
  const tw = useMemo(() => ({ ...vw, hit: (i: number) => vw.hit(i, labelH[i]) }), [labelH]);

  return (
    <div ref={ref} className="w-full">
      <div className="mx-auto" style={{ width: VW * scale, height: VH * scale }}>
        <div className="relative" style={{ width: VW, height: VH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <svg className="absolute inset-0 overflow-visible" width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} fill="none" aria-hidden>
            {situations.map((_, i) => (
              <Path key={`f${i}`} d={vw.feed(i)} fill={f.feed} dashed />
            ))}
            {situations.map((_, i) => (
              <Path key={`h${i}`} d={tw.hit(i)} fill={f.hit} color={RED} dashed />
            ))}
            <Path d={vw.order} fill={f.order} color={LIGHT} />
            <Path d={vw.pass} fill={f.result} />
            <Path d={vw.fail} fill={f.result} color={RED} />
            <Path d={vw.passOut} fill={f.out} />
            <Path d={vw.failOut} fill={f.out} color={RED} />
          </svg>

          <Heads f={f} w={tw} n={situations.length} reduce={reduce} />

          <Node x={VP.card.x} y={VP.card.y} size={120} glow={g.card} shape="rounded-[26px]">
            <span className="w-[54px] rotate-[-6deg]">
              <AgentCard discipline={d} lang={lang} sandbox />
            </span>
          </Node>

          {situations.map((txt, i) => {
            const q = VP.sits[i];
            const glow = g.sit;
            return (
              <span key={txt} className="absolute flex flex-col items-center" style={{ left: q.x - 61, top: q.y - 30, width: 122 }}>
                <span className="relative h-[60px] w-[60px]">
                  <Node x={30} y={30} size={60} glow={glow} tone="bad" shape="rounded-full">
                    <Icon className="h-6 w-6">{glyph.alert}</Icon>
                  </Node>
                </span>
                <span
                  ref={(el) => {
                    labels.current[i] = el;
                  }}
                  className={`mt-2 text-[14px] leading-[1.2] font-semibold text-balance ${glow === "on" ? "text-danger" : glow === "done" ? "text-fg/80" : "text-muted"}`}>{txt}</span>
              </span>
            );
          })}

          <Node x={VP.agent.x} y={VP.agent.y} size={96} glow={g.agent} shape="rounded-t-[48px] rounded-b-[22px]">
            <Icon className="h-10 w-10">{glyph.agent}</Icon>
          </Node>
          <Caption x={VP.agent.x + 130} y={VP.agent.y - 12} title={t.nodes.agent} glow={g.agent} w={120} />

          <Node x={VP.evalr.x} y={VP.evalr.y} size={72} glow={g.evalr}>
            <Icon>{glyph.grader}</Icon>
          </Node>
          <Caption x={VP.evalr.x + 120} y={VP.evalr.y - 20} title={t.nodes.evalr} sub={t.nodes.evalSub} glow={g.evalr} w={130} />

          <Node x={VP.pass.x} y={VP.pass.y} size={60} glow={g.pass} shape="rounded-full">
            <Icon>{glyph.pass}</Icon>
          </Node>
          <Caption x={VP.pass.x - 80} y={VP.pass.y - 12} title={t.nodes.pass} glow={g.pass} w={100} />

          <Node x={VP.fail.x} y={VP.fail.y} size={60} glow={g.fail} tone="bad" shape="rounded-full">
            <Icon>{glyph.fail}</Icon>
          </Node>
          <Caption x={VP.fail.x + 70} y={VP.fail.y - 12} title={t.nodes.fail} glow={g.fail} w={80} tone="bad" />

          <Node x={VP.report.x} y={VP.report.y} size={64} glow={g.report}>
            <Icon>{glyph.report}</Icon>
          </Node>
          <Caption x={VP.report.x + 110} y={VP.report.y - 12} title={t.nodes.report} glow={g.report} w={120} />
        </div>
      </div>
    </div>
  );
}

function Run({ d, lang, p, wide }: { d: Discipline; lang: Lang; p: number; wide: boolean }) {
  const t = copy[lang];
  const reduce = !!useReducedMotion();
  const situations = d.sandbox?.tests ?? [];
  return wide ? <Wide d={d} lang={lang} t={t} p={p} situations={situations} reduce={reduce} /> : <Tall d={d} lang={lang} t={t} p={p} situations={situations} reduce={reduce} />;
}

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

export function Arena() {
  const { current, run, choose, disciplines, lang } = useCase();
  const t = copy[lang];
  const wide = useWide();
  const { ref: stageRef, pin, reduce, progress } = useStage();
  const p = useProgress(progress, reduce);

  return (
    <section id="como-funciona" className="zone-light zone-fade relative scroll-mt-24 overflow-clip">
      <div className="graph-canvas pointer-events-none absolute inset-0" />

      <Stage stageRef={stageRef} pin={pin} length={2.8} className="pt-20">
        <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-14">
          <div className="text-center">
            <p className="text-[15px] font-semibold text-accent">{t.eyebrow}</p>
            <h2 className="mt-3 text-[36px] leading-[1.08] font-semibold tracking-[-0.045em] sm:text-[52px]">{t.title}</h2>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {disciplines.map((d) => {
              const on = d.id === current.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => choose(d.id)}
                  aria-pressed={on}
                  className={`flex shrink-0 items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-3 sm:gap-3 sm:py-2 sm:pr-5 sm:pl-4 transition-[border-color,background-color,transform] duration-200 ease-out active:scale-[0.97] ${
                    on ? "border-accent bg-accent/10" : "border-edge bg-panel hover:border-faint"
                  }`}
                >
                  <span className="w-[18px] shrink-0">
                    <AgentCard discipline={d} lang={lang} sandbox />
                  </span>
                  <span className={`text-[14px] font-semibold whitespace-nowrap sm:text-[15px] ${on ? "text-accent" : "text-fg"}`}>{d.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 lg:mt-8">
            <Run key={`${current.id}-${run}`} d={current} lang={lang} p={p} wide={wide} />
          </div>

          {pin && (
            <div className="mx-auto mt-6 h-1 w-40 overflow-hidden rounded-full bg-edge">
              <div className="h-full origin-left rounded-full bg-accent" style={{ transform: `scaleX(${span(p, 0, SEG.out[1])})` }} />
            </div>
          )}
        </div>
      </Stage>
    </section>
  );
}
