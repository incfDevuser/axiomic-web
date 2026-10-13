"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Lang } from "@/lib/i18n";

const PAGES = 7;
const FILE = "axiomic-informe-muestra.pdf";
const ZOOM = [
  { w: 560, label: "75 %" },
  { w: 740, label: "100 %" },
  { w: 920, label: "125 %" },
];

const copy = {
  es: {
    eyebrow: "Qué recibes",
    title: (
      <>
        Un informe con cuánto <span className="title-accent">puede perder tu agente.</span>
      </>
    ),
    lead: "Un PDF de 7 páginas: resumen, método, resultados, el caso fallido y la política que lo habría evitado.",
    download: "Descargar PDF de muestra",
    open: "Abrir en otra pestaña",
    page: "Página",
    of: "de",
    pageAlt: (n: number) => `Página ${n} del informe de muestra`,
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    thumbs: "Miniaturas",
    note: "Documento de muestra con dinero simulado · medición 09",
  },
  en: {
    eyebrow: "What you get",
    title: (
      <>
        A report on how much <span className="title-accent">your agent can lose.</span>
      </>
    ),
    lead: "A 7-page PDF: summary, method, results, the failed case and the policy that would have prevented it.",
    download: "Download sample PDF",
    open: "Open in a new tab",
    page: "Page",
    of: "of",
    pageAlt: (n: number) => `Page ${n} of the sample report`,
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    thumbs: "Thumbnails",
    note: "Sample document with simulated money · measurement 09",
  },
} satisfies Record<Lang, unknown>;

