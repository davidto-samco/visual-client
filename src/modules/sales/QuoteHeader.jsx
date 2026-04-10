export default function QuoteHeader({ quote }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* ── Left column: Quote info ──────────────────────────────────────── */}
      <div className="border border-gray-200 rounded-lg p-4 space-y-1.5 text-sm bg-gray-50/50">
        <h3 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">
          Quote Information
        </h3>
        <Row label="Quote Date" value={quote.quoteDate} />
        <Row label="Quote ID" value={quote.quoteId} />
        <Row label="Status" value={quote.status} />
        <Row label="Customer" value={quote.customerName} />
        <Row label="Attention" value={quote.contact} />
        <Row label="Sales Rep" value={quote.salesRep} />
        <Row label="Currency" value={quote.currency} />
        {quote.leadTimeWeeks && (
          <Row label="Lead Time" value={`${quote.leadTimeWeeks} weeks`} />
        )}
        {quote.expirationDate && (
          <Row label="Expiration" value={quote.expirationDate} />
        )}
      </div>

      {/* ── Right column: Address & terms ────────────────────────────────── */}
      <div className="border border-gray-200 rounded-lg p-4 text-sm bg-gray-50/50">
        <h3 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">
          Customer Address
        </h3>
        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
          {quote.customerAddress}
        </p>

        <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
          {quote.terms && (
            <div>
              <span className="text-xs text-gray-400">Terms:</span>{" "}
              <span className="text-gray-700">{quote.terms}</span>
            </div>
          )}
          {quote.fob && (
            <div>
              <span className="text-xs text-gray-400">FOB:</span>{" "}
              <span className="text-gray-700">{quote.fob}</span>
            </div>
          )}
          {quote.shipVia && (
            <div>
              <span className="text-xs text-gray-400">Ship Via:</span>{" "}
              <span className="text-gray-700">{quote.shipVia}</span>
            </div>
          )}
          {quote.freightTerms && (
            <div>
              <span className="text-xs text-gray-400">Freight:</span>{" "}
              <span className="text-gray-700">{quote.freightTerms}</span>
            </div>
          )}
          {quote.linkedOrders.length > 0 && (
            <div>
              <span className="text-xs text-gray-400">Linked Orders:</span>{" "}
              <span className="text-gray-700 font-medium">
                {quote.linkedOrders
                  .map((o) => `#${o.customerOrderId}`)
                  .join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex py-0.5">
      <span className="w-36 text-gray-400 shrink-0">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
