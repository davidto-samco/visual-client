import { useEffect, useCallback } from "react";
import OrderList from "./OrderList";
import OrderDetail from "./OrderDetail";
import FilterBar from "./FilterBar";
import { salesApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";

export default function SalesPage() {
  const {
    salesOrders,
    setSalesOrders,
    salesSelectedOrderId,
    setSalesSelectedOrderId,
    salesSelectedOrder,
    setSalesSelectedOrder,
    salesActiveFilters,
    setSalesActiveFilters,
    salesListLoading,
    setSalesListLoading,
    salesInitialized,
    setSalesInitialized,
    setSalesSelectedQuote,
    setSalesQuoteView,
  } = useAppStore();

  const loadRecentOrders = useCallback(async () => {
    setSalesListLoading(true);
    try {
      const records = await salesApi.getRecentOrders(200);
      setSalesOrders(records);
      const currentSelection = useAppStore.getState().salesSelectedOrderId;
      if (records.length > 0 && !currentSelection) {
        setSalesSelectedOrderId(records[0].id);
      }
      setSalesInitialized(true);
    } catch {
      // silently fail
    } finally {
      setSalesListLoading(false);
    }
  }, [
    setSalesListLoading,
    setSalesOrders,
    setSalesSelectedOrderId,
    setSalesInitialized,
  ]);

  // Only load on first visit — skip if already initialized
  useEffect(() => {
    if (!salesInitialized) {
      loadRecentOrders();
    }
  }, [loadRecentOrders, salesInitialized]);

  // Load full order detail whenever selection changes
  useEffect(() => {
    if (!salesSelectedOrderId) return;

    // Reset quote view when switching orders
    setSalesQuoteView(false);
    setSalesSelectedQuote(null);

    // Already have this order loaded — skip
    if (salesSelectedOrder?.jobNumber === salesSelectedOrderId) return;

    setSalesSelectedOrder(null);
    salesApi
      .getOrder(salesSelectedOrderId)
      .then(setSalesSelectedOrder)
      .catch(() => {});
  }, [
    salesSelectedOrderId,
    salesSelectedOrder?.jobNumber,
    setSalesSelectedOrder,
    setSalesQuoteView,
    setSalesSelectedQuote,
  ]);

  const handleFilter = useCallback(
    async (startDate, endDate) => {
      const filters = { ...salesActiveFilters, startDate, endDate };
      setSalesActiveFilters(filters);
      setSalesListLoading(true);
      try {
        const { records } = await salesApi.searchOrders(filters);
        setSalesOrders(records);
        setSalesSelectedOrderId(records[0]?.id ?? null);
      } catch {
        // silently fail
      } finally {
        setSalesListLoading(false);
      }
    },
    [
      salesActiveFilters,
      setSalesActiveFilters,
      setSalesListLoading,
      setSalesOrders,
      setSalesSelectedOrderId,
    ],
  );

  const handleSearch = useCallback(
    async (searchBy, query) => {
      if (!query.trim()) return;
      const q = query.trim();

      if (searchBy === "jobNumber") {
        setSalesSelectedOrderId(q.toUpperCase());
        return;
      }

      const filters = {
        ...salesActiveFilters,
        ...(searchBy === "customerName" ? { customerName: q } : {}),
      };
      setSalesActiveFilters(filters);
      setSalesListLoading(true);
      try {
        const { records } = await salesApi.searchOrders(filters);
        setSalesOrders(records);
        setSalesSelectedOrderId(records[0]?.id ?? null);
      } catch {
        // silently fail
      } finally {
        setSalesListLoading(false);
      }
    },
    [
      salesActiveFilters,
      setSalesActiveFilters,
      setSalesListLoading,
      setSalesOrders,
      setSalesSelectedOrderId,
    ],
  );

  const handleClear = useCallback(() => {
    setSalesActiveFilters({});
    setSalesInitialized(false); // force reload
    loadRecentOrders();
  }, [setSalesActiveFilters, setSalesInitialized, loadRecentOrders]);

  return (
    <div className="h-full flex flex-col gap-3">
      <FilterBar
        onFilter={handleFilter}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <div className="flex-1 flex gap-3 min-h-0">
        <div className="w-80 shrink-0 overflow-auto border rounded-md bg-white">
          {salesListLoading ? (
            <div className="p-6 text-sm text-gray-400 text-center">
              Loading orders…
            </div>
          ) : (
            <OrderList
              orders={salesOrders}
              selectedId={salesSelectedOrderId}
              onSelect={setSalesSelectedOrderId}
            />
          )}
        </div>

        <div className="flex-1 overflow-auto border rounded-md bg-white relative">
          {!salesSelectedOrder && salesSelectedOrderId && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400 bg-white">
              Loading order…
            </div>
          )}
          {salesSelectedOrder && <OrderDetail order={salesSelectedOrder} />}
          {!salesSelectedOrder && !salesSelectedOrderId && (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              Select an order to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
