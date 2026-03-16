import { useState, useEffect } from "react";
import { inventoryApi } from "@/services/api";

const COLUMNS = [
  {
    key: "workOrderMaster",
    label: "Work Order / Master",
    className: "text-blue-700 font-medium",
  },
  { key: "seqNo", label: "Seq #", className: "text-gray-700 tabular-nums" },
  { key: "pieceNo", label: "Piece #", className: "text-gray-700 tabular-nums" },
  {
    key: "formattedQtyPer",
    label: "Quantity Per",
    className: "text-gray-700 tabular-nums",
  },
  {
    key: "formattedScrapPercent",
    label: "Scrap %",
    className: "text-gray-700 tabular-nums",
  },
  {
    key: "formattedFixedQty",
    label: "Fixed Qty",
    className: "text-gray-700 tabular-nums",
  },
  {
    key: "unitOfMeasure",
    label: "Unit of Measure",
    className: "text-gray-700",
  },
];

export default function WhereUsedTab({ part }) {
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const result = await inventoryApi.getWhereUsed(part.partNumber, {
          page,
          limit: 50,
        });
        if (cancelled) return;
        setRecords(result.records);
        setMeta(result.meta);
        setError(null);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [part.partNumber, page]);

  if (loading) {
    return (
      <div className="border rounded p-6 mt-3 text-sm text-gray-400 text-center">
        Loading where-used data…
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

  if (!records.length) {
    return (
      <div className="border rounded p-6 mt-3 text-sm text-gray-400 text-center">
        No where-used records found for {part.partNumber}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 border-b">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr
                key={i}
                className={`border-b border-gray-100 hover:bg-blue-50/50 ${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                {COLUMNS.map((col) => (
                  <td key={col.key} className={`px-3 py-2 ${col.className}`}>
                    {r[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <span>
            Page {meta.page} of {meta.totalPages} ({meta.total} total)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-2 py-1 border rounded disabled:opacity-40 hover:bg-gray-50"
            >
              ← Prev
            </button>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-2 py-1 border rounded disabled:opacity-40 hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
