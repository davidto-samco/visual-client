export default function OrderHeader({ order }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border border-gray-200 rounded-lg p-4 space-y-1.5 text-sm bg-gray-50/50">
        <h3 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">
          Order Information
        </h3>
        <Row label="Order Date" value={order.date} />
        <Row label="Job Number" value={order.jobNumber} />
        <Row label="Customer PO" value={order.poNumber} />
        <Row label="Status" value={order.status} />
        <Row label="Customer" value={order.customerName} />
        <Row label="Contact" value={order.contact} />
        <Row label="Ship Via" value={order.shipVia} />
        <Row label="Currency" value={order.currency} />
        <Row label="Desired Ship Date" value={order.desiredShipDate} />
      </div>

      <div className="border border-gray-200 rounded-lg p-4 text-sm bg-gray-50/50">
        <h3 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">
          Sold To / Ship To
        </h3>
        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
          {order.soldToAddress}
        </p>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <span className="text-xs text-gray-400">Terms:</span>{" "}
          <span className="text-gray-700">{order.terms}</span>
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
