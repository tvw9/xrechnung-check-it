export type Severity = "error" | "warning" | "pass";
export type InvoiceFormat = "UBL" | "CII" | "UNKNOWN";

export interface ValidationItem {
  code: string;
  field: string;
  technicalPath: string;
  severity: Severity;
  message: string;
  solution: string;
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  format: InvoiceFormat;
  errors: ValidationItem[];
  warnings: ValidationItem[];
  passed: ValidationItem[];
}