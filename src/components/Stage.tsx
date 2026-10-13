"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, type MotionValue } from "motion/react";

function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

export function useStage() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const pin = useMedia("(min-width: 1024px) and (min-height: 640px)") && !reduce;
  const pinned = useScroll({ target: ref, offset: ["start start", "end end"] });
  const flowing = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const progress = pin ? pinned.scrollYProgress : flowing.scrollYProgress;
  return { ref, pin, reduce, progress };
}

export function useProgress(progress: MotionValue<number>, reduce: boolean) {
  const [p, setP] = useState(0);
  useMotionValueEvent(progress, "change", (v) => setP(Math.round(Math.min(Math.max(v, 0), 1) * 400) / 400));
  return reduce ? 1 : p;
}

export function Stage({
  stageRef,
  pin,
  length,
  className = "",
  children,
}: {
  stageRef: React.RefObject<HTMLDivElement | null>;
  pin: boolean;
  length: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div ref={stageRef} className="relative" style={pin ? { height: `${length * 100}vh` } : undefined}>
      <div className={pin ? `sticky top-0 flex h-screen flex-col justify-center overflow-hidden ${className}` : className}>{children}</div>
    </div>
  );
}

export const span = (p: number, from: number, to: number) => Math.min(Math.max((p - from) / (to - from), 0), 1);
