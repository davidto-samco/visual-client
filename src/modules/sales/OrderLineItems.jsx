import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const columns = [
  { accessorKey: "line", header: "Line", size: 50 },
  { accessorKey: "qty", header: "Qty", size: 60 },
  { accessorKey: "baseLotId", header: "Base/Lot ID", size: 100 },
  { accessorKey: "partId", header: "Part ID", size: 80 },
  { accessorKey: "description", header: "Description", size: 280 },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    size: 100,
    cell: ({ getValue }) =>
      `$${Number(getValue()).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
  },
  {
    accessorKey: "extension",
    header: "Extension",
    size: 110,
    cell: ({ getValue }) =>
      `$${Number(getValue()).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
  },
];

export default function OrderLineItems({ lineItems }) {
  const table = useReactTable({
    data: lineItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${
                i % 2 === 0 ? "bg-white" : "bg-slate-50"
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2.5 text-gray-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
