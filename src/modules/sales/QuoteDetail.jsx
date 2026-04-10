import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import QuoteHeader from "./QuoteHeader";
import QuoteLineItems from "./QuoteLineItems";
import QuotePrintPreview from "./QuotePrintPreview";
import { useQuotePrint } from "./useQuotePrint";
import { Button } from "@/components/ui/button";

const STATUS_STYLES = {
  Won: "bg-emerald-100 text-emerald-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Lost: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-500",
};

export default function QuoteDetail({ quote, orderJobNumber, onBack }) {
  const [showPreview, setShowPreview] = useState(false);
  const { printQuote } = useQuotePrint();

  // Guard against null/undefined quote during state transitions
  if (!quote) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        Loading quote…
      </div>
    );
  }

  const statusClass =
    STATUS_STYLES[quote.status] ?? "bg-gray-100 text-gray-600";

  return (
    <div>
      {/* ── Blue context bar ─────────────────────────────────────────────── */}
      <div className="bg-blue-50 border-b-2 border-blue-300 px-4 py-2 flex items-center gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Order #{orderJobNumber}
        </button>
        <span className="text-blue-300">|</span>
        <span className="text-sm text-blue-600">Viewing linked quote</span>
      </div>

      {/* ── Title bar ────────────────────────────────────────────────────── */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold">Quote {quote.quoteId}</h2>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${statusClass}`}
            >
              {quote.status}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={showPreview ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPreview((p) => !p)}
            >
              {showPreview ? "Close Preview" : "Print Preview"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => printQuote(quote)}
            >
              Print
            </Button>
          </div>
        </div>

        {showPreview ? (
          <QuotePrintPreview quote={quote} />
        ) : (
          <>
            {/* ── Quote header — two-column layout ──────────────────────── */}
            <QuoteHeader quote={quote} />

            {/* ── Line items ───────────────────────────────────────────── */}
            <QuoteLineItems
              lineItems={quote.lineItems}
              currency={quote.currency}
            />

            {/* ── Total ────────────────────────────────────────────────── */}
            <div className="flex justify-end border border-gray-200 rounded-lg p-4 bg-slate-50">
              <div className="text-right">
                <span className="text-xs text-gray-400 uppercase tracking-wide block">
                  Total Price
                </span>
                <div className="text-lg font-semibold text-emerald-600">
                  {quote.formattedTotalPrice}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
