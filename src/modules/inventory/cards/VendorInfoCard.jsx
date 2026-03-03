export default function VendorInfoCard({ part }) {
  return (
    <div className="border rounded p-4 space-y-2 text-sm">
      <h3 className="font-semibold">Vendor Information</h3>
      <Row label="Preferred Vendor" value={part.preferredVendor} />
      <Row label="Vendor ID" value={part.vendorId} />
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
