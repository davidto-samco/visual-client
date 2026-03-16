function fmt(val) {
  return `$${Number(val ?? 0).toFixed(2)}`;
}

export default function CostPricingCard({ part }) {
  return (
    <div className="border rounded p-4 space-y-2 text-sm">
      <h3 className="font-semibold">Cost & Pricing</h3>
      <Row label="Material Cost" value={fmt(part.materialCost)} />
      <Row label="Labor Cost" value={fmt(part.laborCost)} />
      <Row label="Burden Cost" value={fmt(part.burdenCost)} />
      <div className="border-t pt-2 mt-2">
        <Row label="Total Cost" value={fmt(part.totalCost)} highlight />
      </div>
      <Row label="Unit Price" value={fmt(part.unitPrice)} />
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex">
      <span className="w-36 text-gray-500 shrink-0">{label}</span>
      <span
        className={highlight ? "text-green-700 font-semibold" : "text-gray-900"}
      >
        {value}
      </span>
    </div>
  );
}
