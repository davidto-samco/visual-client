import { useState, useEffect, useCallback } from "react";
import OrderList from "./OrderList";
import OrderDetail from "./OrderDetail";
import FilterBar from "./FilterBar";
import { salesApi } from "@/services/api";

export default function SalesPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  // Load recent orders on mount
  useEffect(() => {
    loadRecentOrders();
  }, []);

  // Load full order detail whenever selection changes
  useEffect(() => {
    if (!selectedOrderId) return;
    setDetailLoading(true);
    setSelectedOrder(null);
    salesApi
      .getOrder(selectedOrderId)
      .then(setSelectedOrder)
      .catch((err) => setError(err.message))
      .finally(() => setDetailLoading(false));
  }, [selectedOrderId]);

  async function loadRecentOrders() {
    setListLoading(true);
    setError(null);
    try {
      const records = await salesApi.getRecentOrders(200);
      setOrders(records);
      if (records.length > 0) setSelectedOrderId(records[0].id);
    } catch (err) {
      setError(err.message);
    } finally {
      setListLoading(false);
    }
  }

  const handleFilter = useCallback(
    async (startDate, endDate) => {
      const filters = { ...activeFilters, startDate, endDate };
      setActiveFilters(filters);
      setListLoading(true);
      setError(null);
      try {
        const { records } = await salesApi.searchOrders(filters);
        setOrders(records);
        setSelectedOrderId(records[0]?.id ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setListLoading(false);
      }
    },
    [activeFilters],
  );

  const handleSearch = useCallback(
    async (searchBy, query) => {
      if (!query.trim()) return;
      const q = query.trim();

      if (searchBy === "jobNumber") {
        setSelectedOrderId(q.toUpperCase());
        return;
      }

      const filters = {
        ...activeFilters,
        ...(searchBy === "customerName" ? { customerName: q } : {}),
      };
      setActiveFilters(filters);
      setListLoading(true);
      setError(null);
      try {
        const { records } = await salesApi.searchOrders(filters);
        setOrders(records);
        setSelectedOrderId(records[0]?.id ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setListLoading(false);
      }
    },
    [activeFilters],
  );

  const handleClear = useCallback(() => {
    setActiveFilters({});
    loadRecentOrders();
  }, []);

  return (
    <div className="h-full flex flex-col gap-3">
      <FilterBar
        onFilter={handleFilter}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex-1 flex gap-3 min-h-0">
        {/* Order list panel */}
        <div className="w-80 shrink-0 overflow-auto border rounded-md bg-white">
          {listLoading ? (
            <div className="p-6 text-sm text-gray-400 text-center">
              Loading orders…
            </div>
          ) : (
            <OrderList
              orders={orders}
              selectedId={selectedOrderId}
              onSelect={setSelectedOrderId}
            />
          )}
        </div>

        {/* Order detail panel */}
        <div className="flex-1 overflow-auto border rounded-md bg-white relative">
          {detailLoading && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 bg-white">
              Loading order…
            </div>
          )}
          {!detailLoading && selectedOrder && (
            <OrderDetail order={selectedOrder} />
          )}
          {!detailLoading && !selectedOrder && !selectedOrderId && (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              Select an order to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
