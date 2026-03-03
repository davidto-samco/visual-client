import { useState } from "react";

export default function BOMTreeNode({ node, depth }) {
  const [expanded, setExpanded] = useState(depth < 1); // auto-expand first level
  const hasChildren = node.children && node.children.length > 0;
  const indent = depth * 24; // pixels per level

  return (
    <div>
      {/* Node row */}
      <div
        className={`flex items-baseline cursor-pointer hover:bg-blue-50
          ${node.selected ? "bg-blue-600 text-white" : ""}`}
        style={{ paddingLeft: `${indent + 8}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Expand/collapse indicator — simple text arrow */}
        <span className="w-4 shrink-0 text-gray-400 select-none">
          {hasChildren ? (expanded ? "▾" : "▸") : " "}
        </span>

        {/* Description column — the main text */}
        <span className="flex-1 truncate pr-4">{node.label}</span>

        {/* Quantity */}
        <span className="w-20 text-right shrink-0 tabular-nums">
          {node.quantity?.toFixed(4)}
        </span>

        {/* Details */}
        <span className="w-24 text-right shrink-0 truncate text-gray-500 pl-2">
          {node.details || ""}
        </span>

        {/* Date range */}
        <span className="w-64 text-right shrink-0 text-gray-500 pl-2">
          {node.dateRange || ""}
        </span>
      </div>

      {/* Children — recursion */}
      {expanded && hasChildren && (
        <div>
          {node.children.map((child, i) => (
            <BOMTreeNode key={child.id || i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
