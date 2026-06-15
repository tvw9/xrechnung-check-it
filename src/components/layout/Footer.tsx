export function Footer() {
  return (
    <footer className="mt-24 border-t border-hairline bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 text-sm text-ink-muted md:flex-row md:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-brand font-mono text-xs font-bold text-brand-foreground">
            XV
          </div>
          <span className="font-medium text-ink">XValidator</span>
          <span className="text-ink-muted">· E-Rechnungsprüfung Made in Germany</span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <span>© {new Date().getFullYear()} XValidator</span>
          <a href="#" className="hover:text-ink">Impressum</a>
          <a href="#" className="hover:text-ink">Datenschutz</a>
          <a href="#" className="hover:text-ink">Kontakt</a>
        </div>
      </div>
    </footer>
  );
}