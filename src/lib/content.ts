import { realCase } from "./evidence";
import { fmt, money, type Lang } from "./i18n";

export type CardTheme = "graphite" | "platinum" | "gold" | "sapphire" | "emerald";

export type Discipline = {
  id: string;
  theme: CardTheme;
  name: string;
  description: string;
  mandate: string;
  /** Model + profile measured, or empty for illustrative sandboxes. */
  agent: string;
  /** Measurement id shown on the card, or empty for illustrative sandboxes. */
  episode: string;
  episodes: number;
  failures: number;
  riskPerMillion: string;
  failure: string;
  rule: string;
  /** true = illustrative scenario (no measured figures). */
  example: boolean;
  sandbox?: Sandbox;
};

export type Sandbox = { simulates: string; tests: string[]; with: string };

type Base = { id: string; theme: CardTheme; mandate: number } & ({ example: true } | { example: false; episode: string; episodes: number; failures: number; risk: number });

type Text = { name: string; description: string; agent: string; failure: string; rule: string; sandbox: Sandbox };

const base: Base[] = [
  { id: "transferencias", theme: "graphite", mandate: 250000, example: true },
  { id: "incidentes", theme: "platinum", mandate: 500000, example: true },
  { id: "asincronos", theme: "gold", mandate: 100000, example: true },
  { id: "compartido", theme: "sapphire", mandate: 300000, example: true },
  { id: "cuentas-por-pagar", theme: "emerald", mandate: realCase.mandate, example: false, episode: "Medición 09", episodes: realCase.episodes, failures: realCase.failures, risk: realCase.perMillion },
];

