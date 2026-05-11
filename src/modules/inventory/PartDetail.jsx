import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PartInfoTab from "./tabs/PartInfoTab";
import WhereUsedTab from "./tabs/WhereUsedTab";
import PurchaseHistoryTab from "./tabs/PurchaseHistoryTab";

export default function PartDetail({ part }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">
        {part.partNumber} — {part.description}
      </h2>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Part Info</TabsTrigger>
          <TabsTrigger value="where-used">Where Used</TabsTrigger>
          <TabsTrigger value="purchase-history">Purchase History</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <PartInfoTab part={part} />
        </TabsContent>
        <TabsContent value="where-used">
          <WhereUsedTab part={part} />
        </TabsContent>
        <TabsContent value="purchase-history">
          <PurchaseHistoryTab part={part} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
