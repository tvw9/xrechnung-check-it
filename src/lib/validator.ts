import type { InvoiceFormat, ValidationItem, ValidationResult } from "./types";

function getText(doc: Document | Element, ...selectors: string[]): string | null {
  for (const sel of selectors) {
    try {
      const el = (doc as Document).querySelector
        ? (doc as Document).querySelector(sel)
        : null;
      if (el && el.textContent && el.textContent.trim()) return el.textContent.trim();
    } catch {
      /* ignore */
    }
  }
  return null;
}

function hasField(doc: Document, ...selectors: string[]): boolean {
  return getText(doc, ...selectors) !== null;
}

interface RuleDef {
  code: string;
  field: string;
  technicalPath: string;
  selectors: string[];
  severity: "error" | "warning";
  message: string;
  solution: string;
}

const UBL_RULES: RuleDef[] = [
  { code: "BR-01", field: "Rechnungsnummer (BT-1)", technicalPath: "cbc:ID", selectors: ["ID"], severity: "error", message: "Pflichtfeld fehlt", solution: "Fügen Sie <cbc:ID>RE-2025-001</cbc:ID> zum Root-Element hinzu" },
  { code: "BR-02", field: "Rechnungsdatum (BT-2)", technicalPath: "cbc:IssueDate", selectors: ["IssueDate"], severity: "error", message: "Pflichtfeld fehlt", solution: "Fügen Sie <cbc:IssueDate>2025-01-01</cbc:IssueDate> hinzu" },
  { code: "BR-03", field: "Rechnungstyp (BT-3)", technicalPath: "cbc:InvoiceTypeCode", selectors: ["InvoiceTypeCode"], severity: "error", message: "Pflichtfeld fehlt", solution: "Für Standardrechnung: <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>" },
  { code: "BR-04", field: "Währung (BT-5)", technicalPath: "cbc:DocumentCurrencyCode", selectors: ["DocumentCurrencyCode"], severity: "error", message: "Pflichtfeld fehlt", solution: "Fügen Sie <cbc:DocumentCurrencyCode>EUR</cbc:DocumentCurrencyCode> hinzu" },
  { code: "BR-05", field: "Verkäufername (BT-27)", technicalPath: "cac:AccountingSupplierParty/.../cbc:Name", selectors: ["AccountingSupplierParty PartyName Name", "AccountingSupplierParty RegistrationName"], severity: "error", message: "Verkäufername fehlt", solution: "Fügen Sie den Namen des Verkäufers in <cac:AccountingSupplierParty> ein" },
  { code: "BR-06", field: "Käufername (BT-44)", technicalPath: "cac:AccountingCustomerParty/.../cbc:Name", selectors: ["AccountingCustomerParty PartyName Name", "AccountingCustomerParty RegistrationName"], severity: "error", message: "Käufername fehlt", solution: "Fügen Sie den Namen des Käufers in <cac:AccountingCustomerParty> ein" },
  { code: "BR-07", field: "Verkäufer-Land (BT-40)", technicalPath: "AccountingSupplierParty Country IdentificationCode", selectors: ["AccountingSupplierParty PostalAddress Country IdentificationCode"], severity: "error", message: "Länderkennzeichen des Verkäufers fehlt", solution: "Fügen Sie <cbc:IdentificationCode>DE</cbc:IdentificationCode> in der Adresse ein" },
  { code: "BR-08", field: "Steuerbetrag (BT-110)", technicalPath: "cac:TaxTotal/cbc:TaxAmount", selectors: ["TaxTotal TaxAmount"], severity: "error", message: "Steuerbetrag fehlt", solution: "Das <cac:TaxTotal>-Element mit <cbc:TaxAmount> ist Pflicht" },
  { code: "BR-09", field: "Zahlungsbetrag (BT-115)", technicalPath: "cac:LegalMonetaryTotal/cbc:PayableAmount", selectors: ["LegalMonetaryTotal PayableAmount"], severity: "error", message: "Zahlungsbetrag fehlt", solution: "Fügen Sie <cbc:PayableAmount> in <cac:LegalMonetaryTotal> ein" },
  { code: "BR-10", field: "Rechnungspositionen (BG-25)", technicalPath: "cac:InvoiceLine", selectors: ["InvoiceLine"], severity: "error", message: "Keine Rechnungsposition vorhanden", solution: "Mindestens ein <cac:InvoiceLine>-Element ist erforderlich" },
  { code: "BR-11", field: "Steuerkategorie (BT-151)", technicalPath: "cac:TaxCategory/cbc:ID", selectors: ["TaxSubtotal TaxCategory ID"], severity: "error", message: "Steuerkategorie fehlt", solution: "Fügen Sie <cbc:ID>S</cbc:ID> in <cac:TaxCategory> ein" },
  { code: "BR-12", field: "Profilkennung (BT-24)", technicalPath: "cbc:ProfileID", selectors: ["ProfileID"], severity: "error", message: "Profilkennung fehlt oder ungültig", solution: "Fügen Sie <cbc:ProfileID>urn:cen.eu:en16931:2017...</cbc:ProfileID> hinzu" },
  { code: "BW-01", field: "Zahlungsart (BT-81)", technicalPath: "cac:PaymentMeans/cbc:PaymentMeansCode", selectors: ["PaymentMeans PaymentMeansCode"], severity: "warning", message: "Zahlungsart nicht angegeben", solution: "Empfohlen: <cbc:PaymentMeansCode>58</cbc:PaymentMeansCode> (SEPA-Überweisung)" },
  { code: "BW-02", field: "IBAN (BT-84)", technicalPath: "cac:PayeeFinancialAccount/cbc:ID", selectors: ["PayeeFinancialAccount ID"], severity: "warning", message: "Bankverbindung fehlt", solution: "Empfohlen: IBAN im <cac:PayeeFinancialAccount> angeben" },
  { code: "BW-03", field: "USt-IdNr. / StNr. (BT-31)", technicalPath: "cac:PartyTaxScheme/cbc:CompanyID", selectors: ["PartyTaxScheme CompanyID"], severity: "warning", message: "Steueridentifikation fehlt", solution: "Empfohlen: <cbc:CompanyID>DE123456789</cbc:CompanyID> in <cac:PartyTaxScheme>" },
  { code: "BW-04", field: "Zahlungsziel (BT-9)", technicalPath: "cbc:DueDate", selectors: ["DueDate", "PaymentTerms Note"], severity: "warning", message: "Zahlungsfrist nicht angegeben", solution: "Empfohlen: <cbc:DueDate> oder Zahlungsbedingungen hinzufügen" },
  { code: "BW-05", field: "Kontakt-E-Mail (BT-43)", technicalPath: "cac:Contact/cbc:ElectronicMail", selectors: ["AccountingSupplierParty Contact ElectronicMail"], severity: "warning", message: "Kontakt-E-Mail fehlt", solution: "Empfohlen: <cbc:ElectronicMail> in <cac:Contact> des Verkäufers" },
];

