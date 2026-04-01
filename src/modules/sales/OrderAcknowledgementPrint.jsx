import { buildPrintHTML } from "./orderPrintBuilder";

// ---------------------------------------------------------------------------
// Standalone preview component — renders the print layout inline in an iframe
// ---------------------------------------------------------------------------
export default function OrderAcknowledgementPrint({ order }) {
  const html = buildPrintHTML(order);

  return (
    <iframe
      title={`Order ${order.jobNumber} Print Preview`}
      srcDoc={html}
      className="w-full border border-gray-300 rounded-lg bg-white"
      style={{ height: "85vh", minHeight: 600 }}
    />
  );
}
