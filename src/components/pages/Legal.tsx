import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { contactEmail } from "@/lib/content";
import { otherLang, routes, type Lang } from "@/lib/i18n";

type Doc = { eyebrow: string; title: string; lead: string; updated: string; sections: { title: string; body: string }[] };

const UPDATED = { es: "Actualizado el 13 de octubre de 2026", en: "Last updated October 13, 2026" };

const privacy: Record<Lang, Doc> = {
  es: {
    eyebrow: "Privacidad",
    title: "Qué datos usamos y para qué.",
    lead: "Pedimos lo mínimo para responderte. No vendemos datos y no usamos cookies de seguimiento ni publicidad.",
    updated: UPDATED.es,
    sections: [
      { title: "Responsable", body: `Axiomic, con base en Santiago, Chile. Cuando la sociedad esté constituida, actualizaremos este punto con su razón social y RUT. Para cualquier consulta sobre tus datos escríbenos a ${contactEmail}.` },
      { title: "Qué recogemos", body: "Si nos escribes por el formulario: tu nombre, empresa, correo y el flujo que quieres probar. Nuestro proveedor de hosting registra datos técnicos (como dirección IP y navegador) para operar y proteger el sitio, y usamos la dirección IP para limitar envíos repetidos del formulario." },
      { title: "Para qué y con qué base", body: "Para responder tu solicitud y coordinar un piloto. La base es tu consentimiento, que entregas al enviar el formulario, y nuestro interés legítimo en operar y proteger el sitio. No usamos tus datos para publicidad ni se los vendemos a nadie." },
      { title: "Con quién los compartimos", body: "Solo con los proveedores que nos ayudan a operar el sitio y enviar correos, y únicamente para esos fines: el proveedor de hosting del sitio y Resend, que entrega el correo del formulario." },
      { title: "Transferencias internacionales", body: "Esos proveedores procesan datos en servidores fuera de Chile, principalmente en Estados Unidos. Lo hacen bajo contrato, con obligaciones de confidencialidad y seguridad, y solo para prestarnos el servicio." },
      { title: "Durante un piloto", body: "No pedimos credenciales de producción ni datos reales de tus clientes. Los escenarios usan datos sintéticos. Lo que compartas para configurar la prueba se rige por el acuerdo del piloto." },
      { title: "Cuánto tiempo", body: "Conservamos los datos del formulario mientras tengamos una conversación comercial activa y hasta 24 meses después del último contacto, o antes si nos pides borrarlos. Los registros técnicos del hosting se conservan según la política de ese proveedor." },
      { title: "Tus derechos", body: `Conforme a la Ley 19.628 y, desde el 1 de diciembre de 2026, a la Ley 21.719 que la modifica, puedes pedir acceso, rectificación, supresión, oposición y portabilidad de tus datos, y revocar tu consentimiento, escribiendo a ${contactEmail}. Respondemos dentro de los plazos legales. También puedes reclamar ante la Agencia de Protección de Datos Personales cuando entre en funciones.` },
    ],
  },
  en: {
    eyebrow: "Privacy",
    title: "What data we use, and why.",
    lead: "We ask for the minimum needed to get back to you. We don't sell data and we don't use tracking or advertising cookies.",
    updated: UPDATED.en,
    sections: [
      { title: "Who is responsible", body: `Axiomic, based in Santiago, Chile. Once the company is incorporated we will update this section with its legal name and tax ID. For any question about your data, email ${contactEmail}.` },
      { title: "What we collect", body: "If you write to us through the form: your name, company, email and the flow you want to test. Our hosting provider logs technical data (such as IP address and browser) to run and protect the site, and we use the IP address to limit repeated form submissions." },
      { title: "What for, and on what basis", body: "To answer your request and set up a pilot. The basis is your consent, given when you submit the form, and our legitimate interest in running and protecting the site. We don't use your data for advertising and we don't sell it to anyone." },
      { title: "Who we share it with", body: "Only with the providers that help us run the site and send email, and only for those purposes: the site's hosting provider and Resend, which delivers the form email." },
      { title: "International transfers", body: "Those providers process data on servers outside Chile, mainly in the United States. They do so under contract, with confidentiality and security obligations, and only to provide the service to us." },
      { title: "During a pilot", body: "We never ask for production credentials or real customer data. Scenarios use synthetic data. Anything you share to configure the test is covered by the pilot agreement." },
      { title: "How long", body: "We keep form data while we have an active business conversation and for up to 24 months after the last contact, or sooner if you ask us to delete it. Hosting logs are kept according to that provider's policy." },
      { title: "Your rights", body: `Under Chile's Law 19.628 and, from December 1, 2026, Law 21.719 which amends it, you can request access to, correction, deletion or portability of your data, object to its use, and withdraw your consent by emailing ${contactEmail}. We reply within the legal deadlines. You can also file a complaint with Chile's Personal Data Protection Agency once it is operating.` },
    ],
  },
};