const CII_RULES: RuleDef[] = [
  { code: "BR-01", field: "Rechnungsnummer (BT-1)", technicalPath: "ExchangedDocument/ID", selectors: ["ExchangedDocument ID"], severity: "error", message: "Pflichtfeld fehlt", solution: "Fügen Sie <ram:ID> in <rsm:ExchangedDocument> hinzu" },
  { code: "BR-02", field: "Rechnungsdatum (BT-2)", technicalPath: "IssueDateTime/DateTimeString", selectors: ["IssueDateTime DateTimeString"], severity: "error", message: "Pflichtfeld fehlt", solution: "Fügen Sie <ram:IssueDateTime><udt:DateTimeString format=\"102\">20250101</udt:DateTimeString></ram:IssueDateTime> hinzu" },
  { code: "BR-03", field: "Rechnungstyp (BT-3)", technicalPath: "ExchangedDocument/TypeCode", selectors: ["ExchangedDocument TypeCode"], severity: "error", message: "Pflichtfeld fehlt", solution: "Für Standardrechnung: <ram:TypeCode>380</ram:TypeCode>" },
  { code: "BR-04", field: "Währung (BT-5)", technicalPath: "InvoiceCurrencyCode", selectors: ["InvoiceCurrencyCode"], severity: "error", message: "Pflichtfeld fehlt", solution: "Fügen Sie <ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode> hinzu" },
  { code: "BR-05", field: "Verkäufername (BT-27)", technicalPath: "SellerTradeParty/Name", selectors: ["SellerTradeParty Name"], severity: "error", message: "Verkäufername fehlt", solution: "Fügen Sie <ram:Name> in <ram:SellerTradeParty> ein" },
  { code: "BR-06", field: "Käufername (BT-44)", technicalPath: "BuyerTradeParty/Name", selectors: ["BuyerTradeParty Name"], severity: "error", message: "Käufername fehlt", solution: "Fügen Sie <ram:Name> in <ram:BuyerTradeParty> ein" },
  { code: "BR-07", field: "Verkäufer-Land (BT-40)", technicalPath: "SellerTradeParty/PostalTradeAddress/CountryID", selectors: ["SellerTradeParty PostalTradeAddress CountryID"], severity: "error", message: "Länderkennzeichen des Verkäufers fehlt", solution: "Fügen Sie <ram:CountryID>DE</ram:CountryID> in der Adresse ein" },
  { code: "BR-08", field: "Steuerbetrag (BT-110)", technicalPath: "TaxTotalAmount", selectors: ["TaxTotalAmount"], severity: "error", message: "Steuerbetrag fehlt", solution: "Das <ram:TaxTotalAmount>-Element ist Pflicht" },
  { code: "BR-09", field: "Zahlungsbetrag (BT-115)", technicalPath: "DuePayableAmount", selectors: ["DuePayableAmount"], severity: "error", message: "Zahlungsbetrag fehlt", solution: "Fügen Sie <ram:DuePayableAmount> hinzu" },
  { code: "BR-10", field: "Rechnungspositionen (BG-25)", technicalPath: "IncludedSupplyChainTradeLineItem", selectors: ["IncludedSupplyChainTradeLineItem"], severity: "error", message: "Keine Rechnungsposition vorhanden", solution: "Mindestens ein <ram:IncludedSupplyChainTradeLineItem>-Element ist erforderlich" },
  { code: "BR-11", field: "Steuerkategorie (BT-151)", technicalPath: "ApplicableTradeTax/CategoryCode", selectors: ["ApplicableTradeTax CategoryCode"], severity: "error", message: "Steuerkategorie fehlt", solution: "Fügen Sie <ram:CategoryCode>S</ram:CategoryCode> in <ram:ApplicableTradeTax> ein" },
  { code: "BR-12", field: "Profilkennung (BT-24)", technicalPath: "GuidelineSpecifiedDocumentContextParameter/ID", selectors: ["GuidelineSpecifiedDocumentContextParameter ID"], severity: "error", message: "Profilkennung fehlt oder ungültig", solution: "Fügen Sie <ram:GuidelineSpecifiedDocumentContextParameter><ram:ID>urn:cen.eu:en16931:2017</ram:ID></ram:GuidelineSpecifiedDocumentContextParameter> hinzu" },
];

