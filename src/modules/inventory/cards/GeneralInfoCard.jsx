export default function GeneralInfoCard({ part }) {
  return (
    <div className="border rounded p-4 space-y-2 text-sm">
      <h3 className="font-semibold">General Information</h3>
      <Row label="Part Type" value={part.partType} />
      <Row label="Unit of Measure" value={part.uom} />
      <Row label="Material Code" value={part.materialCode} />
      <Row label="Drawing ID" value={part.drawingId} />
      <Row label="Drawing Rev" value={part.drawingRev} />
      <Row label="Weight" value={part.weight} />
    </div>
  );
}
