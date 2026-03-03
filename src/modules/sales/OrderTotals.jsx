export default function OrderTotals({ order }) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-slate-50 text-sm">
      <TotalItem label="Grand Total" value={order.grandTotal} />
      <TotalItem label={`Tax (${order.taxRate})`} value={order.tax} />
      <TotalItem label="Freight" value={order.freight} />
      <TotalItem label="Total" value={order.total} highlight />
    </div>
  );
}

function TotalItem({ label, value, highlight }) {
  return (
    <div>
      <span className="text-xs text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <div
        className={`text-base font-semibold ${
          highlight ? "text-emerald-600" : "text-gray-800"
        }`}
      >
        ${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
