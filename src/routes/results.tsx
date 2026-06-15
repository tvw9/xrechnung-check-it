import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScoreCircle } from "@/components/results/ScoreCircle";
import { ValidationList } from "@/components/results/ValidationList";
import { SummaryBar } from "@/components/results/SummaryBar";
import { UpgradeModal } from "@/components/results/UpgradeModal";
import { useValidation } from "@/context/ValidationContext";
import type { ValidationResult } from "@/lib/types";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Prüfergebnis — XValidator" },
      { name: "description", content: "Detailliertes Validierungsergebnis Ihrer E-Rechnung." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultsPage,
});

function getTone(r: ValidationResult): "success" | "warn" | "danger" {
  if (r.errors.length > 0) return "danger";
  if (r.warnings.length > 0) return "warn";
  return "success";
}

function buildReportHtml(fileName: string, r: ValidationResult): string {
  const date = new Date().toLocaleDateString("de-DE");
  const row = (it: { code: string; field: string; message: string; solution: string; technicalPath: string }) => `
    <tr>
      <td><code>${it.code}</code></td>
      <td><strong>${it.field}</strong><br/><span class="muted">${it.technicalPath}</span></td>
      <td>${it.message}${it.solution ? `<br/><span class="muted">Lösung: ${it.solution}</span>` : ""}</td>
    </tr>`;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8">
<title>XValidator Prüfbericht — ${fileName} — ${date}</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0F172A;max-width:900px;margin:40px auto;padding:0 24px;}
  h1{font-size:22px;margin:0 0 4px;} h2{font-size:16px;margin:32px 0 8px;}
  .muted{color:#64748B;font-size:12px;}
  .meta{color:#64748B;font-size:13px;margin-bottom:24px;}
  .score{font-size:48px;font-weight:700;}
  table{width:100%;border-collapse:collapse;margin-top:8px;}
  th,td{text-align:left;padding:10px 8px;border-bottom:1px solid #E2E8F0;vertical-align:top;font-size:13px;}
  th{background:#F8FAFC;font-weight:600;}
  .err{color:#DC2626;} .warn{color:#D97706;} .ok{color:#16A34A;}
</style></head><body>
<h1>XValidator Prüfbericht</h1>
<div class="meta">${fileName} · ${date} · Format: ${r.format}</div>
<div class="score ${r.errors.length ? "err" : r.warnings.length ? "warn" : "ok"}">${r.score}%</div>
<p>${r.errors.length} Fehler · ${r.warnings.length} Warnungen · ${r.passed.length} bestanden</p>

<h2 class="err">Kritische Fehler (${r.errors.length})</h2>
<table><thead><tr><th>Code</th><th>Feld</th><th>Beschreibung</th></tr></thead><tbody>
${r.errors.map(row).join("") || `<tr><td colspan="3" class="muted">Keine Fehler</td></tr>`}
</tbody></table>

<h2 class="warn">Warnungen (${r.warnings.length})</h2>
<table><thead><tr><th>Code</th><th>Feld</th><th>Beschreibung</th></tr></thead><tbody>
${r.warnings.map(row).join("") || `<tr><td colspan="3" class="muted">Keine Warnungen</td></tr>`}
</tbody></table>

<h2 class="ok">Bestandene Prüfungen (${r.passed.length})</h2>
<table><thead><tr><th>Code</th><th>Feld</th><th>Status</th></tr></thead><tbody>
${r.passed.map((p) => `<tr><td><code>${p.code}</code></td><td>${p.field}<br/><span class="muted">${p.technicalPath}</span></td><td class="ok">✓ Pflichtfeld vorhanden</td></tr>`).join("")}
</tbody></table>

<p class="muted" style="margin-top:40px">Erstellt mit XValidator · Validierung erfolgt vollständig im Browser, ohne Datenweitergabe.</p>
</body></html>`;
}

function ResultsPage() {
  const { result, fileName } = useValidation();
  const navigate = useNavigate();
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!result) {
      navigate({ to: "/" });
      return;
    }
    try {
      const raw = parseInt(localStorage.getItem("xv_checks_used") || "0", 10) || 0;
      const next = raw + 1;
      localStorage.setItem("xv_checks_used", String(next));
      if (next >= 3) setShowUpgrade(true);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!result) return null;

  const tone = getTone(result);
  const label =
    tone === "success"
      ? { text: "✓ Gültig", color: "text-success" }
      : tone === "warn"
        ? { text: "⚠ Bedingt konform", color: "text-warn" }
        : { text: "✗ Nicht konform", color: "text-danger" };

  const subtitle =
    tone === "success"
      ? "Diese Rechnung entspricht dem XRechnung-Standard. Bereit zum Versand."
      : tone === "warn"
        ? `Keine Pflichtfeldfehler, aber ${result.warnings.length} Empfehlungen zur Optimierung.`
        : `${result.errors.length} kritische Fehler gefunden. Bitte korrigieren Sie die Rechnung vor dem Versand.`;

  const onDownload = () => {
    const html = buildReportHtml(fileName || "rechnung.xml", result);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `XValidator-Bericht-${(fileName || "rechnung").replace(/\.[^.]+$/, "")}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <SummaryBar
        fileName={fileName || "rechnung.xml"}
        errors={result.errors.length}
        warnings={result.warnings.length}
        passed={result.passed.length}
        onDownload={onDownload}
      />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-col items-center rounded-2xl border border-hairline bg-card p-10 shadow-sm">
          <ScoreCircle score={result.score} color={tone} />
          <div className={`mt-6 text-2xl font-bold ${label.color}`}>{label.text}</div>
          <p className="mt-2 max-w-md text-center text-sm text-ink-muted">{subtitle}</p>
          <span className="mt-4 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-medium text-ink-muted">
            Format: {result.format}
          </span>
        </div>

        <div className="mt-8 space-y-4">
          <ValidationList tone="danger" items={result.errors} defaultOpen={result.errors.length > 0} />
          <ValidationList
            tone="warn"
            items={result.warnings}
            defaultOpen={result.errors.length === 0 && result.warnings.length > 0}
          />
          <ValidationList tone="success" items={result.passed} defaultOpen={false} />
        </div>
      </main>

      <Footer />
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
