import { useState, Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";

function fmtCurrency(value) {
  const v = Number(value) || 0;
  if (v === 0) return "—";
  return `$${v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const columns = [
  { accessorKey: "line", header: "Line", size: 50 },
  { accessorKey: "qty", header: "Qty", size: 60 },
  { accessorKey: "description", header: "Description", size: 320 },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    size: 100,
    cell: ({ getValue }) => fmtCurrency(getValue()),
  },
  {
    accessorKey: "extension",
    header: "Extended Price",
    size: 110,
    cell: ({ getValue }) => fmtCurrency(getValue()),
  },
];

export default function QuoteLineItems({ lineItems }) {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const table = useReactTable({
    data: lineItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function toggleRow(lineNumber) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(lineNumber)) {
        next.delete(lineNumber);
      } else {
        next.add(lineNumber);
      }
      return next;
    });
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="bg-slate-100 border-b border-gray-200">
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="text-left px-3 py-2.5 font-medium text-gray-500 text-xs uppercase tracking-wide"
                  style={{ width: h.getSize() }}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => {
            const item = row.original;
            const hasExtDesc = !!item.extendedDescription;
            const isExpanded = expandedRows.has(item.line);

            return (
              <Fragment key={row.id}>
                <tr
                  className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-slate-50"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isDescCol = cell.column.id === "description";
                    return (
                      <td key={cell.id} className="px-3 py-2.5 text-gray-700">
                        {isDescCol && hasExtDesc ? (
                          <span
                            className="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => toggleRow(item.line)}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            )}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </span>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )
                        )}
                      </td>
                    );
                  })}
                </tr>
                {hasExtDesc && isExpanded && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-3 bg-blue-50/50 border-b border-gray-100 text-xs text-gray-600 whitespace-pre-line leading-relaxed"
                    >
                      {item.extendedDescription}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
