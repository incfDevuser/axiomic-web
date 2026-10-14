import { contactInbox } from "@/lib/content";

// Per-IP rate limit: 5 submissions per 10 minutes, kept in memory per server instance.
// Pair it with Cloudflare Turnstile or a Vercel firewall rule for a real deployment.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
}

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (limited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  if (clean(data.website)) return Response.json({ ok: true });

  const lead = {
    nombre: clean(data.nombre),
    empresa: clean(data.empresa),
    correo: clean(data.correo),
    flujo: clean(data.flujo),
    tipo: data.tipo === "gateway" ? "gateway" : "evaluacion",
    lang: data.lang === "en" ? "en" : "es",
  };
  if (!lead.nombre || !lead.empresa || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.correo)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") console.warn("[contact] RESEND_API_KEY not set; lead not sent:", lead);
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const lines = [`Solicitud: ${lead.tipo === "gateway" ? "Acceso anticipado al Gateway" : "Evaluación"}`, `Nombre: ${lead.nombre}`, `Empresa: ${lead.empresa}`, `Correo: ${lead.correo}`, `${lead.tipo === "gateway" ? "Proveedor" : "Flujo a evaluar"}: ${lead.flujo}`, `Idioma: ${lead.lang}`];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Axiomic <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL ?? contactInbox],
      reply_to: lead.correo,
      subject: `${lead.tipo === "gateway" ? "Gateway · acceso anticipado" : "Evaluación"} · ${lead.empresa}`,
      text: lines.join("\n"),
      html: `<p>${lines.map(escape).join("<br>")}</p>`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text());
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
