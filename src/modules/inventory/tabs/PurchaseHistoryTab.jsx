import { useState, useEffect, useMemo } from "react";
import { inventoryApi } from "@/services/api";

const SORT_OPTIONS = [
  { value: "orderDate", label: "By order date" },
  { value: "desiredRecvDate", label: "By desired recv date" },
  { value: "purchaseOrder", label: "By purchase order" },
];

const SEQUENCE_OPTIONS = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
];

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${parseInt(m)}/${parseInt(d)}/${y}`;
}

function formatQty(n) {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function formatPrice(n) {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}

function formatPercent(n) {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
}

export default function PurchaseHistoryTab({ part }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("orderDate");
  const [sequence, setSequence] = useState("desc");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await inventoryApi.getPurchaseHistory(part.partNumber);
        if (cancelled) return;
        setRecords(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [part.partNumber]);

  const sorted = useMemo(() => {
    const accessor = {
      orderDate: (r) => r.orderDate || "",
      desiredRecvDate: (r) => r.desiredRecvDate || "",
      purchaseOrder: (r) => r.purchaseOrder || "",
    }[sortBy];
    const dir = sequence === "asc" ? 1 : -1;
    return [...records].sort((a, b) => {
      const av = accessor(a),
        bv = accessor(b);
      if (av === bv) return 0;
      // Empty values always sort to the bottom regardless of direction
      if (!av) return 1;
      if (!bv) return -1;
      return av < bv ? -dir : dir;
    });
  }, [records, sortBy, sequence]);

  if (loading) {
    return (
      <div className="border rounded p-6 mt-3 text-sm text-gray-400 text-center">
        Loading purchase history…
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded p-6 mt-3 text-sm text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      {sorted.length === 0 ? (
        <div className="border rounded p-6 text-sm text-gray-400 text-center">
          No purchase history found for {part.partNumber}
        </div>
      ) : (
        <>
          <div className="text-xs text-gray-500 px-1">
            {sorted.length} {sorted.length === 1 ? "record" : "records"}
          </div>
          <div className="border rounded-lg overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-100 border-b">
                  {[
                    "Order Date",
                    "Desired Recv",
                    "Promise",
                    "Last Recv",
                    "Purchase Order",
                    "Del Sched",
                    "Vendor",
                    "Order Qty",
                    "Received Qty",
                    "Currency",
                    "Unit Price",
                    "Native Currency",
                    "Native Unit Price",
                    "Disc %",
                    "Fixed Cost",
                    "Std Unit Cost",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap bg-slate-100"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => (
                  <tr
                    key={`${r.purchaseOrder}-${r.lineNo}`}
                    className={`border-b border-gray-100 hover:bg-blue-50/50 ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {formatDate(r.orderDate)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {formatDate(r.desiredRecvDate)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {formatDate(r.promiseDate)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {formatDate(r.lastReceivedDate)}
                    </td>
                    <td className="px-3 py-2 text-blue-700 font-medium whitespace-nowrap">
                      {r.purchaseOrder}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={r.delSched}
                        readOnly
                        className="cursor-default"
                      />
                    </td>
                    <td
                      className="px-3 py-2 text-gray-700 whitespace-nowrap"
                      title={r.vendorDisplay}
                    >
                      {r.vendorDisplay}
                    </td>
                    <td className="px-3 py-2 text-gray-700 tabular-nums text-right">
                      {formatQty(r.orderQty)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 tabular-nums text-right">
                      {formatQty(r.receivedQty)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {r.currencyName}
                    </td>
                    <td className="px-3 py-2 text-gray-700 tabular-nums text-right">
                      {formatPrice(r.unitPrice)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {r.nativeCurrencyName}
                    </td>
                    <td className="px-3 py-2 text-gray-700 tabular-nums text-right">
                      {formatPrice(r.nativeUnitPrice)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 tabular-nums text-right">
                      {formatPercent(r.discPercent)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 tabular-nums text-right">
                      {formatPrice(r.fixedCost)}
                    </td>
                    <td className="px-3 py-2 text-gray-700 tabular-nums text-right">
                      {formatPrice(r.standardUnitCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="flex flex-wrap items-start gap-4 justify-end">
        <fieldset className="border rounded-md px-3 py-2">
          <legend className="text-xs font-medium text-gray-500 px-1">
            Sort
          </legend>
          <div className="flex gap-4">
            {SORT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="radio"
                  name="ph-sort"
                  checked={sortBy === opt.value}
                  onChange={() => setSortBy(opt.value)}
                  className="cursor-pointer"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="border rounded-md px-3 py-2">
          <legend className="text-xs font-medium text-gray-500 px-1">
            Sequence
          </legend>
          <div className="flex gap-4">
            {SEQUENCE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="radio"
                  name="ph-sequence"
                  checked={sequence === opt.value}
                  onChange={() => setSequence(opt.value)}
                  className="cursor-pointer"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
