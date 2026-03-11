import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PartSearch({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 shrink-0">
        Part Number:
      </label>
      <Input
        placeholder="Enter part number or pattern (e.g., F0195)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="max-w-sm"
        disabled={loading}
      />
      <Button onClick={handleSearch} disabled={loading || !query.trim()}>
        {loading ? "Searching…" : "Search"}
      </Button>
    </div>
  );
}
