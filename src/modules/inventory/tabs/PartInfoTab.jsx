import GeneralInfoCard from "../cards/GeneralInfoCard";
import CostPricingCard from "../cards/CostPricingCard";
import SpecificationsCard from "../cards/SpecificationsCard";
import VendorInfoCard from "../cards/VendorInfoCard";

export default function PartInfoTab({ part }) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-3">
      <GeneralInfoCard part={part} />
      <CostPricingCard part={part} />
      <SpecificationsCard part={part} />
      <VendorInfoCard part={part} />
    </div>
  );
}
