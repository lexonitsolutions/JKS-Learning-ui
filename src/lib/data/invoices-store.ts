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
  paymentMode: "UPI" | "Credit/Debit Card" | "Net Banking" | "No-Cost EMI" | "Free Course";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  enrollmentStatus?: "ACTIVE" | "PENDING" | "REJECTED" | string;
  isAutoApproved?: boolean;
  approvalMessage?: string;
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

      // Automatically sync student name and phone with local profile state and session
      if (typeof window !== "undefined") {
        const studentEmail = (data.studentEmail || "").toLowerCase().trim();
        const enteredName = (data.studentName || "").trim();
        const enteredPhone = (data.studentPhone || "").trim();

        if (enteredName && enteredName.length >= 2) {
          localStorage.setItem("jks_student_profile_name_v3", enteredName);
          if (studentEmail) {
            localStorage.setItem(`jks_student_profile_name_v3_${studentEmail}`, enteredName);
          }
          localStorage.setItem("jks_student_name", enteredName);
          localStorage.setItem("jks_user_name", enteredName);
        }

        if (enteredPhone && enteredPhone.length >= 10) {
          localStorage.setItem("jks_student_profile_phone_v3", enteredPhone);
          if (studentEmail) {
            localStorage.setItem(`jks_student_profile_phone_v3_${studentEmail}`, enteredPhone);
          }
          localStorage.setItem("jks_student_phone", enteredPhone);
        }

        const rawAuth = localStorage.getItem("jks_auth_user");
        if (rawAuth) {
          try {
            const parsed = JSON.parse(rawAuth);
            if (enteredName) parsed.name = enteredName;
            if (enteredPhone) parsed.phone = enteredPhone;
            localStorage.setItem("jks_auth_user", JSON.stringify(parsed));
          } catch {}
        }

        const match =
          document.cookie.match(/(?:^|; )jks_session=([^;]*)/) ||
          document.cookie.match(/(?:^|; )jks_mock_session=([^;]*)/);
        if (match?.[1]) {
          try {
            const sessionData = JSON.parse(decodeURIComponent(match[1]));
            if (enteredName) sessionData.name = enteredName;
            if (enteredPhone) sessionData.phone = enteredPhone;
            document.cookie = `jks_session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=604800; SameSite=Lax`;
            document.cookie = `jks_mock_session=${encodeURIComponent(JSON.stringify(sessionData))}; path=/; max-age=604800; SameSite=Lax`;
          } catch {}
        }

        window.dispatchEvent(new Event("jks-mock-session-change"));
        window.dispatchEvent(new Event("jks_profile_updated"));
      }

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
        paymentStatus: json.isAutoApproved || inv.status === "PAID" ? "Paid" : "Pending",
        enrollmentStatus: json.status || (json.isAutoApproved ? "ACTIVE" : "PENDING"),
        isAutoApproved: Boolean(json.isAutoApproved),
        approvalMessage: json.message,
        transactionRef: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        batchTiming: inv.batchTiming,
      };

      const current = getStoredInvoices();
      saveStoredInvoices([formatted, ...current]);
      return formatted;
    }

    const errData = await res.json().catch(() => ({}));
    const message =
      errData?.message ||
      (res.status === 403
        ? "Your account is currently on hold. You cannot enroll in courses at this time."
        : "Enrollment failed. Please check your credentials.");

    if (res.status === 403 || res.status === 400 || res.status === 409) {
      throw new Error(Array.isArray(message) ? message.join(", ") : message);
    }
  } catch (err: any) {
    if (
      err?.message &&
      (err.message.toLowerCase().includes("hold") ||
        err.message.toLowerCase().includes("blocked"))
    ) {
      throw err;
    }
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

