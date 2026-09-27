import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PdfExportOptions {
  orientation?: "portrait" | "landscape";
  format?: "a4" | "letter";
  marginMm?: number;
  scale?: number;
  filename?: string;
}

/**
 * Directly downloads an HTML element as a crisp, high-resolution PDF file
 * saved straight into the user's Downloads folder without triggering window.print()
 * or the browser print dialog.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
  options?: PdfExportOptions
): Promise<void> {
  const orientation = options?.orientation || "portrait";
  const format = options?.format || "a4";
  const marginMm = options?.marginMm ?? 0;
  const scale = options?.scale ?? 2;

  // Pre-capture styling adjustments
  const originalBoxShadow = element.style.boxShadow;
  const originalTransform = element.style.transform;
  element.style.boxShadow = "none";
  element.style.transform = "none";

  const child = element.firstElementChild as HTMLElement | null;
  const originalChildShadow = child ? child.style.boxShadow : "";
  const originalChildRadius = child ? child.style.borderRadius : "";
  if (child) {
    child.style.boxShadow = "none";
    child.style.borderRadius = "0px";
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
    if (!str || !/(?:lab|lch|oklab|oklch)\(/i.test(str)) return str;
    if (tempCtx) {
      try {
        tempCtx.fillStyle = "#000000";
        tempCtx.fillStyle = str;
        const res = tempCtx.fillStyle;
        if (res && !/(?:lab|lch|oklab|oklch)\(/i.test(res)) {
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
      allowTaint: false, // Must be FALSE so canvas.toDataURL() never throws SecurityError
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(element.scrollWidth || 800, 800),
      imageTimeout: 15000,
      onclone: (clonedDoc, clonedElement) => {
        // Ensure white background and clean capture
        clonedElement.style.backgroundColor = "#ffffff";
        clonedElement.style.boxShadow = "none";
        clonedElement.style.transform = "none";

        // Remove any rounded corners or shadows from children in cloned DOM
        const clonedChild = clonedElement.firstElementChild as HTMLElement | null;
        if (clonedChild) {
          clonedChild.style.borderRadius = "0px";
          clonedChild.style.boxShadow = "none";
        }

        // 0. Intercept clonedDoc.defaultView.getComputedStyle to translate any lab/oklch color
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

        // 1. Sanitize style tags in clonedDoc: strip lab() and oklch() color functions that html2canvas cannot parse
        try {
          const styleElements = clonedDoc.querySelectorAll("style");
          styleElements.forEach((styleTag) => {
            if (styleTag.textContent && /(?:lab|lch|oklab|oklch)\(/i.test(styleTag.textContent)) {
              styleTag.textContent = styleTag.textContent
                .replace(/@supports\s*\([^{}]*(?:lab|oklch)[^{}]*\)\s*\{[^{}]*(\{[^{}]*\}[^{}]*)*\}/gi, "")
                .replace(/(?:lab|oklab|oklch|lch)\([^)]+\)/gi, "rgb(15, 23, 42)");
            }
          });
        } catch {
          // ignore
        }

        // 2. Remove any CSS stylesheet rules that contain unsupported lab() / oklch()
        try {
          for (let i = 0; i < clonedDoc.styleSheets.length; i++) {
            const sheet = clonedDoc.styleSheets[i];
            try {
              const rules = sheet.cssRules;
              if (!rules) continue;
              for (let j = rules.length - 1; j >= 0; j--) {
                const rule = rules[j];
                if (rule.cssText && /(?:lab|lch|oklab|oklch)\(/i.test(rule.cssText)) {
                  try {
                    sheet.deleteRule(j);
                  } catch {
                    // rule deletion may fail on read-only rules; fallback handled
                  }
                }
              }
            } catch {
              // Cross-origin stylesheet access restricted, safe to skip
            }
          }
        } catch {
          // ignore
        }

        // 3. Ensure no element inside clonedElement has an inline/computed lab() color
        try {
          const allNodes = [clonedElement, ...Array.from(clonedElement.querySelectorAll("*"))] as HTMLElement[];
          const colorProps = [
            "color",
            "backgroundColor",
            "borderColor",
            "borderTopColor",
            "borderRightColor",
            "borderBottomColor",
            "borderLeftColor",
          ] as const;

          for (const node of allNodes) {
            if (!node.style) continue;
            const computed = clonedDoc.defaultView?.getComputedStyle(node);
            if (!computed) continue;
            for (const prop of colorProps) {
              const val = computed[prop];
              if (val && /(?:lab|lch|oklab|oklch)\(/i.test(val)) {
                node.style[prop] = prop === "backgroundColor" ? "#ffffff" : "#0f172a";
              }
            }
          }
        } catch {
          // ignore
        }

        // 4. Sanitize SVG attributes (fill, stroke) in cloned document
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
      imgData = canvas.toDataURL("image/jpeg", 0.95);
    } catch {
      // Fallback to PNG if JPEG export is restricted
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

    const imgWidth = printableWidth;
    const imgHeight = (canvas.height * printableWidth) / canvas.width;

    // Single page check: If the content fits on 1 page (or within 5% overflow tolerance),
    // scale to fit cleanly on a single page!
    if (imgHeight <= printableHeight * 1.05) {
      const finalHeight = Math.min(imgHeight, printableHeight);
      pdf.addImage(imgData, "JPEG", marginMm, marginMm, imgWidth, finalHeight, undefined, "FAST");
    } else {
      // Multi-page document handling
      let heightLeft = imgHeight;
      let position = marginMm;
      let page = 0;

      while (heightLeft > 2) {
        if (page > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, "JPEG", marginMm, position, imgWidth, imgHeight, undefined, "FAST");
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
    if (child) {
      child.style.boxShadow = originalChildShadow;
      child.style.borderRadius = originalChildRadius;
    }
  }
}
