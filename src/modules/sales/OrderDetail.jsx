import { useState } from "react";
import OrderHeader from "./OrderHeader";
import OrderLineItems from "./OrderLineItems";
import OrderTotals from "./OrderTotals";
import OrderAcknowledgementPrint from "./OrderAcknowledgementPrint";
import { useOrderPrint } from "./useOrderPrint";
import { Button } from "@/components/ui/button";

export default function OrderDetail({ order }) {
  const [showPreview, setShowPreview] = useState(false);
  const { printOrder } = useOrderPrint();

  return (
    <div className="p-4 space-y-4">
      {/* Action bar: Print Preview, Print, Save as PDF */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          Order Acknowledgement — Job #{order.jobNumber}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={showPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreview((p) => !p)}
          >
            {showPreview ? "Close Preview" : "Print Preview"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => printOrder(order)}>
            Print
          </Button>
        </div>
      </div>

      {showPreview ? (
        /* Print preview — shows the exact PDF layout in an iframe */
        <OrderAcknowledgementPrint order={order} />
      ) : (
        <>
          {/* Order header — two-column layout */}
          <OrderHeader order={order} />

          {/* Line items grid */}
          <OrderLineItems lineItems={order.lineItems} />

          {/* Totals footer */}
          <OrderTotals order={order} />
        </>
      )}
    </div>
  );
}
