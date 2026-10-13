import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { fmt, toLocal, otherLang, routes, type Lang } from "@/lib/i18n";

const copy = {
  es: {
    eyebrow: "Metodología",
    title: (
      <>
        Cómo medimos lo que arriesga <span className="title-accent">un agente.</span>
      </>
    ),
    lead: "El agente opera en un mundo financiero simulado: banco, proveedores, facturas, correos, fallas de red, fraudes e instrucciones hostiles. Cada episodio se califica y se convierte en una cifra en pesos.",
    numbers: [
      { v: "430", k: "episodios calificados con DeepSeek, Claude Haiku y Sonnet, y GPT-6 Luna, más 6 mundos compartidos entre agentes" },
      { v: "423", k: "controles programados y verificados que comprueban que nuestro evaluador detecta lo que dice detectar" },
      { v: "48", k: "episodios en la medición 09, preregistrada, con tres modelos comerciales" },
    ],
    sections: [
      {
        title: "Cada medición se preregistra",
        body: "Antes de correr congelamos las reglas, los escenarios, el presupuesto y el código. Así nadie ajusta la prueba después de ver el resultado.",
      },
      {
        title: "Cada episodio se puede reproducir",
        body: "Guardamos la transcripción completa y el comando para repetir el episodio exactamente igual. Si una falla aparece en el informe, se puede volver a ver.",
      },
      {
        title: "Auditamos también a nuestro evaluador",
        body: "Separamos lo que es de tu configuración, de tu agente o de nuestras instrucciones. Revisando nuestras propias mediciones corregimos 15 ambigüedades en nuestras instrucciones, para que cada falla que reportamos sea del agente y no de la prueba.",
      },
      {
        title: "Proveedores reales, en modo de prueba",
        body: "Además del banco simulado, probamos contra Flow y Mercado Pago en sus sandbox. En ambos, un texto hostil dirigido a agentes llega intacto al pago que lee el agente.",
      },
    ],
    riskTitle: "Cómo calculamos el riesgo por millón",
    riskBody: "Sumamos lo que el agente habría perdido en todos los episodios y lo dividimos por el total que le delegamos. Caso medido, con dinero simulado: en la medición 09, un episodio perdió 990.000 CLP de 16 episodios con 1.000.000 CLP cada uno.",
    perMillion: "CLP por millón",
    disciplinesTitle: "Disciplinas de prueba",
    disciplines: [
      "Transferencias",
      "Incidentes de pago: cobros duplicados y devoluciones",
      "Pagos asíncronos con instrucciones hostiles inyectadas",
      "Dinero compartido entre dos agentes",
      "Cuentas por pagar con presupuesto delegado de 100.000 a 1.000.000 CLP",
    ],
    notTitle: "Lo que no afirmamos",
    notBody:
      "Medimos en tareas conocidas, así que no publicamos tasas generales por modelo. Un resultado aprobado describe lo que hizo el agente en esos escenarios, no que sea seguro en general. El simulador acepta cuentas arbitrarias, sin validación bancaria, y la política del Gateway es una propuesta que todavía no se ejecuta. No somos certificador ni regulador, y no movemos dinero real.",
  },
  en: {
    eyebrow: "Methodology",
    title: (
      <>
        How we measure what an agent <span className="title-accent">puts at risk.</span>
      </>
    ),
    lead: "The agent operates in a simulated financial world: bank, suppliers, invoices, emails, network failures, fraud and hostile instructions. Every episode is graded and turned into a figure in pesos.",
    numbers: [
      { v: "430", k: "episodes graded across DeepSeek, Claude Haiku and Sonnet, and GPT-6 Luna, plus 6 worlds shared between agents" },
      { v: "423", k: "automated, verified checks that prove our grader catches what it claims to catch" },
      { v: "48", k: "episodes in measurement 09, pre-registered, across three commercial models" },
    ],
    sections: [
      {
        title: "Every measurement is pre-registered",
        body: "Before running we freeze the rules, the scenarios, the budget and the code. Nobody gets to tune the test after seeing the result.",
      },
      {
        title: "Every episode can be replayed",
        body: "We keep the full transcript and the command to replay the episode exactly. If a failure is in the report, you can watch it again.",
      },
      {
        title: "We audit our own grader too",
        body: "We separate what comes from your configuration, from your agent, or from our instructions. Reviewing our own measurements we fixed 15 ambiguities in our instructions, so every failure we report belongs to the agent and not to the test.",
      },
      {
        title: "Real providers, in test mode",
        body: "Besides the simulated bank, we test against Flow and Mercado Pago in their sandboxes. In both, hostile text aimed at agents reaches the payment the agent reads, intact.",
      },
    ],
    riskTitle: "How we compute risk per million",
    riskBody: "We add up what the agent would have lost across all episodes and divide it by the total we delegated. Measured case, with simulated money: in measurement 09, one episode lost $990 out of 16 episodes of $1,000 each.",
    perMillion: "USD per million",
    disciplinesTitle: "Test disciplines",
    disciplines: [
      "Transfers",
      "Payment incidents: duplicate charges and refunds",
      "Async payments with injected hostile instructions",
      "Money shared between two agents",
      "Accounts payable with a delegated budget of $100 to $1,000",
    ],
    notTitle: "What we don't claim",
    notBody:
      "We measure on known tasks, so we don't publish general failure rates per model. A passing result describes what the agent did in those scenarios, not that it is safe in general. The simulator accepts arbitrary accounts with no bank validation, and the Gateway policy is a proposal that does not run yet. We are not a certifier or a regulator, and we don't move real money.",
  },
} satisfies Record<Lang, unknown>;

