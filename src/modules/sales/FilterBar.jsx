import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const searchOptions = [
  { value: "jobNumber", label: "Job Number" },
  { value: "customerName", label: "Customer Name" },
  { value: "poNumber", label: "PO Number" },
];

export default function FilterBar({ onFilter, onSearch, onClear }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchBy, setSearchBy] = useState("jobNumber");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilter = () => {
    onFilter?.(startDate, endDate);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    onClear?.();
  };

  const handleSearch = () => {
    onSearch?.(searchBy, searchQuery);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Date range */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 shrink-0">Start Date</label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-36 h-8 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 shrink-0">End Date</label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-36 h-8 text-sm"
        />
      </div>

      <Button variant="outline" size="sm" onClick={handleFilter}>
        Filter
      </Button>
      <Button variant="ghost" size="sm" onClick={handleClear}>
        ✕ Clear
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 shrink-0">Search by</label>
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="h-8 px-2 text-sm border rounded-md bg-white"
        >
          {searchOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-40 h-8 text-sm"
        />
        <Button size="sm" onClick={handleSearch}>
          Search
        </Button>
      </div>
    </div>
  );
}
