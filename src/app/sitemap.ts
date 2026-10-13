import type { MetadataRoute } from "next";
import { routes, siteUrl } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routes).flatMap((r) =>
    (["es", "en"] as const).map((lang) => ({
      url: `${siteUrl}${r[lang]}`,
      alternates: { languages: { "es-CL": `${siteUrl}${r.es}`, en: `${siteUrl}${r.en}` } },
    })),
  );
}
