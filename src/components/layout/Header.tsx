import { Link } from "@tanstack/react-router";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-white/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand font-mono text-sm font-bold text-brand-foreground">
            XV
          </div>
          <span className="text-lg font-semibold text-brand">XValidator</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-muted md:flex">
          <button onClick={() => scrollTo("funktionen")} className="transition-colors hover:text-ink">
            Funktionen
          </button>
          <button onClick={() => scrollTo("preise")} className="transition-colors hover:text-ink">
            Preise
          </button>
          <button onClick={() => scrollTo("faq")} className="transition-colors hover:text-ink">
            FAQ
          </button>
        </nav>

        <button
          onClick={() => scrollTo("upload")}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90"
        >
          Kostenlos testen
        </button>
      </div>
    </header>
  );
}