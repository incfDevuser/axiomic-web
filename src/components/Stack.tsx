"use client";

import { motion } from "motion/react";
import { money, type Lang } from "@/lib/i18n";
import { LogoMark } from "./LogoMark";
import { SpotlightGrid, useSpotlight } from "./Night";
import { Stage, span, useProgress, useStage } from "./Stage";

type Order = { label: string; amount: number; failsAt: number | null };

const copy = {
  es: {
    eyebrow: "Dónde está Axiomic",
    title: (
      <>
        Entre tu agente de IA <span className="title-accent">y tu dinero.</span>
      </>
    ),
    agent: "Tu agente de IA",
    axiomic: "Axiomic",
    gatewayTag: "Pasarela v0 · rechaza en simulación, no en producción",
    agentSub: "Con el modelo y el runtime que ya usas",
    moneySub: "Tu banco o proveedor de pagos",
    money: "Tu dinero",
    bank: "Banco",
    rules: ["Cuenta registrada", "Factura aprobada", "Monto correcto"],
    orders: [
      { label: "Factura F-1042", amount: 180000, failsAt: null },
      { label: "Cuenta sin registrar", amount: 450000, failsAt: 0 },
      { label: "Factura F-1043", amount: 95000, failsAt: null },
      { label: "Pago mayor a lo adeudado", amount: 620000, failsAt: 2 },
    ] satisfies Order[],
    rejected: "Rechazada en simulación",
    approved: "Aprobada",
    sample: "Órdenes ilustrativas · dinero simulado",
    today: { tag: "Hoy", title: "Lo probamos antes de lanzar", body: "Tu agente opera en un sandbox con dinero simulado y te decimos cuánto podría perder." },
    next: { tag: "Próximo", title: "Revisará cada pago real", body: "La pasarela aplicará las mismas reglas a cada orden, antes de que llegue al banco. Hoy solo rechaza órdenes en simulación." },
    building: "En construcción",
  },
  en: {
    eyebrow: "Where Axiomic sits",
    title: (
      <>
        Between your AI agent <span className="title-accent">and your money.</span>
      </>
    ),
    agent: "Your AI agent",
    axiomic: "Axiomic",
    gatewayTag: "Gateway v0 · rejects in simulation, not in production",
    agentSub: "With the model and runtime you already use",
    moneySub: "Your bank or payment provider",
    money: "Your money",
    bank: "Bank",
    rules: ["Registered account", "Approved invoice", "Right amount"],
    orders: [
      { label: "Invoice F-1042", amount: 180000, failsAt: null },
      { label: "Unregistered account", amount: 450000, failsAt: 0 },
      { label: "Invoice F-1043", amount: 95000, failsAt: null },
      { label: "Paying more than owed", amount: 620000, failsAt: 2 },
    ] satisfies Order[],
    rejected: "Rejected in simulation",
    approved: "Approved",
    sample: "Illustrative orders · simulated money",
    today: { tag: "Today", title: "We test it before launch", body: "Your agent runs in a sandbox with simulated money and we tell you how much it could lose." },
    next: { tag: "Next", title: "It will check every real payment", body: "The gateway will apply the same rules to every order, before it reaches the bank. Today it only rejects orders in simulation." },
    building: "In development",
  },
} satisfies Record<Lang, unknown>;

const TRAVEL_END = 0.3;
const CHECK_END = 0.66;

