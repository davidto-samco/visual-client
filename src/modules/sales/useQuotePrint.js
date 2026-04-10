import { useCallback } from "react";
import { buildQuotePrintHTML } from "./quotePrintBuilder";

// ---------------------------------------------------------------------------
// Hook: returns { printQuote } callback
// ---------------------------------------------------------------------------
export function useQuotePrint() {
  const openPrintWindow = useCallback((quote) => {
    const html = buildQuotePrintHTML(quote);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.outerWidth;
    const h = window.outerHeight;
    const left = window.screenX;
    const top = window.screenY;
    const win = window.open(
      url,
      "_blank",
      `width=${w},height=${h},left=${left},top=${top}`,
    );
    if (!win) {
      URL.revokeObjectURL(url);
      alert("Please allow pop-ups to print the quotation.");
      return;
    }
    win.addEventListener("afterprint", () => URL.revokeObjectURL(url));
    win.onload = () => setTimeout(() => win.print(), 300);
  }, []);

  const printQuote = useCallback(
    (quote) => openPrintWindow(quote),
    [openPrintWindow],
  );

  return { printQuote };
}
