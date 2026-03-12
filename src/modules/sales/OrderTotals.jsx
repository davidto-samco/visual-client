export default function OrderTotals({ order }) {
  const preTotal = Number(order.grandTotal ?? order.totalAmount ?? 0); // pre-tax subtotal
  const tax = Number(order.tax ?? 0);
  const freight = Number(order.freight ?? 0);
  const grandTotal = Number(order.total ?? order.grandTotal ?? 0); // with tax

  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-slate-50 text-sm">
      <TotalItem label="Total" value={preTotal} />
      <TotalItem label={`Tax (${order.taxRate || "0"})`} value={tax} />
      <TotalItem label="Freight" value={freight} />
      <TotalItem label="Grand Total" value={grandTotal} highlight />
    </div>
  );
}

function TotalItem({ label, value, highlight }) {
  const formatted = `$${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <div>
      <span className="text-xs text-gray-400 uppercase tracking-wide block">
        {label}
      </span>
      <div
        className={`text-base font-semibold ${
          highlight ? "text-emerald-600" : "text-gray-800"
        }`}
      >
        {formatted}
      </div>
    </div>
  );
}
