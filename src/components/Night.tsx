"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";

/** Dot grid that only shows around the mouse ("Linear de noche"). Attach the handlers to the section. */
export function useSpotlight() {
  const grid = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse" || !grid.current) return;
    const r = (grid.current.offsetParent ?? e.currentTarget).getBoundingClientRect();
    grid.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    grid.current.style.setProperty("--my", `${e.clientY - r.top}px`);
    grid.current.style.opacity = "1";
  };
  const onPointerLeave = () => {
    if (grid.current) grid.current.style.opacity = "0";
  };
  return { grid, onPointerMove, onPointerLeave };
}

export function SpotlightGrid({ gridRef }: { gridRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <>
      <div aria-hidden className="hero-grid-static" />
      <div aria-hidden ref={gridRef} className="hero-grid opacity-0" />
    </>
  );
}
