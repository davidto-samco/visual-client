import { useState } from "react";
import OrderList from "./OrderList";
import OrderDetail from "./OrderDetail";
import FilterBar from "./FilterBar";
import { orders } from "@/data/orders";
import { Button } from "@/components/ui/button";

export default function SalesPage() {
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Filter bar — date range + search */}
      <FilterBar />

      {/* Split: order list | order detail */}
      <div className="flex-1 flex gap-3 min-h-0">
        <div className="w-80 shrink-0 overflow-auto border rounded-md bg-white">
          <OrderList
            orders={orders}
            selectedId={selectedOrderId}
            onSelect={setSelectedOrderId}
          />
        </div>
        <div className="flex-1 overflow-auto border rounded-md bg-white">
          {selectedOrder && <OrderDetail order={selectedOrder} />}
        </div>
      </div>
    </div>
  );
}
