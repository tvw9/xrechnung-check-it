import { FileText, ArrowLeft, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Props {
  fileName: string;
  errors: number;
  warnings: number;
  passed: number;
  onDownload: () => void;
}

export function SummaryBar({ fileName, errors, warnings, passed, onDownload }: Props) {
  return (
    <div className="sticky top-16 z-30 border-b border-hairline bg-white/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-2 text-sm">
          <FileText className="h-4 w-4 shrink-0 text-ink-muted" />
          <span className="truncate font-medium text-ink">{fileName}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded-full bg-danger px-2.5 py-1 text-danger-foreground">
            {errors} Fehler
          </span>
          <span className="rounded-full bg-warn px-2.5 py-1 text-warn-foreground">
            {warnings} Warnungen
          </span>
          <span className="rounded-full bg-success px-2.5 py-1 text-success-foreground">
            {passed} OK
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Neue Prüfung
          </Link>
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
          >
            <Download className="h-4 w-4" />
            Bericht herunterladen
          </button>
        </div>
      </div>
    </div>
  );
}