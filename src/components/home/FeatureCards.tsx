import { ShieldCheck, Zap, Lock } from "lucide-react";

const features = [
  {
    Icon: ShieldCheck,
    iconClass: "text-success bg-success-soft",
    title: "Normkonform",
    text: "Vollständige Prüfung nach XRechnung 3.0 (KoSIT) und ZUGFeRD 2.3.2 — inklusive aller Pflichtfelder der EN 16931.",
  },
  {
    Icon: Zap,
    iconClass: "text-warn bg-warn-soft",
    title: "Sofort-Ergebnis",
    text: "Keine Wartezeit. Die Validierung erfolgt direkt im Browser — Ihr Ergebnis liegt in unter einer Sekunde vor.",
  },
  {
    Icon: Lock,
    iconClass: "text-brand bg-brand-soft",
    title: "100% Datenschutz",
    text: "Ihre Rechnungsdaten verlassen niemals Ihr Gerät. Keine Server, keine Cloud, keine Speicherung.",
  },
];

export function FeatureCards() {
  return (
    <section id="funktionen" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-ink">Warum XValidator</h2>
        <p className="mt-3 text-ink-muted">
          Entwickelt für deutsche Unternehmen, Steuerberater und Buchhaltungssoftware-Anbieter.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-hairline bg-card p-7 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${f.iconClass}`}>
              <f.Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}