import { useState } from "react";

/**
 * Returns color classes based on nodeType for detailed mode.
 *   OP  → green  (operation)
 *   MAT → red    (non-manufactured part / raw material)
 *   WO  → blue   (work order / manufactured sub-assembly)
 */
function getNodeColorClasses(nodeType) {
  switch (nodeType) {
    case "OP":
      return "text-green-800 bg-green-50 hover:bg-green-100";
    case "MAT":
      return "text-red-800 bg-red-50 hover:bg-red-100";
    case "WO":
      return "text-blue-800 bg-blue-50 hover:bg-blue-100";
    default:
      return "hover:bg-blue-50";
  }
}

export default function BOMTreeNode({
  node,
  depth,
  mode = "simplified",
  expandedDepth = 1,
}) {
  // Track manual override + which expandedDepth it was set at.
  // If expandedDepth changes, the override is stale and ignored — no effect needed.
  const [toggle, setToggle] = useState({ value: null, atDepth: expandedDepth });

  const manualToggle = toggle.atDepth === expandedDepth ? toggle.value : null;

  const hasChildren = node.children && node.children.length > 0;
  const expanded = manualToggle !== null ? manualToggle : depth < expandedDepth;
  const indent = depth * 24;

  const isDetailed = mode === "detailed";
  const colorClasses = isDetailed
    ? getNodeColorClasses(node.nodeType)
    : "hover:bg-blue-50";

  function handleClick() {
    if (hasChildren) {
      const current =
        manualToggle !== null ? manualToggle : depth < expandedDepth;
      setToggle({ value: !current, atDepth: expandedDepth });
    }
  }

  return (
    <div>
      {/* Node row */}
      <div
        className={`flex items-baseline cursor-pointer ${colorClasses}
          ${node.selected ? "bg-blue-600 text-white" : ""}`}
        style={{ paddingLeft: `${indent + 8}px` }}
        onClick={handleClick}
      >
        {/* Expand/collapse indicator — simple text arrow */}
        <span className="w-4 shrink-0 text-gray-400 select-none">
          {hasChildren ? (expanded ? "▾" : "▸") : " "}
        </span>

        {/* Node type badge for detailed mode */}
        {isDetailed && node.nodeType && (
          <span
            className={`w-8 shrink-0 text-[10px] font-bold mr-1.5 text-center rounded px-0.5 ${
              node.nodeType === "OP"
                ? "bg-green-200 text-green-800"
                : node.nodeType === "MAT"
                  ? "bg-red-200 text-red-800"
                  : "bg-blue-200 text-blue-800"
            }`}
          >
            {node.nodeType}
          </span>
        )}

        {/* Description column — the main text */}
        <span className="flex-1 truncate pr-4">{node.label}</span>

        {/* Quantity */}
        {node.quantity != null && (
          <span className="w-20 text-right shrink-0 tabular-nums">
            {node.quantity?.toFixed(4)}
          </span>
        )}

        {/* Details */}
        <span className="w-24 text-right shrink-0 truncate text-gray-500 pl-2">
          {node.details || ""}
        </span>

        {/* Date range */}
        {node.dateRange && (
          <span className="w-64 text-right shrink-0 text-gray-500 pl-2">
            {node.dateRange}
          </span>
        )}
      </div>

      {/* Children — recursion */}
      {expanded && hasChildren && (
        <div>
          {node.children.map((child, i) => (
            <BOMTreeNode
              key={child.id || i}
              node={child}
              depth={depth + 1}
              mode={mode}
              expandedDepth={expandedDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
}
