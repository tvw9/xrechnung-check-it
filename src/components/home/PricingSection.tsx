import { Check, X } from "lucide-react";

interface Plan {
  name: string;
  badge: string;
  price: string;
  sub?: string;
  features: { ok: boolean; text: string }[];
  cta: string;
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: "Kostenlos",
    badge: "Gratis",
    price: "0 €",
    features: [
      { ok: true, text: "3 Prüfungen pro Monat" },
      { ok: true, text: "Basis-Validierung (BR-Regeln)" },
      { ok: true, text: "Keine Registrierung" },
      { ok: false, text: "Detaillierte Lösungshinweise" },
      { ok: false, text: "Unbegrenzte Prüfungen" },
    ],
    cta: "Jetzt starten",
  },
  {
    name: "Pro",
    badge: "Beliebteste Wahl",
    price: "19 €/Monat",
    sub: "zzgl. MwSt.",
    features: [
      { ok: true, text: "Unbegrenzte Prüfungen" },
      { ok: true, text: "Vollständige Fehlerberichte" },
      { ok: true, text: "Lösungshinweise für jeden Fehler" },
      { ok: true, text: "XML-Snippet je Fehlerposition" },
      { ok: true, text: "PDF-Bericht herunterladen" },
    ],
    cta: "Pro starten",
    highlighted: true,
  },
  {
    name: "Agentur",
    badge: "Teams",
    price: "49 €/Monat",
    sub: "zzgl. MwSt.",
    features: [
      { ok: true, text: "Alles aus Pro" },
      { ok: true, text: "White-Label (eigene Domain)" },
      { ok: true, text: "API-Zugang" },
      { ok: true, text: "Multi-User (bis 10 Accounts)" },
      { ok: true, text: "Priority Support" },
    ],
    cta: "Kontakt aufnehmen",
  },
];

export function PricingSection() {
  return (
    <section id="preise" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-ink">Transparente Preise</h2>
        <p className="mt-3 text-ink-muted">
          Starten Sie kostenlos — upgraden Sie, wenn Sie bereit sind.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const highlight = p.highlighted;
          return (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl bg-card p-7 shadow-sm ${
                highlight ? "border-2 border-brand shadow-md" : "border border-hairline"
              }`}
            >
              <div
                className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                  highlight ? "bg-brand text-brand-foreground" : "bg-accent text-accent-foreground"
                }`}
              >
                {p.badge}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-ink">{p.price}</span>
              </div>
              {p.sub && <p className="text-xs text-ink-muted">{p.sub}</p>}

              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    {f.ok ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--ink-muted)]/50" />
                    )}
                    <span className={f.ok ? "text-ink" : "text-[color:var(--ink-muted)]/80"}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                  highlight
                    ? "bg-brand text-brand-foreground hover:bg-brand/90"
                    : "border border-brand text-brand hover:bg-brand-soft"
                }`}
              >
                {p.cta}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}