import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Was ist XRechnung?",
    a: "XRechnung ist ein deutsches XML-Format für elektronische Rechnungen, das auf dem europäischen Standard EN 16931 basiert. Seit November 2020 ist es für Rechnungen an Bundesbehörden verpflichtend — ab 2025 wird die Pflicht schrittweise auf alle B2B-Rechnungen ausgeweitet.",
  },
  {
    q: "Welche Dateiformate werden aktuell unterstützt?",
    a: "XValidator prüft XML-Dateien im UBL-Format (urn:oasis:names) und im UN/CEFACT CII-Format (CrossIndustryInvoice). Eingebettete ZUGFeRD-XMLs in PDF/A-3-Dateien werden in Kürze unterstützt.",
  },
  {
    q: "Sind meine Rechnungsdaten sicher?",
    a: "Ja, vollständig. Die gesamte Validierung findet ausschließlich in Ihrem Browser statt. Keine Datei wird an einen Server übertragen. Wir sehen Ihre Rechnungsdaten zu keinem Zeitpunkt.",
  },
  {
    q: "Was bedeutet \"XRechnung 3.0\"?",
    a: "XRechnung 3.0 ist die aktuelle Version des deutschen Standards, herausgegeben von KoSIT. Sie enthält alle verbindlichen Geschäftsregeln (BR-Regeln) für konforme elektronische Rechnungen. XValidator prüft Ihre Datei gegen diese Regeln.",
  },
  {
    q: "Was passiert nach 3 kostenlosen Prüfungen?",
    a: "Sie können weiterhin Dateien prüfen und die Ergebnisse sehen — wir zeigen Ihnen jedoch einen Hinweis zum Upgrade auf XValidator Pro für unbegrenzte Nutzung.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-ink">Häufige Fragen</h2>
        <p className="mt-3 text-ink-muted">
          Alles Wichtige zur E-Rechnungspflicht und zu XValidator.
        </p>
      </div>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-hairline">
            <AccordionTrigger className="text-left text-base font-medium text-ink hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-ink-muted">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}