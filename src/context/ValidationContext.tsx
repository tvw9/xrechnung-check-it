import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ValidationResult } from "@/lib/types";

interface ContextType {
  result: ValidationResult | null;
  fileName: string;
  setResult: (r: ValidationResult, name: string) => void;
}

const ValidationContext = createContext<ContextType | null>(null);

const STORAGE_KEY = "xv_last_result";

export function ValidationProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<ValidationResult | null>(null);
  const [fileName, setFileName] = useState("");

  // Rehydrate from sessionStorage on mount (survives route transitions / reloads).
  useEffect(() => {
    if (result) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { result: ValidationResult; fileName: string };
        setResultState(parsed.result);
        setFileName(parsed.fileName);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setResult = (r: ValidationResult, name: string) => {
    setResultState(r);
    setFileName(name);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ result: r, fileName: name }));
    } catch {
      /* ignore */
    }
  };

  return (
    <ValidationContext.Provider value={{ result, fileName, setResult }}>
      {children}
    </ValidationContext.Provider>
  );
}

export const useValidation = () => {
  const ctx = useContext(ValidationContext);
  if (!ctx) throw new Error("useValidation must be used within ValidationProvider");
  return ctx;
};