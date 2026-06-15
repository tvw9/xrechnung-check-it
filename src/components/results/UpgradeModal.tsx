interface Props {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-card p-7 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-ink">3 kostenlose Prüfungen aufgebraucht</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Für unbegrenzte Validierungen und detaillierte Berichte upgraden Sie auf XValidator Pro.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button className="rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90">
            Pro für 19 €/Monat
          </button>
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-accent"
          >
            Später
          </button>
        </div>
      </div>
    </div>
  );
}