function Icon({ children, className = "h-7 w-7" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const glow = "0 0 0 10px rgba(37,99,255,0.056), 0 0 60px rgba(37,99,255,0.28)";

export function Stack({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const { ref: stageRef, pin, reduce, progress } = useStage();
  const p = useProgress(progress, reduce);
  const spot = useSpotlight();

  const count = t.orders.length;
  const at = Math.min(p, 0.999) * count;
  const n = Math.floor(at);
  const local = at - n;
  const order = t.orders[n];
  const fails = order.failsAt !== null;
  const stopAt = order.failsAt ?? t.rules.length - 1;
  const phase = local < TRAVEL_END ? "travel" : local < CHECK_END ? "check" : "out";
  const checked = phase === "travel" ? -1 : phase === "out" ? stopAt : Math.min(stopAt, Math.floor(span(local, TRAVEL_END, CHECK_END) * (stopAt + 1.4)) - 0);

  const ruleState = (i: number): "idle" | "ok" | "bad" => {
    if (reduce) return "ok";
    if (phase === "travel" || i > checked) return "idle";
    return fails && i === order.failsAt ? "bad" : "ok";
  };
  const checking = phase === "check";
  const reached = phase === "out" && !fails;
  const stopped = phase === "out" && fails;
  const along = phase === "travel" ? 50 * span(local, 0, TRAVEL_END) : phase === "check" || fails ? 50 : 50 + 50 * span(local, CHECK_END, 0.92);
  const rules = t.rules.map((r, i) => {
    const st = ruleState(i);
    return (
      <li key={r} className={`flex items-center gap-2.5 text-[15px] font-semibold whitespace-nowrap transition-colors duration-200 sm:text-[16px] lg:text-[17px] ${st === "bad" ? "text-danger" : st === "ok" ? "text-fg" : "text-faint"}`}>
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] transition-[background-color,border-color,color] duration-200 ${
            st === "bad" ? "border-danger bg-danger text-on-danger shadow-[0_0_14px_rgba(255,255,255,0.6)]" : st === "ok" ? "border-accent bg-accent text-on-accent" : "border-white/15 text-transparent"
          }`}
        >
          {st === "bad" ? "✕" : "✓"}
        </span>
        {r}
      </li>
    );
  });

  return (
    <section
      id="infraestructura"
      onPointerMove={spot.onPointerMove}
      onPointerLeave={spot.onPointerLeave}
      className={`night-field relative scroll-mt-24 overflow-clip pb-24 sm:pb-32 ${pin ? "" : "pt-24 sm:pt-32"}`}
    >
      <Stage stageRef={stageRef} pin={pin} length={2.8} className="pt-16">
      <SpotlightGrid gridRef={spot.grid} />
      <div aria-hidden className="pointer-events-none absolute top-[55%] left-1/2 h-[480px] w-[900px] max-w-[110vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(61,123,255,0.1),transparent)] blur-2xl" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-14">
        <div className="text-center">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[14px] font-medium text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(61,123,255,0.9)]" />
            {t.eyebrow}
          </p>
          <h2 className="hero-ink mt-5 text-[36px] leading-[1.08] font-semibold tracking-[-0.045em] sm:text-[52px]">{t.title}</h2>
        </div>

        <div className="relative mx-auto mt-16 max-w-[1100px]">
          <div className="absolute top-[88px] right-[16.66%] left-[16.66%] h-px bg-white/[0.1] sm:top-[96px] lg:top-[108px]">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-colors duration-300 ${stopped ? "bg-danger" : "bg-accent"}`}
              style={{ width: `${along}%`, boxShadow: `0 0 10px ${stopped ? "var(--danger)" : "var(--accent)"}` }}
            />
            {!reduce && local > 0.02 && (
              <span className={`absolute top-1/2 ${stopped ? "z-20" : ""}`} style={{ left: `${stopped ? 40 : along}%` }}>
                {stopped ? (
                  <motion.span
                    key={`x${n}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, x: [0, -6, 6, -3, 0] }}
                    transition={{ duration: 0.4 }}
                    className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-danger text-[13px] font-bold text-on-danger shadow-[0_0_0_4px_var(--bg),0_0_22px_var(--danger)]"
                  >
                    ✕
                  </motion.span>
                ) : (
                  <span className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_20%,transparent),0_0_18px_var(--accent)]" />
                )}
              </span>
            )}
          </div>

          <div className="relative grid grid-cols-3 pt-[48px]">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-[80px] w-[80px] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_48px_-28px_rgba(0,0,0,0.95)] backdrop-blur-md sm:h-[96px] sm:w-[96px] lg:h-[120px] lg:w-[120px]">
                <Icon className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                  <path d="M12 3v3M7 8h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM9.5 13h.01M14.5 13h.01M9.5 16.5h5" />
                </Icon>
              </span>
              <p className="mt-4 text-[16px] font-semibold sm:text-[20px] lg:text-[22px]">{t.agent}</p>
              <p className="mt-2 max-w-[220px] text-[13px] leading-[1.35] text-faint sm:text-[15px]">{t.agentSub}</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <span
                className={`flex h-[80px] w-[80px] items-center justify-center rounded-[24px] border-2 bg-white transition-[border-color,box-shadow] duration-300 sm:h-[96px] sm:w-[96px] lg:h-[120px] lg:w-[120px] ${
                  stopped ? "border-danger" : checking ? "border-accent" : "border-accent/60"
                }`}
                style={{ boxShadow: checking ? glow : stopped ? "0 0 50px color-mix(in srgb, var(--danger) 30%, transparent)" : undefined }}
              >
                <LogoMark className="h-12 w-12 sm:h-14 sm:w-14 lg:h-[72px] lg:w-[72px]" />
              </span>
              <p className="mt-4 text-[16px] font-semibold sm:text-[20px] lg:text-[22px]">{t.axiomic}</p>
              <p className="mt-1 min-h-[2.6rem] w-full px-1 text-[12px] leading-[1.3] text-balance text-faint sm:h-5 sm:min-h-0 sm:w-auto sm:px-0 sm:text-[14px] sm:whitespace-nowrap">
                {!reduce && (
                  <motion.span key={n} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="inline-block">
                    <span className="hidden sm:inline">{order.label} · </span>
                    {money(lang, order.amount)}
                    {stopped && <span className="font-semibold text-danger"> · {t.rejected}</span>}
                    {reached && <span className="font-semibold text-accent"> · {t.approved}</span>}
                  </motion.span>
                )}
              </p>
              <ul className="mt-4 hidden space-y-2 text-left sm:block">{rules}</ul>
              <p className="mt-4 hidden max-w-[260px] text-[13px] leading-[1.35] text-faint sm:block">{t.gatewayTag}</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <span
                className={`flex h-[80px] w-[80px] items-center justify-center rounded-full border bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-[border-color,color] duration-300 sm:h-[96px] sm:w-[96px] lg:h-[120px] lg:w-[120px] ${reached ? "border-accent text-accent-hi" : "border-white/10 text-white/80"}`}
                style={{ boxShadow: reached ? glow : undefined }}
              >
                <Icon className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                  <path d="M4 10h16M6 10v7M10 10v7M14 10v7M18 10v7M3 20h18M12 3l9 5H3z" />
                </Icon>
              </span>
              <p className="mt-4 text-[16px] font-semibold sm:text-[20px] lg:text-[22px]">{t.money}</p>
              <p className="mt-2 max-w-[220px] text-[13px] leading-[1.35] text-faint sm:text-[15px]">{t.moneySub}</p>
            </div>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2.5 sm:hidden">{rules}</ul>
          <p className="mt-8 text-center text-[13px] text-faint">
            <span className="sm:hidden">{t.gatewayTag} · </span>
            {t.sample}
          </p>
        </div>

      </div>
      </Stage>
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-14">
        <div className="mx-auto mt-20 grid max-w-[1100px] gap-10 border-t border-white/[0.08] pt-10 sm:grid-cols-2 sm:gap-14">
          {[
            { ...t.today, live: true },
            { ...t.next, live: false },
          ].map((x) => (
            <div key={x.tag}>
              <p className="flex items-center gap-2 text-[15px] font-semibold">
                <span className={`h-2 w-2 rounded-full ${x.live ? "breathe bg-accent shadow-[0_0_10px_rgba(61,123,255,0.9)]" : "border border-white/30"}`} />
                <span className={x.live ? "text-accent-hi" : "text-muted"}>{x.tag}</span>
                {!x.live && <span className="text-faint">· {t.building}</span>}
              </p>
              <p className="mt-3 text-[24px] leading-[1.2] font-semibold tracking-[-0.02em] text-white sm:text-[28px]">{x.title}</p>
              <p className="mt-2 text-[17px] leading-[1.5] text-muted">{x.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