export function validateXRechnung(xmlString: string): ValidationResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");

  const parseError = doc.querySelector("parsererror");
  if (parseError) throw new Error("Ungültige XML-Datei");

  const root = doc.documentElement;
  const rootName = root.localName;
  const rootNS = root.namespaceURI || "";

  let format: InvoiceFormat = "UNKNOWN";
  if (rootName === "Invoice" && rootNS.includes("oasis")) format = "UBL";
  if (rootName === "CrossIndustryInvoice") format = "CII";

  if (format === "UNKNOWN") {
    return {
      isValid: false,
      score: 0,
      format: "UNKNOWN",
      errors: [
        {
          code: "FMT-01",
          field: "Dateiformat",
          technicalPath: "Root-Element",
          severity: "error",
          message: "Unbekanntes XML-Format erkannt.",
          solution:
            "Unterstützt werden XRechnung (UBL) und ZUGFeRD/CII. Überprüfen Sie den Namespace des Root-Elements.",
        },
      ],
      warnings: [],
      passed: [],
    };
  }

  const rules = format === "UBL" ? UBL_RULES : CII_RULES;
  const errors: ValidationItem[] = [];
  const warnings: ValidationItem[] = [];
  const passed: ValidationItem[] = [];

  for (const rule of rules) {
    const found = hasField(doc, ...rule.selectors);
    if (found) {
      passed.push({
        code: rule.code,
        field: rule.field,
        technicalPath: rule.technicalPath,
        severity: "pass",
        message: "Pflichtfeld vorhanden",
        solution: "",
      });
    } else {
      const item: ValidationItem = {
        code: rule.code,
        field: rule.field,
        technicalPath: rule.technicalPath,
        severity: rule.severity,
        message: rule.message,
        solution: rule.solution,
      };
      if (rule.severity === "error") errors.push(item);
      else warnings.push(item);
    }
  }

  const score = Math.max(0, 100 - errors.length * 10 - warnings.length * 3);
  const isValid = errors.length === 0;

  return { isValid, score, format, errors, warnings, passed };
}