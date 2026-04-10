import { useState, useCallback } from "react";
import OrderHeader from "./OrderHeader";
import OrderLineItems from "./OrderLineItems";
import OrderTotals from "./OrderTotals";
import OrderAcknowledgementPrint from "./OrderAcknowledgementPrint";
import QuoteDetail from "./QuoteDetail";
import { useOrderPrint } from "./useOrderPrint";
import { useAppStore } from "@/store/useAppStore";
import { salesApi } from "@/services/api";
import { Button } from "@/components/ui/button";

/**
 * Build an empty quote shell so components render with blank data
 * when the API returns 404 or any error.
 */
function emptyQuoteShell(quoteId) {
  return {
    quoteId: quoteId ?? "",
    status: "Inhouse",
    quoteDate: "",
    expirationDate: "",
    currency: "",
    customerName: "",
    customerId: "",
    customerAddress: "",
    contact: "",
    contactPhone: "",
    contactFax: "",
    contactPosition: "",
    salesRep: "",
    description: "",
    terms: "",
    shipVia: "",
    fob: "",
    freightTerms: "",
    leadTimeWeeks: null,
    lineItems: [],
    totalPrice: 0,
    formattedTotalPrice: "",
    linkedOrders: [],
    lineItemCount: 0,
  };
}

export default function OrderDetail({ order }) {
  const [showPreview, setShowPreview] = useState(false);
  const { printOrder } = useOrderPrint();

  const {
    salesSelectedQuote,
    setSalesSelectedQuote,
    salesQuoteView,
    setSalesQuoteView,
  } = useAppStore();

  const handleQuoteClick = useCallback(
    async (quoteId) => {
      if (!quoteId) return;

      // If we already have this quote loaded, just switch view
      if (salesSelectedQuote?.quoteId === quoteId) {
        setSalesQuoteView(true);
        return;
      }

      // Clear stale quote and switch to quote view
      setSalesSelectedQuote(null);
      setSalesQuoteView(true);

      try {
        const quote = await salesApi.getQuote(quoteId);
        setSalesSelectedQuote(quote);
      } catch {
        // Quote not found or fetch failed — render empty shell
        setSalesSelectedQuote(emptyQuoteShell(quoteId));
      }
    },
    [salesSelectedQuote?.quoteId, setSalesQuoteView, setSalesSelectedQuote],
  );

  const handleBackToOrder = useCallback(() => {
    setSalesQuoteView(false);
  }, [setSalesQuoteView]);

  // ── Quote view ──────────────────────────────────────────────────────────
  if (salesQuoteView) {
    return (
      <QuoteDetail
        quote={salesSelectedQuote}
        orderJobNumber={order.jobNumber}
        onBack={handleBackToOrder}
      />
    );
  }

  // ── Order view (default) ────────────────────────────────────────────────
  return (
    <div className="p-4 space-y-4">
      {/* Action bar: Print Preview, Print, Save as PDF */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          Order Acknowledgement — Job #{order.jobNumber}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={showPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreview((p) => !p)}
          >
            {showPreview ? "Close Preview" : "Print Preview"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => printOrder(order)}>
            Print
          </Button>
        </div>
      </div>

      {showPreview ? (
        /* Print preview — shows the exact PDF layout in an iframe */
        <OrderAcknowledgementPrint order={order} />
      ) : (
        <>
          {/* Order header — two-column layout */}
          <OrderHeader order={order} onQuoteClick={handleQuoteClick} />

          {/* Line items grid */}
          <OrderLineItems lineItems={order.lineItems} />

          {/* Totals footer */}
          <OrderTotals order={order} />
        </>
      )}
    </div>
  );
}
