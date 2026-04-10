import { buildQuotePrintHTML } from "./quotePrintBuilder";

// ---------------------------------------------------------------------------
// Standalone preview component — renders the quote print layout in an iframe
// ---------------------------------------------------------------------------
export default function QuotePrintPreview({ quote }) {
  const html = buildQuotePrintHTML(quote);

  return (
    <iframe
      title={`Quote ${quote.quoteId} Print Preview`}
      srcDoc={html}
      className="w-full border border-gray-300 rounded-lg bg-white"
      style={{ height: "85vh", minHeight: 600 }}
    />
  );
}
