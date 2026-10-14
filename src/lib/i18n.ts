export type Lang = "es" | "en";

export const routes = {
  home: { es: "/", en: "/en" },
  methodology: { es: "/metodologia", en: "/en/methodology" },
  privacy: { es: "/privacidad", en: "/en/privacy" },
  security: { es: "/seguridad", en: "/en/security" },
} as const;

export type RouteKey = keyof typeof routes;

export const otherLang = (lang: Lang): Lang => (lang === "es" ? "en" : "es");

export const homeAnchor = (lang: Lang, id: string) => `${lang === "es" ? "/" : "/en"}#${id}`;

export const fmt = (lang: Lang, n: number) => new Intl.NumberFormat(lang === "es" ? "es-CL" : "en-US").format(n);

// Simulated amounts stay in CLP in both languages (no USD conversion).
export const moneyShort = (lang: Lang, clp: number) => fmt(lang, clp);
export const money = (lang: Lang, clp: number) => `${fmt(lang, clp)} CLP`;
export const currency = () => "CLP";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://axiomic.cl";
