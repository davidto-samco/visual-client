export default function InventoryStatusCard({ part }) {
  return (
    <div className="border rounded p-4 space-y-2 text-sm">
      <h3 className="font-semibold">Inventory Status</h3>
      <Row label="On Hand" value={part.onHand} />
      <Row label="Available" value={part.available} />
      <Row label="On Order" value={part.onOrder} />
      <Row label="In Demand" value={part.inDemand} />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex">
      <span className="w-36 text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
