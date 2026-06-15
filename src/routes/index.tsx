import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UploadCard } from "@/components/home/UploadCard";
import { FeatureCards } from "@/components/home/FeatureCards";
import { PricingSection } from "@/components/home/PricingSection";
import { FAQSection } from "@/components/home/FAQSection";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XValidator — E-Rechnung prüfen (XRechnung & ZUGFeRD)" },
      {
        name: "description",
        content:
          "Validieren Sie XRechnung 3.0 und ZUGFeRD 2.x-Rechnungen in Sekunden direkt im Browser. DSGVO-konform, ohne Datenweitergabe, 3 Prüfungen kostenlos.",
      },
      { property: "og:title", content: "XValidator — E-Rechnung prüfen" },
      {
        property: "og:description",
        content:
          "XRechnung 3.0 & ZUGFeRD 2.x in Sekunden prüfen. 100 % im Browser, DSGVO-konform.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3 py-1 text-xs font-medium text-ink-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
            XRechnung 3.0 · ZUGFeRD 2.x · EN 16931
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink md:text-5xl">
            E-Rechnungen auf Knopfdruck prüfen
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">
            Validieren Sie XRechnung 3.0 und ZUGFeRD 2.x-Rechnungen in Sekunden — direkt im Browser,
            ohne Datenweitergabe. 3 Prüfungen kostenlos, keine Registrierung.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" /> DSGVO-konform
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" /> Made in Germany
            </span>
          </div>
        </div>

        <div className="mt-12">
          <UploadCard />
        </div>
      </section>

      <FeatureCards />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
