import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BOMTree from "./BOMTree";
import { engineeringApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

export default function EngineeringPage() {
  const {
    engineeringSearchResults,
    setEngineeringSearchResults,
    engineeringSelectedWO,
    setEngineeringSelectedWO,
    engineeringSimplifiedTree,
    setEngineeringSimplifiedTree,
    engineeringDetailedTree,
    setEngineeringDetailedTree,
    engineeringLastQuery,
    setEngineeringLastQuery,
    engineeringHasSearched,
    setEngineeringHasSearched,
    engineeringTreeMode,
    setEngineeringTreeMode,
  } = useAppStore();

  const [searchLoading, setSearchLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  const [error, setError] = useState(null);

  // Separate drill-down depth per mode so switching preserves each tree's state
  const [expandedDepths, setExpandedDepths] = useState({
    simplified: 1,
    detailed: 1,
  });
  const expandedDepth = expandedDepths[engineeringTreeMode];
  const setExpandedDepth = (valOrFn) =>
    setExpandedDepths((prev) => ({
      ...prev,
      [engineeringTreeMode]:
        typeof valOrFn === "function"
          ? valOrFn(prev[engineeringTreeMode])
          : valOrFn,
    }));

  // The tree currently shown based on active mode
  const activeTree =
    engineeringTreeMode === "detailed"
      ? engineeringDetailedTree
      : engineeringSimplifiedTree;

  async function handleSearch() {
    const q = engineeringLastQuery.trim();
    if (!q) return;

    setSearchLoading(true);
    setError(null);
    setEngineeringHasSearched(true);
    setEngineeringSimplifiedTree(null);
    setEngineeringDetailedTree(null);
    setEngineeringSelectedWO(null);
    setEngineeringSearchResults([]);
    setExpandedDepths({ simplified: 1, detailed: 1 });

    try {
      const { records } = await engineeringApi.searchWorkOrders(q);
      setEngineeringSearchResults(records);
      if (records.length === 1) {
        await loadTree(records[0], engineeringTreeMode);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSearchLoading(false);
    }
  }

  /** Fetch tree for the given mode and cache it. */
  async function fetchAndCacheTree(wo, mode) {
    setTreeLoading(true);
    setError(null);
    try {
      if (mode === "detailed") {
        const tree = await engineeringApi.getDetailedWorkOrderTree(
          wo.baseId,
          wo.lotId,
        );
        setEngineeringDetailedTree(tree);
      } else {
        const tree = await engineeringApi.getWorkOrderTree(wo.baseId, wo.lotId);
        setEngineeringSimplifiedTree(tree);
      }
    } catch (err) {
      setError(`Could not load tree: ${err.message}`);
    } finally {
      setTreeLoading(false);
    }
  }

  /** Load tree when selecting a WO from search results. */
  async function loadTree(wo, mode) {
    setEngineeringSelectedWO(wo);
    setEngineeringSimplifiedTree(null);
    setEngineeringDetailedTree(null);
    setExpandedDepths({ simplified: 1, detailed: 1 });
    await fetchAndCacheTree(wo, mode);
  }

  /** Toggle between simplified ↔ detailed. Only fetches if not already cached. */
  async function handleToggleMode(newMode) {
    if (newMode === engineeringTreeMode) return;
    setEngineeringTreeMode(newMode);

    if (!engineeringSelectedWO) return;

    // Check if the target mode's tree is already cached
    const cached =
      newMode === "detailed"
        ? engineeringDetailedTree
        : engineeringSimplifiedTree;

    if (!cached) {
      await fetchAndCacheTree(engineeringSelectedWO, newMode);
    }
    // If cached, switching the mode state is enough — activeTree updates automatically
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm font-medium text-gray-700 shrink-0">
          Work Order:
        </label>
        <Input
          placeholder="Enter base ID (e.g., 8113)"
          value={engineeringLastQuery}
          onChange={(e) => setEngineeringLastQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-sm"
          disabled={searchLoading}
        />
        <Button
          onClick={handleSearch}
          disabled={searchLoading || !engineeringLastQuery.trim()}
        >
          {searchLoading ? "Searching…" : "Search"}
        </Button>

        {/* Simplified / Detailed toggle */}
        <div className="ml-auto flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
          <button
            onClick={() => handleToggleMode("simplified")}
            disabled={treeLoading}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              engineeringTreeMode === "simplified"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Simplified
          </button>
          <button
            onClick={() => handleToggleMode("detailed")}
            disabled={treeLoading}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              engineeringTreeMode === "detailed"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Detailed
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">
          {error}
        </div>
      )}

      {engineeringSearchResults.length > 1 && !activeTree && !treeLoading && (
        <div className="mb-3 border rounded-md overflow-hidden bg-white">
          <div className="bg-slate-50 border-b px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            {engineeringSearchResults.length} work orders — click to load tree
          </div>
          <ul className="divide-y divide-gray-100 max-h-48 overflow-auto">
            {engineeringSearchResults.map((wo, i) => (
              <li
                key={i}
                onClick={() => loadTree(wo, engineeringTreeMode)}
                className="px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center gap-4 text-sm"
              >
                <span className="font-medium text-blue-700 w-36 shrink-0">
                  {wo.formattedId}
                </span>
                <span className="text-gray-600 truncate">
                  {wo.partId ?? wo.partDescription ?? ""}
                </span>
                <span className="ml-auto text-xs shrink-0">
                  <span
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      wo.status === "C"
                        ? "bg-gray-100 text-gray-500"
                        : wo.status === "R"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {wo.formattedStatus ?? wo.status}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex-1 border rounded bg-white overflow-auto relative">
        {treeLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            Loading BOM tree…
          </div>
        )}
        {!treeLoading && activeTree && (
          <BOMTree
            data={activeTree}
            mode={engineeringTreeMode}
            expandedDepth={expandedDepth}
            onExpandedDepthChange={setExpandedDepth}
          />
        )}
        {!treeLoading &&
          !activeTree &&
          engineeringHasSearched &&
          engineeringSearchResults.length === 0 && (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              No work orders found
            </div>
          )}
        {!treeLoading && !activeTree && !engineeringHasSearched && (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            Search for a work order to view its BOM tree
          </div>
        )}
      </div>

      <div className="mt-1 text-xs text-gray-500 px-1">
        {engineeringSelectedWO
          ? `Showing: ${engineeringSelectedWO.formattedId} (${engineeringTreeMode})`
          : engineeringHasSearched
            ? `${engineeringSearchResults.length} result(s)`
            : ""}
      </div>
    </div>
  );
}
