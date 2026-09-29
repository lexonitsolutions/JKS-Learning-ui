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
      windowWidth: 1280,
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
            width: 794px !important;
            min-width: 794px !important;
            max-width: 794px !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            transform: none !important;
            transition: none !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 auto !important;
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

        // 3. Reset cloned element attributes to canonical A4 dimensions (794px = 210mm at 96 DPI)
        const A4_WIDTH_PX = 794;
        clonedElement.style.width = `${A4_WIDTH_PX}px`;
        clonedElement.style.minWidth = `${A4_WIDTH_PX}px`;
        clonedElement.style.maxWidth = `${A4_WIDTH_PX}px`;
        clonedElement.style.backgroundColor = "#ffffff";
        clonedElement.style.color = "#0f172a";
        clonedElement.style.boxShadow = "none";
        clonedElement.style.borderRadius = "0px";
        clonedElement.style.border = "none";
        clonedElement.style.transform = "none";
        clonedElement.style.transition = "none";
        clonedElement.style.margin = "0 auto";
        clonedElement.style.boxSizing = "border-box";

        let parent = clonedElement.parentElement;
        while (parent && parent !== clonedDoc.body) {
          parent.style.width = `${A4_WIDTH_PX}px`;
          parent.style.minWidth = `${A4_WIDTH_PX}px`;
          parent.style.maxWidth = `${A4_WIDTH_PX}px`;
          parent.style.padding = "0";
          parent.style.margin = "0 auto";
          parent.style.overflow = "visible";
          parent = parent.parentElement;
        }
        clonedDoc.body.style.width = `${A4_WIDTH_PX}px`;
        clonedDoc.body.style.minWidth = `${A4_WIDTH_PX}px`;
        clonedDoc.body.style.overflow = "visible";

        const clonedChild = clonedElement.firstElementChild as HTMLElement | null;
        if (clonedChild) {
          clonedChild.style.borderRadius = "0px";
          clonedChild.style.boxShadow = "none";
          clonedChild.style.transition = "none";
          clonedChild.style.borderLeft = "none";
          clonedChild.style.borderRight = "none";
          clonedChild.style.borderBottom = "none";
          if (!clonedChild.className.includes("border-t-")) {
            clonedChild.style.borderTop = "none";
          }
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

    // Extract all clickable hyperlinks from the element for real PDF link annotations
    interface ExtractedLink {
      url: string;
      relX: number;
      relY: number;
      relW: number;
      relH: number;
    }
    const extractedLinks: ExtractedLink[] = [];
    const elRect = element.getBoundingClientRect();
    const aTags = Array.from(element.querySelectorAll<HTMLAnchorElement>("a[href]"));

    aTags.forEach((a) => {
      const href = a.getAttribute("href") || a.href;
      if (!href || href === "#" || href.startsWith("javascript:")) return;
      const rect = a.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0 || elRect.width <= 0 || elRect.height <= 0) return;

      extractedLinks.push({
        url: href,
        relX: (rect.left - elRect.left) / elRect.width,
        relY: (rect.top - elRect.top) / elRect.height,
        relW: rect.width / elRect.width,
        relH: rect.height / elRect.height,
      });
    });

    // Extract text nodes for ATS searchable & selectable text layer
    interface ExtractedText {
      text: string;
      relX: number;
      relY: number;
      fontSizePt: number;
    }
    const extractedTexts: ExtractedText[] = [];
    if (typeof document !== "undefined") {
      try {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
          const text = node.textContent?.trim();
          if (text && node.parentElement) {
            const parent = node.parentElement;
            const computed = window.getComputedStyle(parent);
            if (computed.display !== "none" && computed.visibility !== "hidden") {
              const range = document.createRange();
              range.selectNode(node);
              const rect = range.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0 && elRect.width > 0 && elRect.height > 0) {
                const fontSizePx = parseFloat(computed.fontSize) || 11;
                const fontSizePt = Math.max(6, Math.min(22, fontSizePx * 0.75));
                extractedTexts.push({
                  text,
                  relX: (rect.left - elRect.left) / elRect.width,
                  relY: (rect.top - elRect.top + rect.height * 0.78) / elRect.height,
                  fontSizePt,
                });
              }
            }
          }
          node = walker.nextNode();
        }
      } catch {
        // non-fatal
      }
    }

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

    // Use full available width with balanced margins
    const printableWidth = pdfWidth - marginMm * 2;
    const printableHeight = pdfHeight - marginMm * 2;

    const naturalImgHeight = (canvas.height * printableWidth) / canvas.width;

    // Single-page fit check: if singlePageFit option is requested (default for resumes) or naturally fits
    const shouldFitSinglePage = options?.singlePageFit ?? true;

    if (shouldFitSinglePage || naturalImgHeight <= printableHeight * 1.05) {
      // 1-page document: scale proportionally so full content fits on ONE single page
      const fitScale = Math.min(1, printableHeight / naturalImgHeight);
      const renderWidth = printableWidth * fitScale;
      const renderHeight = naturalImgHeight * fitScale;
      const xOffset = marginMm + (printableWidth - renderWidth) / 2;
      const yOffset = marginMm + (printableHeight - renderHeight) / 2;

      pdf.addImage(
        imgData,
        "JPEG",
        xOffset,
        yOffset,
        renderWidth,
        renderHeight,
        undefined,
        "FAST"
      );

      // Embed clickable hyperlink annotations with exact scaled coordinates
      extractedLinks.forEach((link) => {
        const linkX = xOffset + link.relX * renderWidth;
        const linkY = yOffset + link.relY * renderHeight;
        const linkW = link.relW * renderWidth;
        const linkH = link.relH * renderHeight;
        try {
          pdf.link(linkX, linkY, linkW, linkH, { url: link.url });
        } catch {}
      });

      // Embed ATS selectable & searchable text with exact scaled coordinates
      pdf.setFont("helvetica", "normal");
      extractedTexts.forEach((t) => {
        const textX = xOffset + t.relX * renderWidth;
        const textY = yOffset + t.relY * renderHeight;
        try {
          pdf.setFontSize(Math.max(5, t.fontSizePt * fitScale));
          pdf.text(t.text, textX, textY, { renderingMode: "invisible" });
        } catch {}
      });
    } else {
      // Multi-page document: slice page-by-page at printableHeight only when multi-page is explicitly allowed
      let heightLeft = naturalImgHeight;
      let page = 0;

      while (heightLeft > 2) {
        if (page > 0) {
          pdf.addPage();
        }
        const pagePosition = marginMm - page * printableHeight;
        pdf.addImage(
          imgData,
          "JPEG",
          marginMm,
          pagePosition,
          printableWidth,
          naturalImgHeight,
          undefined,
          "FAST"
        );

        // Add links that belong to this page
        extractedLinks.forEach((link) => {
          const totalY = marginMm + link.relY * naturalImgHeight;
          const pageStartY = marginMm + page * printableHeight;
          const pageEndY = pageStartY + printableHeight;
          if (totalY >= pageStartY && totalY < pageEndY) {
            const pageY = totalY - pageStartY + marginMm;
            const linkX = marginMm + link.relX * printableWidth;
            const linkW = link.relW * printableWidth;
            const linkH = link.relH * naturalImgHeight;
            try {
              pdf.link(linkX, pageY, linkW, linkH, { url: link.url });
            } catch {}
          }
        });

        // Add ATS selectable text that belongs to this page
        pdf.setFont("helvetica", "normal");
        extractedTexts.forEach((t) => {
          const totalY = marginMm + t.relY * naturalImgHeight;
          const pageStartY = marginMm + page * printableHeight;
          const pageEndY = pageStartY + printableHeight;
          if (totalY >= pageStartY && totalY < pageEndY) {
            const pageY = totalY - pageStartY + marginMm;
            const textX = marginMm + t.relX * printableWidth;
            try {
              pdf.setFontSize(t.fontSizePt);
              pdf.text(t.text, textX, pageY, { renderingMode: "invisible" });
            } catch {}
          }
        });

        heightLeft -= printableHeight;
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
