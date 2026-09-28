import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PdfExportOptions {
  orientation?: "portrait" | "landscape";
  format?: "a4" | "letter";
  marginMm?: number;
  scale?: number;
  filename?: string;
  singlePageFit?: boolean;
}

/**
 * Directly downloads an HTML element as a crisp, high-resolution PDF file
 * saved straight into the user's Downloads folder.
 *
 * Guarantees:
 * - 100% Light Mode enforcement during capture (no dark-mode wash-out or white-on-white text)
 * - Safe color translation so modern CSS (oklch, color-mix) converts cleanly to sRGB
 * - Proportional single-page fitting for resumes, certificates, and invoices so content
 *   never gets awkwardly sliced in half across pages.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
  options?: PdfExportOptions
): Promise<void> {
  const orientation = options?.orientation || "portrait";
  const format = options?.format || "a4";
  const marginMm = options?.marginMm ?? 0;
  const scale = options?.scale ?? 2.5;

  // Pre-capture styling adjustments
  const originalBoxShadow = element.style.boxShadow;
  const originalTransform = element.style.transform;
  const originalTransition = element.style.transition;
  element.style.boxShadow = "none";
  element.style.transform = "none";
  element.style.transition = "none";

  const child = element.firstElementChild as HTMLElement | null;
  const originalChildShadow = child ? child.style.boxShadow : "";
  const originalChildRadius = child ? child.style.borderRadius : "";
  const originalChildTransition = child ? child.style.transition : "";
  if (child) {
    child.style.boxShadow = "none";
    child.style.borderRadius = "0px";
    child.style.transition = "none";
  }

  const originalHostGetComputedStyle = typeof window !== "undefined" ? window.getComputedStyle : null;
  let tempCanvas: HTMLCanvasElement | null = null;
  let tempCtx: CanvasRenderingContext2D | null = null;
  if (typeof document !== "undefined") {
    tempCanvas = document.createElement("canvas");
    tempCanvas.width = 1;
    tempCanvas.height = 1;
    tempCtx = tempCanvas.getContext("2d");
  }

  const safeColor = (str: string): string => {
    if (!str || !/(?:lab|lch|oklab|oklch|color-mix)\(/i.test(str)) return str;
    if (tempCtx) {
      try {
        tempCtx.fillStyle = "#000000";
        tempCtx.fillStyle = str;
        const res = tempCtx.fillStyle;
        if (res && !/(?:lab|lch|oklab|oklch|color-mix)\(/i.test(res)) {
          return res;
        }
      } catch {
        // ignore
      }
    }
    return "rgb(15, 23, 42)";
  };

  const createSafeComputedStyleProxy = (style: CSSStyleDeclaration) => {
    return new Proxy(style, {
      get(target, prop: string | symbol) {
        if (prop === "getPropertyValue") {
          return (propertyName: string) => {
            const val = target.getPropertyValue(propertyName);
            return typeof val === "string" ? safeColor(val) : val;
          };
        }
        const val = (target as any)[prop];
        if (typeof val === "string") {
          return safeColor(val);
        }
        if (typeof val === "function") {
          return val.bind(target);
        }
        return val;
      },
    });
  };

  if (typeof window !== "undefined" && originalHostGetComputedStyle) {
    window.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
      const style = originalHostGetComputedStyle(elt, pseudoElt);
      return createSafeComputedStyleProxy(style);
    };
  }

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(element.scrollWidth || 800, 800),
      imageTimeout: 15000,
      onclone: (clonedDoc, clonedElement) => {
        // 1. Force light theme on cloned document root and body
        clonedDoc.documentElement.classList.remove("dark");
        clonedDoc.documentElement.removeAttribute("data-theme");
        clonedDoc.documentElement.style.colorScheme = "light";
        clonedDoc.documentElement.style.backgroundColor = "#ffffff";
        clonedDoc.documentElement.style.color = "#0f172a";

        clonedDoc.body.classList.remove("dark");
        clonedDoc.body.removeAttribute("data-theme");
        clonedDoc.body.style.colorScheme = "light";
        clonedDoc.body.style.backgroundColor = "#ffffff";
        clonedDoc.body.style.color = "#0f172a";

        // 2. Inject rock-solid light-theme variables and high-contrast color definitions
        const styleOverride = clonedDoc.createElement("style");
        styleOverride.id = "jks-pdf-light-theme-override";
        styleOverride.textContent = `
          :root, html, body {
            color-scheme: light !important;
            --background: #ffffff !important;
            --foreground: #0f172a !important;
            --text-primary: #0f172a !important;
            --text-secondary: #334155 !important;
            --text-muted: #64748b !important;
            --color-slate-50: #f8fafc !important;
            --color-slate-100: #f1f5f9 !important;
            --color-slate-200: #e2e8f0 !important;
            --color-slate-300: #cbd5e1 !important;
            --color-slate-400: #94a3b8 !important;
            --color-slate-500: #64748b !important;
            --color-slate-600: #475569 !important;
            --color-slate-700: #334155 !important;
            --color-slate-800: #1e293b !important;
            --color-slate-900: #0f172a !important;
            --color-slate-950: #020617 !important;
            --color-primary-blue: #1e5eff !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
          }
          .dark, [data-theme="dark"] {
            color-scheme: light !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
          }
          #printable-resume-sheet,
          #printable-resume-sheet * {
            color-scheme: light !important;
            box-sizing: border-box !important;
          }
          #printable-resume-sheet {
            background-color: #ffffff !important;
            color: #0f172a !important;
            transform: none !important;
            transition: none !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
          #printable-resume-sheet .text-slate-900 { color: #0f172a !important; }
          #printable-resume-sheet .text-slate-800 { color: #1e293b !important; }
          #printable-resume-sheet .text-slate-700 { color: #334155 !important; }
          #printable-resume-sheet .text-slate-600 { color: #475569 !important; }
          #printable-resume-sheet .text-slate-500 { color: #64748b !important; }
          #printable-resume-sheet .text-black { color: #000000 !important; }
          #printable-resume-sheet .border-slate-200 { border-color: #e2e8f0 !important; }
          #printable-resume-sheet .border-slate-300 { border-color: #cbd5e1 !important; }
          #printable-resume-sheet .bg-slate-50 { background-color: #f8fafc !important; }
          #printable-resume-sheet .bg-slate-100 { background-color: #f1f5f9 !important; }
          #printable-resume-sheet .bg-white { background-color: #ffffff !important; }
        `;
        clonedDoc.head.appendChild(styleOverride);

        // 3. Reset cloned element attributes
        clonedElement.style.backgroundColor = "#ffffff";
        clonedElement.style.color = "#0f172a";
        clonedElement.style.boxShadow = "none";
        clonedElement.style.transform = "none";
        clonedElement.style.transition = "none";

        const clonedChild = clonedElement.firstElementChild as HTMLElement | null;
        if (clonedChild) {
          clonedChild.style.borderRadius = "0px";
          clonedChild.style.boxShadow = "none";
          clonedChild.style.transition = "none";
        }

        // 4. Intercept clonedDoc.defaultView.getComputedStyle to translate any remaining lab/oklch colors
        try {
          const defaultView = clonedDoc.defaultView;
          if (defaultView) {
            const origClonedGetComputedStyle = defaultView.getComputedStyle.bind(defaultView);
            defaultView.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
              const style = origClonedGetComputedStyle(elt, pseudoElt);
              return createSafeComputedStyleProxy(style);
            };
          }
        } catch {
          // ignore
        }

        // 5. Sanitize SVG attributes (fill, stroke) in cloned document
        try {
          const svgNodes = clonedDoc.querySelectorAll("svg, path, circle, rect, line, polyline, polygon");
          svgNodes.forEach((node) => {
            const fill = node.getAttribute("fill");
            if (fill && /(?:lab|lch|oklab|oklch)\(/i.test(fill)) {
              node.setAttribute("fill", safeColor(fill));
            }
            const stroke = node.getAttribute("stroke");
            if (stroke && /(?:lab|lch|oklab|oklch)\(/i.test(stroke)) {
              node.setAttribute("stroke", safeColor(stroke));
            }
          });
        } catch {
          // ignore
        }
      },
    });

    let imgData: string;
    try {
      imgData = canvas.toDataURL("image/jpeg", 0.98);
    } catch {
      imgData = canvas.toDataURL("image/png");
    }

    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format,
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const printableWidth = pdfWidth - marginMm * 2;
    const printableHeight = pdfHeight - marginMm * 2;

    const naturalImgWidth = printableWidth;
    const naturalImgHeight = (canvas.height * printableWidth) / canvas.width;

    // Single-page proportional fit: If the content is within 1.35x of 1 A4 page (or explicitly requested),
    // scale it proportionally so it fits completely and beautifully on 1 page with no text cut in half!
    const shouldFitSinglePage =
      options?.singlePageFit ?? (naturalImgHeight <= printableHeight * 1.35);

    if (shouldFitSinglePage) {
      const scaleFactor = Math.min(1, printableHeight / naturalImgHeight);
      const renderWidth = naturalImgWidth * scaleFactor;
      const renderHeight = naturalImgHeight * scaleFactor;
      const xOffset = marginMm + (printableWidth - renderWidth) / 2;
      const yOffset = marginMm;

      pdf.addImage(imgData, "JPEG", xOffset, yOffset, renderWidth, renderHeight, undefined, "FAST");
    } else {
      // Multi-page document handling for genuinely long multi-page resumes
      let heightLeft = naturalImgHeight;
      let position = marginMm;
      let page = 0;

      while (heightLeft > 2) {
        if (page > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, "JPEG", marginMm, position, naturalImgWidth, naturalImgHeight, undefined, "FAST");
        heightLeft -= printableHeight;
        position -= printableHeight;
        page++;
      }
    }

    const safeFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

    // Direct Device Download: Uses Blob download to ensure file is saved straight to device
    const blob = pdf.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.style.display = "none";
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = safeFilename;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    setTimeout(() => {
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(blobUrl);
    }, 2000);
  } finally {
    if (typeof window !== "undefined" && originalHostGetComputedStyle) {
      window.getComputedStyle = originalHostGetComputedStyle;
    }
    element.style.boxShadow = originalBoxShadow;
    element.style.transform = originalTransform;
    element.style.transition = originalTransition;
    if (child) {
      child.style.boxShadow = originalChildShadow;
      child.style.borderRadius = originalChildRadius;
      child.style.transition = originalChildTransition;
    }
  }
}
