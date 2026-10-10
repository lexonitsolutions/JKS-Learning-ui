/**
 * Legal / tax details printed on tax invoices.
 *
 * These MUST come from the environment so that real values are never
 * replaced by placeholders baked into the source. Set them in Vercel
 * (Settings -> Environment Variables) before issuing invoices.
 */
const read = (value: string | undefined): string => (value ?? "").trim();

export const COMPANY = {
  legalName: read(process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME) || "JKS Learning Technologies Private Limited",
  address: read(process.env.NEXT_PUBLIC_COMPANY_ADDRESS),
  gstin: read(process.env.NEXT_PUBLIC_COMPANY_GSTIN),
  cin: read(process.env.NEXT_PUBLIC_COMPANY_CIN),
  signatoryName: read(process.env.NEXT_PUBLIC_INVOICE_SIGNATORY_NAME),
  signatoryTitle: read(process.env.NEXT_PUBLIC_INVOICE_SIGNATORY_TITLE) || "Authorized Signatory",
} as const;

/** Fields that are still missing, so the UI can warn before an invoice is issued. */
export function getMissingCompanyFields(): string[] {
  const missing: string[] = [];
  if (!COMPANY.gstin) missing.push("GSTIN");
  if (!COMPANY.cin) missing.push("CIN");
  if (!COMPANY.address) missing.push("registered address");
  if (!COMPANY.signatoryName) missing.push("authorized signatory");
  return missing;
}
