"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Discipline } from "@/lib/content";
import type { Lang } from "@/lib/i18n";
import { AgentCard, CardBack } from "./AgentCard";

export function CardZoom({
  discipline,
  onClose,
  onOpenFlow,
  lang,
}: {
  discipline: Discipline | null;
  onClose: () => void;
  onOpenFlow: () => void;
  lang: Lang;
}) {
  const reduce = useReducedMotion();
  const open = discipline !== null;
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    opener.current = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => closeBtn.current?.focus(), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
      window.clearTimeout(id);
      opener.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {discipline && (
        <motion.div
          key="zoom"
          role="dialog"
          aria-modal="true"
          aria-label={lang === "es" ? `Sandbox de ${discipline.name}` : `${discipline.name} sandbox`}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-bg/80 backdrop-blur-md" />

          <motion.div
            className="relative w-[min(360px,68vw,calc((100dvh-170px)*0.63))]"
            style={{ perspective: 1400 }}
            initial={{ scale: 0.82, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 10, transition: { duration: 0.15 } }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ rotateY: reduce ? 180 : 0 }}
              animate={{ rotateY: 180 }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.15, delay: reduce ? 0 : 0.18 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative"
            >
              <div style={{ backfaceVisibility: "hidden" }}>
                <AgentCard discipline={discipline} lang={lang} sandbox />
              </div>
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <CardBack discipline={discipline} onOpenFlow={onOpenFlow} lang={lang} mode="sandbox" />
              </div>
            </motion.div>
          </motion.div>

          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="relative mt-6 rounded-full border border-edge bg-panel/80 px-5 py-2 text-[17px] text-fg backdrop-blur transition-[border-color,transform] duration-150 ease-out hover:border-faint active:scale-[0.97]"
          >
            {lang === "es" ? "Cerrar" : "Close"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
