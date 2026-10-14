import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Lang } from "./i18n";

export const ogSize = { width: 1200, height: 630 };

const copy = {
  es: {
    title: "La infraestructura financiera para agentes de IA.",
    line: "Le delegamos 1.000.000 CLP simulados a un agente. Mandó 990.000 a cuentas que no existen.",
  },
  en: {
    title: "Financial infrastructure for AI agents.",
    line: "We gave an AI agent 1,000,000 CLP in simulated money. It sent 990,000 to accounts that don't exist.",
  },
};

export async function ogImage(lang: Lang) {
  const t = copy[lang];
  const mark = await readFile(join(process.cwd(), "public/brand/axiomic-mark.png"));
  const logo = `data:image/png;base64,${mark.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffffff", color: "#0b1120", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 600, letterSpacing: -1.5 }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={logo} width={64} height={64} />
          axiomic
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, maxWidth: 1000 }}>{t.title}</div>
          <div style={{ display: "flex", fontSize: 30, color: "#334155", maxWidth: 980, lineHeight: 1.35 }}>{t.line}</div>
        </div>
        <div style={{ display: "flex", height: 6, width: 160, background: "#2563ff", borderRadius: 3 }} />
      </div>
    ),
    ogSize,
  );
}
