"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { getDisciplines, REAL_CASE_ID, type Discipline } from "@/lib/content";
import type { Lang } from "@/lib/i18n";

type CaseState = { lang: Lang; disciplines: Discipline[]; current: Discipline; run: number; choose: (id: string) => void };

const CaseContext = createContext<CaseState | null>(null);

export function CaseProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const disciplines = useMemo(() => getDisciplines(lang), [lang]);
  const [id, setId] = useState(REAL_CASE_ID);
  const [run, setRun] = useState(0);
  const current = disciplines.find((d) => d.id === id) ?? disciplines[0];
  const choose = (next: string) => {
    setId(next);
    setRun((r) => r + 1);
  };
  return <CaseContext.Provider value={{ lang, disciplines, current, run, choose }}>{children}</CaseContext.Provider>;
}

export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCase must be used inside <CaseProvider>");
  return ctx;
}
