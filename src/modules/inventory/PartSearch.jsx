import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PartSearch({ onSearch }) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 shrink-0">
        Part Number:
      </label>
      <Input
        placeholder="Enter part number (e.g., F0195)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch(query)}
        className="max-w-sm"
      />
      <Button onClick={() => onSearch(query)}>Search</Button>
    </div>
  );
}
