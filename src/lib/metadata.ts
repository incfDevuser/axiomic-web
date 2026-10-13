import type { Metadata, Viewport } from "next";
import { routes, siteUrl, type Lang, type RouteKey } from "./i18n";

export const viewport: Viewport = { themeColor: "#0b1120" };

export function pageMeta(lang: Lang, key: RouteKey, title: string, description: string): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: routes[key][lang],
      languages: { "es-CL": routes[key].es, en: routes[key].en, "x-default": routes[key].es },
    },
    openGraph: {
      type: "website",
      siteName: "Axiomic",
      locale: lang === "es" ? "es_CL" : "en_US",
      url: routes[key][lang],
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const homeMeta = {
  es: {
    title: "Axiomic · La infraestructura financiera para agentes de IA",
    description:
      "Axiomic es la infraestructura financiera para agentes de IA: evaluamos en pesos cuánto arriesga un agente antes de delegarle dinero y construimos el Gateway que autorizará cada orden.",
  },
  en: {
    title: "Axiomic · Financial infrastructure for AI agents",
    description:
      "Axiomic is financial infrastructure for AI agents: we measure in pesos how much an agent puts at risk before you delegate money to it, and we are building the Gateway that will authorize every order.",
  },
};
