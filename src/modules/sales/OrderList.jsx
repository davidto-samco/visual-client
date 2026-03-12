export default function OrderList({ orders, selectedId, onSelect }) {
  return (
    <table className="w-full text-sm">
      <thead className="sticky top-0 bg-slate-100 border-b border-gray-200">
        <tr>
          <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase tracking-wide w-14">
            Job #
          </th>
          <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase tracking-wide">
            Customer
          </th>
          <th className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase tracking-wide w-20 shrink-0">
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
            <td className="px-3 py-2.5 text-gray-800 font-medium w-14">
              {order.jobNumber}
            </td>
            <td className="px-3 py-2.5 text-gray-600 max-w-0">
              <div className="truncate">{order.customerName}</div>
            </td>
            <td className="px-3 py-2.5 text-gray-500 w-20 shrink-0 tabular-nums">
              {formatDate(order.date)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  // dateStr is YYYY-MM-DD — show as MM/DD/YY
  const [y, m, d] = dateStr.split("-");
  if (!m || !d) return dateStr;
  return `${m}/${d}/${y.slice(2)}`;
}
