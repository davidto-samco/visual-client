import BOMTreeNode from "./BOMTreeNode";

export default function BOMTree({ data }) {
  return (
    <div className="font-mono text-sm py-1">
      <BOMTreeNode node={data} depth={0} />
    </div>
  );
}
