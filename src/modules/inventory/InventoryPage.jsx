import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PartSearch from "./PartSearch";
import PartDetail from "./PartDetail";
import { inventoryApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

export default function InventoryPage() {
  const { partNumber: urlPartNumber } = useParams();
  const navigate = useNavigate();

  const {
    inventorySearchResults,
    setInventorySearchResults,
    inventoryPart,
    setInventoryPart,
    inventoryHasSearched,
    setInventoryHasSearched,
    inventoryLastQuery,
    setInventoryLastQuery,
  } = useAppStore();

  const fetchPart = useCallback(async (id) => {
    try {
      const data = await inventoryApi.getPart(id);
      setInventoryPart(data);
      setInventorySearchResults([]);
    } catch {
      setInventoryPart(null);
    }
  }, [setInventoryPart, setInventorySearchResults]);

  // If navigated to /inventory/:partNumber directly and we don't have it loaded yet
  useEffect(() => {
    if (urlPartNumber && inventoryPart?.partNumber !== urlPartNumber) {
      fetchPart(urlPartNumber);
    }
  }, [urlPartNumber, inventoryPart?.partNumber, fetchPart]);

  async function handleSearch(query) {
    if (!query.trim()) return;
    setInventoryHasSearched(true);
    setInventoryLastQuery(query.trim());
    setInventoryPart(null);
    setInventorySearchResults([]);
    navigate("/inventory", { replace: true });

    try {
      const { results } = await inventoryApi.searchParts(query.trim());
      setInventorySearchResults(results);
    } catch {
      setInventorySearchResults([]);
    }
  }

  async function handleSelectResult(partNumber) {
    navigate(`/inventory/${partNumber}`, { replace: true });
    await fetchPart(partNumber);
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <PartSearch onSearch={handleSearch} initialValue={inventoryLastQuery} />

      {!inventoryPart && inventorySearchResults.length > 0 && (
        <div className="border rounded-md overflow-hidden bg-white">
          <div className="bg-slate-50 border-b px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            {inventorySearchResults.length} results — click to view
          </div>
          <ul className="divide-y divide-gray-100 max-h-64 overflow-auto">
            {inventorySearchResults.map((r) => (
              <li
                key={r.partNumber}
                onClick={() => handleSelectResult(r.partNumber)}
                className="px-3 py-2.5 cursor-pointer hover:bg-blue-50 flex items-center gap-4 text-sm"
              >
                <span className="font-medium text-blue-700 w-32 shrink-0">
                  {r.partNumber}
                </span>
                <span className="text-gray-700 truncate">{r.description}</span>
                <span className="text-xs text-gray-400 ml-auto shrink-0">
                  {r.partType}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {inventoryPart && <PartDetail part={inventoryPart} />}

      {!inventoryPart &&
        inventoryHasSearched &&
        inventorySearchResults.length === 0 && (
          <div className="text-center text-gray-400 py-16 text-sm">
            No parts found
          </div>
        )}

      {!inventoryHasSearched && !inventoryPart && (
        <div className="text-center text-gray-400 py-16 text-sm">
          Enter a part number to view details
        </div>
      )}
    </div>
  );
}
