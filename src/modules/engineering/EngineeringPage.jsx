import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BOMTree from "./BOMTree";
import { engineeringApi } from "@/services/api";

export default function EngineeringPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedWO, setSelectedWO] = useState(null);
  const [treeData, setTreeData] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch() {
    const q = searchQuery.trim();
    if (!q) return;

    setSearchLoading(true);
    setError(null);
    setHasSearched(true);
    setTreeData(null);
    setSelectedWO(null);
    setSearchResults([]);

    try {
      const { records } = await engineeringApi.searchWorkOrders(q);
      setSearchResults(records);

      // Auto-select if only one result
      if (records.length === 1) {
        await loadTree(records[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSearchLoading(false);
    }
  }

  async function loadTree(wo) {
    setSelectedWO(wo);
    setTreeLoading(true);
    setError(null);
    try {
      const tree = await engineeringApi.getWorkOrderTree(wo.baseId, wo.lotId);
      setTreeData(tree);
    } catch (err) {
      setError(`Could not load tree: ${err.message}`);
      setTreeData(null);
    } finally {
      setTreeLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search bar */}
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm font-medium text-gray-700 shrink-0">
          Work Order:
        </label>
        <Input
          placeholder="Enter base ID (e.g., 8113)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="max-w-sm"
          disabled={searchLoading}
        />
        <Button
          onClick={handleSearch}
          disabled={searchLoading || !searchQuery.trim()}
        >
          {searchLoading ? "Searching…" : "Search"}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">
          {error}
        </div>
      )}

      {/* Multiple results list */}
      {searchResults.length > 1 && !treeData && (
        <div className="mb-3 border rounded-md overflow-hidden bg-white">
          <div className="bg-slate-50 border-b px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            {searchResults.length} work orders — click to load tree
          </div>
          <ul className="divide-y divide-gray-100 max-h-48 overflow-auto">
            {searchResults.map((wo, i) => (
              <li
                key={i}
                onClick={() => loadTree(wo)}
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

      {/* BOM Tree */}
      <div className="flex-1 border rounded bg-white overflow-auto relative">
        {treeLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
            Loading BOM tree…
          </div>
        )}
        {!treeLoading && treeData && <BOMTree data={treeData} />}
        {!treeLoading &&
          !treeData &&
          hasSearched &&
          searchResults.length === 0 && (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              No work orders found
            </div>
          )}
        {!treeLoading && !treeData && !hasSearched && (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            Search for a work order to view its BOM tree
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="mt-1 text-xs text-gray-500 px-1">
        {selectedWO
          ? `Showing: ${selectedWO.formattedId}`
          : hasSearched
            ? `${searchResults.length} result(s)`
            : ""}
      </div>
    </div>
  );
}
