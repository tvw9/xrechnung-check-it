import { createContext, useContext, useState, type ReactNode } from "react";
import type { ValidationResult } from "@/lib/types";

interface ContextType {
  result: ValidationResult | null;
  fileName: string;
  setResult: (r: ValidationResult, name: string) => void;
}

const ValidationContext = createContext<ContextType | null>(null);

export function ValidationProvider({ children }: { children: ReactNode }) {
  const [result, setResultState] = useState<ValidationResult | null>(null);
  const [fileName, setFileName] = useState("");

  const setResult = (r: ValidationResult, name: string) => {
    setResultState(r);
    setFileName(name);
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