export function Methodology({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const f = (n: number) => fmt(lang, n);
  return (
    <>
      <Nav lang={lang} alt={routes.methodology[otherLang(lang)]} />
      <main className="mx-auto max-w-4xl px-5 pt-36 pb-24 sm:px-8 sm:pt-44">
        <p className="font-semibold  text-[15px] text-accent">{t.eyebrow}</p>
        <h1 className="mt-3 text-[40px] leading-[1.03] font-semibold tracking-[-0.045em] text-balance sm:text-[64px]">{t.title}</h1>
        <p className="mt-6 max-w-2xl text-[20px] leading-[1.6] text-muted">{t.lead}</p>

        <dl className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-0">
          {t.numbers.map((n, i) => (
            <div key={n.v} className={`sm:px-6 ${i > 0 ? "sm:border-l sm:border-edge" : "sm:pl-0"}`}>
              <dt className="text-[44px] leading-none font-semibold tracking-[-0.03em] text-accent">{n.v}</dt>
              <dd className="mt-3 text-[17px] leading-[1.5] text-muted">{n.k}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 space-y-12">
          {t.sections.map((s) => (
            <Block key={s.title} title={s.title}>
              <p className="mt-3 max-w-2xl pl-7 text-[18px] leading-[1.65] text-muted">{s.body}</p>
            </Block>
          ))}

          <Block title={t.riskTitle}>
            <p className="mt-3 max-w-2xl pl-7 text-[18px] leading-[1.65] text-muted">{t.riskBody}</p>
            <p className="mt-5 pl-7 font-mono text-[17px] text-fg">
              {f(toLocal(lang, 990000))} ÷ (16 × {f(toLocal(lang, 1000000))}) × {f(1000000)} = <span className="text-accent">{f(61875)} {t.perMillion}</span>
            </p>
          </Block>

          <Block title={t.disciplinesTitle}>
            <ul className="mt-4 space-y-2 pl-7 text-[18px] leading-[1.6] text-muted">
              {t.disciplines.map((d) => (
                <li key={d}>· {d}</li>
              ))}
            </ul>
          </Block>

          <Block title={t.notTitle}>
            <p className="mt-3 max-w-2xl pl-7 text-[18px] leading-[1.65] text-muted">{t.notBody}</p>
          </Block>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-edge pt-8">
      <h2 className="flex items-start gap-3 text-[24px] leading-[1.2] font-semibold tracking-[-0.02em]">
        <span className="mt-[0.5em] h-2 w-2 shrink-0 rounded-full bg-accent" />
        {title}
      </h2>
      {children}
    </section>
  );
}
