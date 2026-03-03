import OrderHeader from "./OrderHeader";
import OrderLineItems from "./OrderLineItems";
import OrderTotals from "./OrderTotals";
import { Button } from "@/components/ui/button";

export default function OrderDetail({ order }) {
  return (
    <div className="p-4 space-y-4">
      {/* Action bar: Print Preview, Print, Save as PDF */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">
          Order Acknowledgement — Job #{order.jobNumber}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Print Preview
          </Button>
          <Button variant="outline" size="sm">
            Print
          </Button>
          <Button variant="outline" size="sm">
            Save as PDF
          </Button>
        </div>
      </div>

      {/* Order header — two-column layout */}
      <OrderHeader order={order} />

      {/* Line items grid */}
      <OrderLineItems lineItems={order.lineItems} />

      {/* Totals footer */}
      <OrderTotals order={order} />
    </div>
  );
}
