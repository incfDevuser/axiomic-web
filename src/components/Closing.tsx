"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { contactEmail } from "@/lib/content";
import type { Lang } from "@/lib/i18n";

const ease = [0.23, 1, 0.32, 1] as const;

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

const copy = {
  es: {
    eyebrow: "Agenda un piloto",
    title: (
      <>
        Agenda un piloto <span className="title-accent">con tu agente.</span>
      </>
    ),
    modes: {
      evaluacion: {
        tab: "Solicitar evaluación",
        lead: "Un piloto: un flujo, tu agente y un informe en unas tres semanas.",
        select: "Flujo a evaluar",
        options: ["Pagos a proveedores", "Devoluciones y reembolsos", "Conciliación", "Transferencias", "Otro"],
        submit: "Agenda un piloto",
      },
    },
    fields: { name: "Nombre", namePh: "Tu nombre", company: "Empresa", companyPh: "Tu empresa", email: "Correo", emailPh: "tu@empresa.cl" },
    sending: "Enviando…",
    sent: "Listo, recibimos tu mensaje. Te escribimos pronto.",
    error: "No pudimos enviarlo. Escríbenos directo a",
    or: "o escríbenos a",
    book: "o agenda una llamada directo →",
  },
  en: {
    eyebrow: "Book a pilot",
    title: (
      <>
        Book a pilot <span className="title-accent">with your agent.</span>
      </>
    ),
    modes: {
      evaluacion: {
        tab: "Request an evaluation",
        lead: "A pilot: one flow, your agent and a report in about three weeks.",
        select: "Flow to evaluate",
        options: ["Supplier payments", "Refunds and returns", "Reconciliation", "Transfers", "Other"],
        submit: "Book a pilot",
      },
    },
    fields: { name: "Name", namePh: "Your name", company: "Company", companyPh: "Your company", email: "Email", emailPh: "you@company.com" },
    sending: "Sending…",
    sent: "Got it. We'll be in touch soon.",
    error: "We couldn't send it. Email us directly at",
    or: "or email us at",
    book: "or book a call directly →",
  },
} satisfies Record<Lang, unknown>;

const field =
  "w-full border-b border-edge bg-transparent py-2.5 text-[18px] text-fg outline-none transition-colors duration-150 placeholder:text-faint focus:border-accent";

type Status = "idle" | "sending" | "sent" | "error";
type Mode = "evaluacion";

export function Closing({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [status, setStatus] = useState<Status>("idle");
  const mode: Mode = "evaluacion";
  const m = t.modes[mode];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), tipo: mode, lang }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contacto" className="relative scroll-mt-24 py-28 sm:py-40">
      <div className="pointer-events-none absolute top-1/2 left-[25%] h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[120px]" />
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-12 px-6 lg:grid-cols-12 lg:gap-14 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.8, ease }}
          className="lg:col-span-5"
        >
          <p className="text-[15px] font-semibold text-accent">{t.eyebrow}</p>
          <h2 className="mt-4 text-[40px] leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-[60px]">{t.title}</h2>
          <p className="mt-5 max-w-md text-[19px] leading-[1.6] text-muted">{m.lead}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="lg:col-span-7 lg:pt-10"
        >
          <form onSubmit={onSubmit} className="grid max-w-2xl gap-x-8 gap-y-6 sm:grid-cols-2">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            <label className="block">
              <span className="font-semibold  text-[14px] text-faint">{t.fields.name}</span>
              <input name="nombre" required autoComplete="name" className={field} placeholder={t.fields.namePh} />
            </label>
            <label className="block">
              <span className="font-semibold  text-[14px] text-faint">{t.fields.company}</span>
              <input name="empresa" required autoComplete="organization" className={field} placeholder={t.fields.companyPh} />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-semibold  text-[14px] text-faint">{t.fields.email}</span>
              <input name="correo" type="email" required autoComplete="email" className={field} placeholder={t.fields.emailPh} />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-semibold  text-[14px] text-faint">{m.select}</span>
              <select name="flujo" className={`${field} appearance-none`} defaultValue={m.options[0]}>
                {m.options.map((f) => (
                  <option key={f} value={f} className="bg-panel">
                    {f}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-full bg-accent px-6 py-3 text-[17px] font-medium text-on-accent shadow-[0_10px_30px_-10px_rgba(37,99,255,0.36)] transition-[background-color,transform,opacity] duration-150 ease-out hover:bg-accent-hi active:scale-[0.97] disabled:opacity-70"
              >
                {status === "sending" ? t.sending : m.submit}
              </button>
              <span className="text-[16px] text-faint" role="status" aria-live="polite">
                {status === "sent" ? (
                  <span className="text-ok">{t.sent}</span>
                ) : status === "error" ? (
                  <span className="text-danger">
                    {t.error}{" "}
                    <a href={`mailto:${contactEmail}`} className="underline underline-offset-2">
                      {contactEmail}
                    </a>
                  </span>
                ) : (
                  <>
                    {t.or}{" "}
                    <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-fg">
                      {contactEmail}
                    </a>
                  </>
                )}
              </span>
            </div>
            {bookingUrl && (
              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold  text-[15px] text-faint transition-colors hover:text-accent sm:col-span-2"
              >
                {t.book}
              </a>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
