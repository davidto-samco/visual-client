import { NavLink } from "react-router-dom";
import { BarChart3, Package, Settings2 } from "lucide-react";

const modules = [
  { name: "Sales", path: "/sales", icon: BarChart3 },
  { name: "Inventory", path: "/inventory", icon: Package },
  { name: "Engineering", path: "/engineering", icon: Settings2 },
];

export default function Sidebar() {
  return (
    <aside className="w-48 bg-[#1a2332] text-white flex flex-col">
      <div className="px-4 py-5 border-b border-white/10">
        <h1 className="text-sm font-bold tracking-wide uppercase text-blue-300">
          Visual Samco
        </h1>
      </div>

      <nav className="flex-1 py-2">
        {modules.map((mod) => (
          <NavLink
            key={mod.path}
            to={mod.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-blue-600/30 text-blue-200 font-medium border-l-2 border-blue-400"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <mod.icon className="w-4 h-4" />
            {mod.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