const Icon = ({ d, className = "h-[18px] w-[18px]" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const ICON = {
  download: "M12 4v11M7 10.5l5 5 5-5M5 20h14",
  external: "M14 4h6v6M20 4l-9 9M18 14v5H5V6h5",
  sidebar: "M4 5h16v14H4zM9.5 5v14",
  minus: "M6 12h12",
  plus: "M12 6v12M6 12h12",
  pdf: "M7 3h7l5 5v13H7zM14 3v5h5",
};

export function Report({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const reduce = useReducedMotion();

  const viewer = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rising } = useScroll({ target: viewer, offset: ["start end", "start 0.2"] });
  const tilt = useTransform(rising, [0, 1], [32, 0]);
  const grow = useTransform(rising, [0, 1], [0.84, 1]);
  const rise = useTransform(rising, [0, 1], [90, 0]);
  const fade = useTransform(rising, [0, 0.4, 1], [0.25, 0.9, 1]);
  const pdf = `/informe/${lang}/${FILE}`;
  const src = (n: number) => `/informe/${lang}/p${n}.png`;

  const scroller = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rail, setRail] = useState(true);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const sideways = el.scrollWidth > el.clientWidth + 1;
    const line = sideways ? el.scrollLeft + el.clientWidth * 0.5 : el.scrollTop + el.clientHeight * 0.4;
    let n = 1;
    pageRefs.current.forEach((p, i) => {
      if (p && (sideways ? p.offsetLeft : p.offsetTop) <= line) n = i + 1;
    });
    if (n === current) return;
    setCurrent(n);
    const r = railRef.current;
    const thumb = r?.querySelectorAll("li")[n - 1];
    if (r && thumb) {
      const top = thumb.offsetTop - r.clientHeight / 2 + thumb.clientHeight / 2;
      r.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    }
  };

  const goTo = (n: number) => {
    const el = scroller.current;
    const p = pageRefs.current[n - 1];
    if (!el || !p) return;
    el.scrollTo({ top: p.offsetTop - 24, behavior: reduce ? "auto" : "smooth" });
  };

  const btn = "rounded-full px-6 py-3 text-[17px] font-medium transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.97]";
  const tool =
    "flex h-8 w-8 items-center justify-center rounded-[8px] text-muted transition-[background-color,color,transform] duration-150 ease-out hover:bg-white/[0.06] hover:text-fg active:scale-[0.94] disabled:pointer-events-none disabled:opacity-30";

  return (
    <section id="informe" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-7">
            <p className="text-[15px] font-semibold text-accent">{t.eyebrow}</p>
            <h2 className="mt-3 text-[36px] leading-[1.06] font-semibold tracking-[-0.045em] text-balance sm:text-[52px]">{t.title}</h2>
            <p className="mt-5 max-w-[560px] text-[18px] leading-[1.5] text-muted">{t.lead}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <a href={pdf} download className={`${btn} inline-flex items-center gap-2 bg-accent text-on-accent shadow-[0_10px_30px_-10px_rgba(37,99,255,0.36)] hover:bg-accent-hi`}>
              <Icon d={ICON.download} />
              {t.download}
            </a>
            <a href={pdf} target="_blank" rel="noopener" className={`${btn} inline-flex items-center gap-2 border border-edge bg-panel text-fg hover:border-faint`}>
              <Icon d={ICON.external} />
              {t.open}
            </a>
          </div>
        </div>

        <div style={{ perspective: 1600 }}>
        <motion.div
          ref={viewer}
          style={reduce ? undefined : { rotateX: tilt, scale: grow, y: rise, opacity: fade, transformOrigin: "50% 0%" }}
          className="mt-12 overflow-hidden rounded-[14px] bg-panel shadow-[0_1px_2px_rgba(11,17,32,0.08),0_50px_100px_-44px_rgba(11,17,32,0.55)] ring-1 ring-edge"
        >
          <div className="flex h-12 items-center gap-2 border-b border-edge bg-panel-2/70 px-3 sm:px-4">
            <span className="mr-1 hidden gap-1.5 sm:flex">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </span>
            <button type="button" onClick={() => setRail((r) => !r)} aria-label={t.thumbs} aria-pressed={rail} className={`${tool} hidden lg:flex ${rail ? "text-fg" : ""}`}>
              <Icon d={ICON.sidebar} />
            </button>
            <span className="flex min-w-0 items-center gap-2 pl-1">
              <span className="text-danger">
                <Icon d={ICON.pdf} className="h-4 w-4" />
              </span>
              <span className="truncate text-[14px] font-medium text-fg">{FILE}</span>
            </span>

            <span className="ml-auto flex items-center gap-1">
              <span className="hidden items-center sm:flex">
                <button type="button" onClick={() => setZoom((z) => z - 1)} disabled={zoom === 0} aria-label={t.zoomOut} className={tool}>
                  <Icon d={ICON.minus} />
                </button>
                <span className="w-14 text-center text-[13px] text-muted tabular-nums">{ZOOM[zoom].label}</span>
                <button type="button" onClick={() => setZoom((z) => z + 1)} disabled={zoom === ZOOM.length - 1} aria-label={t.zoomIn} className={tool}>
                  <Icon d={ICON.plus} />
                </button>
                <span className="mx-2 h-5 w-px bg-edge" />
              </span>
              <span className="px-1 text-[13px] whitespace-nowrap text-muted tabular-nums">
                <span className="hidden sm:inline">{t.page} </span>
                <span className="text-fg">{current}</span> {t.of} {PAGES}
              </span>
              <span className="mx-2 h-5 w-px bg-edge" />
              <a href={pdf} download aria-label={t.download} className={tool}>
                <Icon d={ICON.download} />
              </a>
            </span>
          </div>

          <div className="flex sm:h-[72vh] sm:max-h-[900px] sm:min-h-[480px]">
            {rail && (
              <nav ref={railRef} aria-label={t.thumbs} className="relative hidden w-[148px] shrink-0 overflow-y-auto border-r border-edge bg-panel px-5 py-5 lg:block">
                <ol className="space-y-4">
                  {Array.from({ length: PAGES }, (_, i) => i + 1).map((n) => (
                    <li key={n}>
                      <button type="button" onClick={() => goTo(n)} aria-current={n === current ? "page" : undefined} className="group block w-full text-center">
                        <span
                          className={`relative block aspect-[1/1.414] overflow-hidden rounded-[2px] bg-white ring-offset-2 ring-offset-panel transition-[box-shadow,opacity] duration-200 ${
                            n === current ? "opacity-100 ring-2 ring-accent" : "opacity-60 ring-1 ring-edge group-hover:opacity-90"
                          }`}
                        >
                          <Image src={src(n)} alt="" fill sizes="110px" className="object-cover" />
                        </span>
                        <span className={`mt-1.5 block text-[12px] tabular-nums ${n === current ? "text-accent" : "text-faint"}`}>{n}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div ref={scroller} onScroll={onScroll} className="relative flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto bg-bg px-[9%] py-6 sm:block sm:snap-none sm:overflow-x-hidden sm:overflow-y-auto sm:px-8 sm:py-8">
              <div className="contents transition-[max-width] duration-300 ease-out sm:mx-auto sm:block sm:space-y-8" style={{ maxWidth: ZOOM[zoom].w }}>
                {Array.from({ length: PAGES }, (_, i) => i + 1).map((n) => (
                  <div
                    key={n}
                    ref={(el) => {
                      pageRefs.current[n - 1] = el;
                    }}
                    className="relative aspect-[1/1.414] w-full shrink-0 snap-center overflow-hidden rounded-[2px] bg-white shadow-[0_2px_4px_rgba(var(--shadow),calc(0.3*var(--sk))),0_18px_40px_-12px_rgba(var(--shadow),calc(0.6*var(--sk)))]"
                  >
                    <Image src={src(n)} alt={t.pageAlt(n)} fill sizes="(min-width: 1024px) 920px, 100vw" priority={n === 1} className="object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        </div>

        <p className="mt-5 text-[14px] text-faint">{t.note}</p>
      </div>
    </section>
  );
}
