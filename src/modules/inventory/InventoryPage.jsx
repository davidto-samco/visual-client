import { useState } from "react";
import { useParams } from "react-router-dom";
import PartSearch from "./PartSearch";
import PartDetail from "./PartDetail";
import { parts } from "@/data/parts";

export default function InventoryPage() {
  const { partNumber } = useParams();
  const [selectedPart, setSelectedPart] = useState(
    partNumber ? parts.find((p) => p.partNumber === partNumber) : null,
  );

  const handleSearch = (query) => {
    const found = parts.find(
      (p) => p.partNumber.toLowerCase() === query.toLowerCase(),
    );
    setSelectedPart(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <PartSearch onSearch={handleSearch} />
      {selectedPart ? (
        <PartDetail part={selectedPart} />
      ) : (
        <div className="text-center text-gray-400 py-20 text-sm">
          Enter a part number to view details
        </div>
      )}
    </div>
  );
}
