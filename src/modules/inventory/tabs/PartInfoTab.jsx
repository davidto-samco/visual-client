import GeneralInfoCard from "../cards/GeneralInfoCard";
import CostPricingCard from "../cards/CostPricingCard";
import InventoryStatusCard from "../cards/InventoryStatusCard";
import VendorInfoCard from "../cards/VendorInfoCard";

export default function PartInfoTab({ part }) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-3">
      <GeneralInfoCard part={part} />
      <CostPricingCard part={part} />
      <InventoryStatusCard part={part} />
      <VendorInfoCard part={part} />
    </div>
  );
}
