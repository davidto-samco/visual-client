import { useLocation } from "react-router-dom";

const titles = {
  "/sales": "Sales",
  "/inventory": "Inventory",
  "/engineering": "Engineering",
};

export default function TopBar() {
  const location = useLocation();
  const basePath = "/" + location.pathname.split("/")[1];
  const title = titles[basePath] || "Dashboard";

  return (
    <header className="h-12 bg-white shadow-sm flex items-center px-4">
      <span className="text-sm font-medium text-gray-600">{title}</span>
    </header>
  );
}
