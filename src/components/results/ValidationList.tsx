import { useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react";
import type { ValidationItem } from "@/lib/types";

type Tone = "danger" | "warn" | "success";

const tones: Record<
  Tone,
  { icon: typeof AlertCircle; title: string; iconColor: string; pill: string }
> = {
  danger: {
    icon: AlertCircle,
    title: "Kritische Fehler",
    iconColor: "text-danger",
    pill: "bg-danger text-danger-foreground",
  },
  warn: {
    icon: AlertTriangle,
    title: "Warnungen",
    iconColor: "text-warn",
    pill: "bg-warn text-warn-foreground",
  },
  success: {
    icon: CheckCircle2,
    title: "Bestandene Prüfungen",
    iconColor: "text-success",
    pill: "bg-success text-success-foreground",
  },
};

interface Props {
  tone: Tone;
  items: ValidationItem[];
  defaultOpen?: boolean;
}

export function ValidationList({ tone, items, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const t = tones[tone];
  const Icon = t.icon;

  return (
    <div className="rounded-xl border border-hairline bg-card shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <Icon className={`h-5 w-5 ${t.iconColor}`} />
          <h3 className="text-base font-semibold text-ink">{t.title}</h3>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.pill}`}>
            {items.length}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-hairline">
          {items.length === 0 ? (
            <p className="px-6 py-6 text-sm text-ink-muted">Keine Einträge.</p>
          ) : (
            <ul className="divide-y divide-[color:var(--hairline)]">
              {items.map((it, i) => (
                <li key={i} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${t.iconColor}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-mono text-xs font-semibold text-ink-muted">
                          {it.code}
                        </span>
                        <span className="text-ink-muted">·</span>
                        <span className="font-medium text-ink">{it.field}</span>
                      </div>
                      <p className="mt-1 text-sm text-ink">
                        {tone === "success" ? "Pflichtfeld vorhanden" : it.message}
                      </p>
                      {it.solution && tone !== "success" && (
                        <p className="mt-2 text-sm text-ink-muted">
                          <span className="font-medium text-ink">Lösung: </span>
                          {it.solution}
                        </p>
                      )}
                      <div className="mt-3">
                        <span className="inline-flex rounded bg-accent px-2 py-1 font-mono text-xs text-ink-muted">
                          {it.technicalPath}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}