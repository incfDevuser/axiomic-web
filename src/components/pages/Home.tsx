import { Arena } from "@/components/Arena";
import { CaseProvider } from "@/components/CaseContext";
import { Closing } from "@/components/Closing";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Pilot } from "@/components/Pilot";
import { Problem } from "@/components/Problem";
import { Report } from "@/components/Report";
import { Stack } from "@/components/Stack";
import { otherLang, routes, type Lang } from "@/lib/i18n";

export function Home({ lang }: { lang: Lang }) {
  return (
    <>
      <Nav lang={lang} alt={routes.home[otherLang(lang)]} />
      <main className="overflow-x-clip">
        <CaseProvider lang={lang}>
          <Hero />
          <Problem lang={lang} />
          <Arena />
        </CaseProvider>
        <Report lang={lang} />
        <Stack lang={lang} />
        <Pilot lang={lang} />
        <Closing lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
