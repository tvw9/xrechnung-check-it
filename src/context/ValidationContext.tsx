import { createContext, useContext, useState, type ReactNode } from "react";
import type { ValidationResult } from "@/lib/types";

interface ContextType {
  result: ValidationResult | null;
  fileName: string;
  setResult: (r: ValidationResult, name: string) => void;
}

const ValidationContext = createContext<ContextType | null>(null);

const STORAGE_KEY = "xv_last_result";

function readStored(): { result: ValidationResult | null; fileName: string } {
  if (typeof window === "undefined") return { result: null, fileName: "" };
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { result: null, fileName: "" };
    const parsed = JSON.parse(raw) as { result: ValidationResult; fileName: string };
    return { result: parsed.result, fileName: parsed.fileName ?? "" };
  } catch {
    return { result: null, fileName: "" };
  }
}

export function ValidationProvider({ children }: { children: ReactNode }) {
  const initial = readStored();
  const [result, setResultState] = useState<ValidationResult | null>(initial.result);
  const [fileName, setFileName] = useState(initial.fileName);

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