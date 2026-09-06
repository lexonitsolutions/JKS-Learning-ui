import { apiFetch } from "@/lib/api/base-url";

export interface InvoiceItem {
  description: string;
  courseSlug: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAddress?: string;
  studentCity?: string;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  taxableAmount: number;
  cgstRate: number; // 9%
  cgstAmount: number;
  sgstRate: number; // 9%
  sgstAmount: number;
  totalAmount: number;
  paymentMode: "UPI" | "Credit/Debit Card" | "Net Banking" | "No-Cost EMI";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  transactionRef: string;
  batchTiming?: string;
}

export const INITIAL_INVOICES: Invoice[] = [];

const INVOICES_STORAGE_KEY = "jks_invoices_store_v2";

export function getStoredInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INVOICES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveStoredInvoices(invoices: Invoice[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
  } catch (err) {
    console.error("Failed to save invoices:", err);
  }
}

export function createInvoice(data: {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentCity?: string;
  courseTitle: string;
  courseSlug: string;
  price: number;
  discount?: number;
  discountCode?: string;
  paymentMode: Invoice["paymentMode"];
  batchTiming?: string;
}): Invoice {
  const current = getStoredInvoices();
  const subtotal = data.price;
  const discountAmount = data.discount || 0;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // 18% GST calculation included in total
  const taxableAmount = +(totalAmount / 1.18).toFixed(2);
  const taxTotal = +(totalAmount - taxableAmount).toFixed(2);
  const cgstAmount = +(taxTotal / 2).toFixed(2);
  const sgstAmount = +(taxTotal / 2).toFixed(2);

  const nextSeq = 894 + current.length;
  const invoiceNumber = `JKS-INV-2026-00${nextSeq}`;

  const newInvoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber,
    issueDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    studentName: data.studentName,
    studentEmail: data.studentEmail,
    studentPhone: data.studentPhone,
    studentCity: data.studentCity || "India",
    items: [
      {
        description: data.courseTitle,
        courseSlug: data.courseSlug,
        qty: 1,
        unitPrice: data.price,
        totalPrice: data.price,
      },
    ],
    subtotal,
    discountAmount,
    discountCode: data.discountCode,
    taxableAmount,
    cgstRate: 9,
    cgstAmount,
    sgstRate: 9,
    sgstAmount,
    totalAmount,
    paymentMode: data.paymentMode,
    paymentStatus: "Paid",
    transactionRef: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
    batchTiming: data.batchTiming,
  };

  const updated = [newInvoice, ...current];
  saveStoredInvoices(updated);
  return newInvoice;
}

export async function registerCourseOnline(data: {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentCity?: string;
  courseSlug: string;
  courseTitle: string;
  price: number;
  discount: number;
  discountCode?: string;
  paymentMode: Invoice["paymentMode"];
  batchTiming?: string;
}): Promise<Invoice> {
  try {
    const res = await apiFetch("/enrollments/register-public", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        studentPhone: data.studentPhone,
        studentAddress: data.studentCity || "Online",
        courseSlug: data.courseSlug,
        batchTiming: data.batchTiming || "Weekday Batch",
        couponCode: data.discountCode,
        paymentMode: data.paymentMode,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      const inv = json.invoice;
      const formatted: Invoice = {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        issueDate: inv.paidAt || new Date().toISOString(),
        dueDate: inv.paidAt || new Date().toISOString(),
        studentName: inv.studentName,
        studentEmail: inv.studentEmail,
        studentPhone: inv.studentPhone,
        studentAddress: inv.studentAddress,
        studentCity: data.studentCity || "Bengaluru, India",
        items: [
          {
            description: `${inv.courseTitle} (Live Cohort)`,
            courseSlug: data.courseSlug,
            qty: 1,
            unitPrice: inv.baseAmount,
            totalPrice: inv.baseAmount,
          },
        ],
        subtotal: inv.baseAmount,
        discountAmount: inv.discount,
        discountCode: data.discountCode,
        taxableAmount: inv.taxableAmount,
        cgstRate: 9,
        cgstAmount: inv.cgst,
        sgstRate: 9,
        sgstAmount: inv.sgst,
        totalAmount: inv.totalAmount,
        paymentMode: data.paymentMode,
        paymentStatus: "Paid",
        transactionRef: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        batchTiming: inv.batchTiming,
      };

      const current = getStoredInvoices();
      saveStoredInvoices([formatted, ...current]);
      return formatted;
    }
  } catch (err) {
    console.warn("Backend API unavailable, falling back to local invoice generator:", err);
  }

  // Fallback to local invoice store
  return createInvoice(data);
}

export async function fetchInvoicesFromApi(): Promise<Invoice[]> {
  try {
    const res = await apiFetch("/payments/invoices/admin", {
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        return list.map((inv: any) => ({
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          issueDate: inv.paidAt || inv.createdAt || new Date().toISOString(),
          dueDate: inv.paidAt || inv.createdAt || new Date().toISOString(),
          studentName: inv.studentName,
          studentEmail: inv.studentEmail,
          studentPhone: inv.studentPhone,
          studentAddress: inv.studentAddress,
          studentCity: inv.studentAddress || "India",
          items: [
            {
              description: inv.courseTitle,
              courseSlug: "course",
              qty: 1,
              unitPrice: inv.baseAmount,
              totalPrice: inv.baseAmount,
            },
          ],
          subtotal: inv.baseAmount,
          discountAmount: inv.discount,
          taxableAmount: inv.taxableAmount,
          cgstRate: 9,
          cgstAmount: inv.cgst,
          sgstRate: 9,
          sgstAmount: inv.sgst,
          totalAmount: inv.totalAmount,
          paymentMode: inv.paymentMethod || "UPI",
          paymentStatus: inv.status === "PAID" ? "Paid" : "Pending",
          transactionRef: `TXN-${inv.invoiceNumber.replace(/[^0-9]/g, "")}`,
          batchTiming: inv.batchTiming,
        }));
      }
    }
  } catch (err) {
    console.warn("Could not fetch invoices from backend, using local store:", err);
  }
  return getStoredInvoices();
}

