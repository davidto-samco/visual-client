import { useCallback } from "react";
import { buildPrintHTML } from "./orderPrintBuilder";

// ---------------------------------------------------------------------------
// Hook: returns { printOrder, saveAsPDF } callbacks
// ---------------------------------------------------------------------------
export function useOrderPrint() {
  const openPrintWindow = useCallback((order) => {
    const html = buildPrintHTML(order);
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
      alert("Please allow pop-ups to print the order acknowledgement.");
      return;
    }
    win.addEventListener("afterprint", () => URL.revokeObjectURL(url));
    win.onload = () => setTimeout(() => win.print(), 300);
  }, []);

  const printOrder = useCallback(
    (order) => openPrintWindow(order),
    [openPrintWindow],
  );

  return { printOrder };
}
