import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import SalesPage from "./modules/sales/SalesPage";
import InventoryPage from "./modules/inventory/InventoryPage";
import EngineeringPage from "./modules/engineering/EngineeringPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/sales" replace />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/:partNumber" element={<InventoryPage />} />
        <Route path="/engineering" element={<EngineeringPage />} />
        <Route path="/engineering/:jobId" element={<EngineeringPage />} />
      </Routes>
    </AppShell>
  );
}
