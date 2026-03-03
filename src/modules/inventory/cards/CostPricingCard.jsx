export default function CostPricingCard({ part }) {
  return (
    <div className="border rounded p-4 space-y-2 text-sm">
      <h3 className="font-semibold">Cost & Pricing</h3>
      <Row label="Material Cost" value={`$${part.materialCost.toFixed(2)}`} />
      <Row label="Labor Cost" value={`$${part.laborCost.toFixed(2)}`} />
      <Row label="Burden Cost" value={`$${part.burdenCost.toFixed(2)}`} />
      <div className="border-t pt-2 mt-2">
        <Row
          label="Total Cost"
          value={`$${part.totalCost.toFixed(2)}`}
          highlight
        />
      </div>
      <Row label="Unit Price" value={`$${part.unitPrice.toFixed(2)}`} />
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
