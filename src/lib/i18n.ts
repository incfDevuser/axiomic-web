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

export const CLP_PER_USD = 1000;
export const toLocal = (lang: Lang, clp: number) => (lang === "es" ? clp : clp / CLP_PER_USD);
export const moneyShort = (lang: Lang, clp: number) => (lang === "es" ? fmt(lang, clp) : `$${fmt(lang, Math.round(toLocal(lang, clp)))}`);
export const money = (lang: Lang, clp: number) => (lang === "es" ? `${fmt(lang, clp)} CLP` : moneyShort(lang, clp));
export const currency = (lang: Lang) => (lang === "es" ? "CLP" : "USD");

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://axiomic.cl";
