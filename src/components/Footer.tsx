import Link from "next/link";
import { contactEmail } from "@/lib/content";
import { routes, type Lang } from "@/lib/i18n";
import { LogoMark } from "./LogoMark";

const copy = {
  es: {
    disclaimer:
      "Axiomic no custodia ni mueve dinero real: las pruebas usan bancos y proveedores simulados o en modo de prueba. No somos certificador ni una entidad regulada. Un resultado aprobado describe lo que hizo el agente en esos escenarios, no que sea seguro en general.",
    links: [
      { href: routes.methodology.es, label: "Metodología" },
      { href: routes.security.es, label: "Seguridad" },
      { href: routes.privacy.es, label: "Privacidad" },
    ],
    place: "Santiago, Chile",
  },
  en: {
    disclaimer:
      "Axiomic does not hold or move real money: tests run against simulated banks and providers, or providers in test mode. We are not a certifier or a regulated entity. A passing result describes what the agent did in those scenarios, not that it is safe in general.",
    links: [
      { href: routes.methodology.en, label: "Methodology" },
      { href: routes.security.en, label: "Security" },
      { href: routes.privacy.en, label: "Privacy" },
    ],
    place: "Santiago, Chile",
  },
} satisfies Record<Lang, unknown>;

export function Footer({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return (
    <footer className="border-t border-white/[0.06] bg-[#04060b]">
      <div className="mx-auto max-w-[1400px] px-6 py-12 text-[15px] leading-[1.6] text-white/40 lg:px-14">
        <p className="max-w-3xl">{t.disclaimer}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Link href={routes.home[lang]} className="flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.02em] text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-white">
              <LogoMark className="h-6 w-6" />
            </span>
            axiomic
          </Link>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {t.links.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
            <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-white">
              {contactEmail}
            </a>
            <span>{t.place}</span>
            <span>© 2026 Axiomic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