const security: Record<Lang, Doc> = {
  es: {
    eyebrow: "Seguridad",
    title: "Probamos agentes sin tocar tu plata ni tus clientes.",
    lead: "Así está diseñada la prueba para que conectar tu agente no agregue riesgo.",
    updated: UPDATED.es,
    sections: [
      {
        title: "Nunca hay dinero real",
        body: "Axiomic no custodia ni mueve dinero. Las pruebas corren contra bancos y proveedores simulados, o contra proveedores reales en su modo de prueba (sandbox), como Flow y Mercado Pago.",
      },
      {
        title: "Sin credenciales de producción",
        body: "Tu agente se conecta con un token que sirve solo para ese episodio de prueba. Nunca pedimos claves, tokens ni accesos a tus sistemas de producción.",
      },
      { title: "Sin datos reales de clientes", body: "Facturas, proveedores, cuentas y correos de los escenarios son sintéticos. No necesitamos datos de tus clientes para medir a tu agente." },
      {
        title: "Todo queda registrado",
        body: "Cada episodio guarda su transcripción completa y se puede reproducir igual. Sabes exactamente qué vio y qué hizo tu agente durante la prueba.",
      },
      {
        title: "Reporta un problema",
        body: `Si encuentras una vulnerabilidad en nuestro sitio o en la prueba, escríbenos a ${contactEmail}. Respondemos y te avisamos cuando esté corregida.`,
      },
    ],
  },
  en: {
    eyebrow: "Security",
    title: "We test agents without touching your money or your customers.",
    lead: "How the test is designed so that connecting your agent adds no risk.",
    updated: UPDATED.en,
    sections: [
      {
        title: "Never real money",
        body: "Axiomic does not hold or move money. Tests run against simulated banks and providers, or against real providers in their test mode (sandbox), such as Flow and Mercado Pago.",
      },
      {
        title: "No production credentials",
        body: "Your agent connects with a token that only works for that test episode. We never ask for keys, tokens or access to your production systems.",
      },
      { title: "No real customer data", body: "Invoices, suppliers, accounts and emails in the scenarios are synthetic. We don't need your customers' data to measure your agent." },
      {
        title: "Everything is recorded",
        body: "Every episode keeps its full transcript and can be replayed exactly. You know precisely what your agent saw and did during the test.",
      },
      {
        title: "Report an issue",
        body: `If you find a vulnerability in our site or in the test, email ${contactEmail}. We'll reply and let you know once it's fixed.`,
      },
    ],
  },
};

const docs = { privacy, security };

export function LegalPage({ lang, doc }: { lang: Lang; doc: keyof typeof docs }) {
  const t = docs[doc][lang];
  return (
    <>
      <Nav lang={lang} alt={routes[doc][otherLang(lang)]} />
      <main className="mx-auto max-w-4xl px-5 pt-36 pb-24 sm:px-8 sm:pt-44">
        <p className="font-semibold  text-[15px] text-accent">{t.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-[40px] leading-[1.03] font-semibold tracking-[-0.045em] text-balance sm:text-[56px]">{t.title}</h1>
        <p className="mt-6 max-w-2xl text-[20px] leading-[1.6] text-muted">{t.lead}</p>
        <p className="font-semibold mt-4 text-[14px] text-faint">{t.updated}</p>

        <div className="mt-16 space-y-10">
          {t.sections.map((s) => (
            <section key={s.title} className="border-t border-edge pt-8">
              <h2 className="flex items-start gap-3 text-[22px] leading-[1.2] font-semibold tracking-[-0.02em]">
                <span className="mt-[0.5em] h-2 w-2 shrink-0 rounded-full bg-accent" />
                {s.title}
              </h2>
              <p className="mt-3 max-w-2xl pl-7 text-[18px] leading-[1.65] text-muted">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}

export const legalMeta = {
  privacy: { es: { title: "Privacidad · Axiomic", description: privacy.es.lead }, en: { title: "Privacy · Axiomic", description: privacy.en.lead } },
  security: { es: { title: "Seguridad · Axiomic", description: security.es.lead }, en: { title: "Security · Axiomic", description: security.en.lead } },
};
