import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PartSearch from "./PartSearch";
import PartDetail from "./PartDetail";
import { inventoryApi } from "@/services/api";

export default function InventoryPage() {
  const { partNumber: urlPartNumber } = useParams();
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState([]);
  const [part, setPart] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // If URL contains a part number on load, fetch it directly
  useEffect(() => {
    if (urlPartNumber) {
      fetchPart(urlPartNumber);
    }
  }, []);

  async function fetchPart(id) {
    setDetailLoading(true);
    setError(null);
    try {
      const data = await inventoryApi.getPart(id);
      setPart(data);
      setSearchResults([]);
    } catch (err) {
      setError(err.message);
      setPart(null);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleSearch(query) {
    if (!query.trim()) return;
    setSearchLoading(true);
    setError(null);
    setHasSearched(true);
    setPart(null);
    setSearchResults([]);
    navigate("/inventory", { replace: true });

    try {
      const { results } = await inventoryApi.searchParts(query.trim());
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleSelectResult(partNumber) {
    navigate(`/inventory/${partNumber}`, { replace: true });
    await fetchPart(partNumber);
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <PartSearch onSearch={handleSearch} loading={searchLoading} />

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* Multiple results list */}
      {!detailLoading && searchResults.length > 0 && (
        <div className="border rounded-md overflow-hidden bg-white">
          <div className="bg-slate-50 border-b px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            {searchResults.length} results — click to view
          </div>
          <ul className="divide-y divide-gray-100 max-h-64 overflow-auto">
            {searchResults.map((r) => (
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

      {/* Part detail */}
      {detailLoading && (
        <div className="text-sm text-gray-400 text-center py-16">
          Loading part…
        </div>
      )}

      {!detailLoading && part && <PartDetail part={part} />}

      {/* Empty states */}
      {!detailLoading && !part && hasSearched && searchResults.length === 0 && (
        <div className="text-center text-gray-400 py-16 text-sm">
          No parts found
        </div>
      )}

      {!hasSearched && !part && (
        <div className="text-center text-gray-400 py-16 text-sm">
          Enter a part number to view details
        </div>
      )}
    </div>
  );
}
