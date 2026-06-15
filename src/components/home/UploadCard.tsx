import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { validateXRechnung } from "@/lib/validator";
import { SAMPLE_VALID_XML, SAMPLE_INVALID_XML } from "@/lib/sampleXml";
import { useValidation } from "@/context/ValidationContext";

export function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setResult } = useValidation();
  const navigate = useNavigate();

  const runValidation = async (xml: string, name: string) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 250));
      const result = validateXRechnung(xml);
      setResult(result, name);
      navigate({ to: "/results" });
    } catch {
      toast.error("Die Datei konnte nicht gelesen werden. Bitte prüfen Sie das Format.");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".xml")) {
      toast.error("Bitte laden Sie eine .xml-Datei hoch.");
      return;
    }
    try {
      const text = await file.text();
      await runValidation(text, file.name);
    } catch {
      toast.error("Die Datei konnte nicht gelesen werden. Bitte prüfen Sie das Format.");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      id="upload"
      className="mx-auto w-full max-w-lg rounded-2xl border border-hairline bg-card p-6 shadow-md"
    >
      <h2 className="text-base font-semibold text-ink">Rechnung hochladen</h2>

      <div
        onClick={() => !loading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`mt-4 cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
          dragOver
            ? "border-brand bg-brand-soft"
            : "border-[color:var(--hairline)] hover:border-brand/50 hover:bg-brand-soft/40"
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-ink-muted">
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
            <p className="text-sm font-medium text-ink">Prüfung läuft…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <UploadCloud className="h-12 w-12 text-[color:var(--ink-muted)]/70" strokeWidth={1.5} />
            <p className="text-sm text-ink-muted">
              XML-Datei hierher ziehen oder{" "}
              <span className="font-medium text-brand underline-offset-2 hover:underline">
                Datei auswählen
              </span>
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".xml,application/xml,text/xml"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>

      <p className="mt-4 text-xs text-[color:var(--ink-muted)]/80">
        Unterstützte Formate: XRechnung (UBL), XRechnung (CII), ZUGFeRD 2.x
      </p>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
        <button
          onClick={() => runValidation(SAMPLE_VALID_XML, "beispiel-gueltig.xml")}
          className="text-brand underline-offset-2 hover:underline"
        >
          Gültige Testdatei laden
        </button>
        <button
          onClick={() => runValidation(SAMPLE_INVALID_XML, "beispiel-fehlerhaft.xml")}
          className="text-brand underline-offset-2 hover:underline"
        >
          Fehlerhafte Testdatei laden
        </button>
      </div>
    </div>
  );
}