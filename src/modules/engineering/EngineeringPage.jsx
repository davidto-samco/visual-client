import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BOMTree from "./BOMTree";
import { bomData } from "@/data/bom";

export default function EngineeringPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBOM, setSelectedBOM] = useState(bomData[0]);

  return (
    <div className="h-full flex flex-col">
      {/* Search bar */}
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm font-medium text-gray-700 shrink-0">
          Work Order:
        </label>
        <Input
          placeholder="Enter work order number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            /* search logic */
          }}
        >
          Search
        </Button>
      </div>

      {/* Tree view — full height scroll */}
      <div className="flex-1 border rounded bg-white overflow-auto">
        {selectedBOM && <BOMTree data={selectedBOM} />}
      </div>

      {/* Status bar at bottom (like Visual Express) */}
      <div className="mt-1 text-xs text-gray-500 px-1">
        Loaded {bomData.length} orders
      </div>
    </div>
  );
}
