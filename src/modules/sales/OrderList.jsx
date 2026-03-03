export default function OrderList({ orders, selectedId, onSelect }) {
  return (
    <table className="w-full text-sm">
      <thead className="sticky top-0 bg-slate-100 border-b border-gray-200">
        <tr>
          <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase tracking-wide">
            Job #
          </th>
          <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase tracking-wide">
            Customer
          </th>
          <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase tracking-wide">
            PO Number
          </th>
          <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase tracking-wide">
            Date
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr
            key={order.id}
            onClick={() => onSelect(order.id)}
            className={`cursor-pointer border-b border-gray-100 transition-colors ${
              order.id === selectedId
                ? "bg-blue-50 border-l-2 border-l-blue-500"
                : "hover:bg-gray-50/70"
            }`}
          >
            <td className="px-3 py-2.5 text-gray-800 font-medium">
              {order.jobNumber}
            </td>
            <td className="px-3 py-2.5 text-gray-600">{order.customerName}</td>
            <td className="px-3 py-2.5 text-gray-600">{order.poNumber}</td>
            <td className="px-3 py-2.5 text-gray-500">{order.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