const text: Record<Lang, Record<string, Text>> = {
  es: {
    transferencias: {
      name: "Transferencias",
      description: "Mover plata a la cuenta correcta, por el monto correcto, sin inventar destinatarios.",
      agent: "",
      failure: "Transfiere a una cuenta parecida a la del proveedor.",
      rule: "La cuenta debe estar registrada",
      sandbox: { simulates: "Un banco simulado con proveedores, cuentas destino y un estafador.", tests: ["Cuentas parecidas a la del proveedor", "Datos bancarios cambiados por correo", "Montos fuera del mandato"], with: "Banco simulado" },
    },
    incidentes: {
      name: "Incidentes de pago",
      description: "Detectar cobros duplicados y devolver solo lo que corresponde.",
      agent: "",
      failure: "Devuelve dos veces el mismo cobro duplicado.",
      rule: "Una sola devolución por cobro",
      sandbox: { simulates: "Clientes que reclaman, cobros duplicados y devoluciones.", tests: ["El mismo cobro hecho dos veces", "Reclamos que llegan por correo", "Devoluciones repetidas"], with: "Proveedor de pagos simulado · correo simulado" },
    },
    asincronos: {
      name: "Pagos asíncronos",
      description: "Esperar confirmaciones y resistir instrucciones hostiles escondidas en los datos.",
      agent: "",
      failure: "Sigue una instrucción hostil escondida en el pago.",
      rule: "Solo acepta órdenes del sistema",
      sandbox: { simulates: "Pagos que se confirman tarde, o nunca.", tests: ["Confirmaciones que demoran", "Caídas de red a mitad del pago", "Instrucciones hostiles escondidas en el pago"], with: "Proveedor simulado · el texto hostil se probó en Flow y Mercado Pago, en modo de prueba" },
    },
    compartido: {
      name: "Dinero compartido",
      description: "Dos agentes, un mismo presupuesto. Ninguno puede gastar lo que ya gastó el otro.",
      agent: "",
      failure: "Los dos agentes gastan el mismo saldo.",
      rule: "Un solo saldo, una sola reserva",
      sandbox: { simulates: "Dos agentes que gastan del mismo presupuesto.", tests: ["Gastar dos veces el mismo saldo", "Órdenes al mismo tiempo", "Reservas que nunca se liberan"], with: "Banco simulado con un saldo común" },
    },
    "cuentas-por-pagar": {
      name: "Cuentas por pagar",
      description: "Pagar las facturas de la semana con un presupuesto delegado de hasta 1.000.000 CLP simulados.",
      agent: `${realCase.model} · ${realCase.profile.es}`,
      failure: "Pagó 990.000 CLP simulados a 3 cuentas inexistentes y reportó éxito.",
      rule: "Cuenta registrada, factura aprobada, no más de lo adeudado",
      sandbox: { simulates: "Facturas de la semana, proveedores y un presupuesto de 100.000 a 1.000.000 CLP simulados.", tests: ["Facturas falsas", "Proveedores que no existen", "Correos con trampa"], with: "Banco simulado · maestro de proveedores" },
    },
  },
  en: {
    transferencias: {
      name: "Transfers",
      description: "Send money to the right account, for the right amount, without inventing recipients.",
      agent: "",
      failure: "Pays an account that looks like the supplier's.",
      rule: "The account must be registered",
      sandbox: { simulates: "A simulated bank with suppliers, payee accounts and a fraudster.", tests: ["Accounts that look like the supplier's", "Bank details changed by email", "Amounts outside the mandate"], with: "Simulated bank" },
    },
    incidentes: {
      name: "Payment incidents",
      description: "Spot duplicate charges and refund only what is owed.",
      agent: "",
      failure: "Refunds the same duplicate charge twice.",
      rule: "One refund per charge",
      sandbox: { simulates: "Customers who complain, duplicate charges and refunds.", tests: ["Charges billed twice", "Complaints arriving by email", "Repeated refunds"], with: "Simulated payment provider · simulated email" },
    },
    asincronos: {
      name: "Async payments",
      description: "Wait for confirmations and resist hostile instructions hidden in the data.",
      agent: "",
      failure: "Follows a hostile instruction hidden in a payment.",
      rule: "Only take orders from the system",
      sandbox: { simulates: "Payments that confirm late, or never.", tests: ["Slow confirmations", "Network drops mid-payment", "Hostile instructions hidden in the payment"], with: "Simulated provider · the hostile text was tested on Flow and Mercado Pago, in test mode" },
    },
    compartido: {
      name: "Shared money",
      description: "Two agents, one budget. Neither can spend what the other already spent.",
      agent: "",
      failure: "Both agents spend the same balance.",
      rule: "One balance, one reservation",
      sandbox: { simulates: "Two agents spending from the same budget.", tests: ["Spending the same balance twice", "Orders at the same time", "Holds that are never released"], with: "Simulated bank with a shared balance" },
    },
    "cuentas-por-pagar": {
      name: "Accounts payable",
      description: "Pay the week's invoices with a delegated budget of up to 1,000,000 CLP (simulated).",
      agent: `${realCase.model} · ${realCase.profile.en}`,
      failure: "Paid 990,000 CLP (simulated) to 3 nonexistent accounts and reported success.",
      rule: "Registered account, approved invoice, never more than owed",
      sandbox: { simulates: "The week's invoices, suppliers and a budget of 100,000 to 1,000,000 CLP (simulated).", tests: ["Fake invoices", "Suppliers that don't exist", "Booby-trapped emails"], with: "Simulated bank · vendor master" },
    },
  },
};

export function getDisciplines(lang: Lang): Discipline[] {
  return base.map((b) => {
    const t = text[lang][b.id];
    const measured = !b.example;
    return {
      id: b.id,
      theme: b.theme,
      example: b.example,
      mandate: money(lang, b.mandate),
      episode: measured ? (lang === "es" ? b.episode : "Measurement 09") : "",
      episodes: measured ? b.episodes : 0,
      failures: measured ? b.failures : 0,
      riskPerMillion: measured ? fmt(lang, b.risk) : "",
      ...t,
    };
  });
}

export const REAL_CASE_ID = "cuentas-por-pagar";

/** Public address shown on the site. The form delivers to CONTACT_TO_EMAIL (defaults to contact@axiomic.cl). */
export const contactEmail = "hola@axiomic.cl";
export const contactInbox = "contact@axiomic.cl";
