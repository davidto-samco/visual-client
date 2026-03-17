import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  // ── Sales ────────────────────────────────────────────────────────────────
  const [salesOrders, setSalesOrders] = useState([]);
  const [salesSelectedOrderId, setSalesSelectedOrderId] = useState(null);
  const [salesSelectedOrder, setSalesSelectedOrder] = useState(null);
  const [salesActiveFilters, setSalesActiveFilters] = useState({});
  const [salesListLoading, setSalesListLoading] = useState(false);
  const [salesInitialized, setSalesInitialized] = useState(false);

  // ── Inventory ─────────────────────────────────────────────────────────────
  const [inventorySearchResults, setInventorySearchResults] = useState([]);
  const [inventoryPart, setInventoryPart] = useState(null);
  const [inventoryHasSearched, setInventoryHasSearched] = useState(false);
  const [inventoryLastQuery, setInventoryLastQuery] = useState("");

  // ── Engineering ───────────────────────────────────────────────────────────
  const [engineeringSearchResults, setEngineeringSearchResults] = useState([]);
  const [engineeringSelectedWO, setEngineeringSelectedWO] = useState(null);
  const [engineeringSimplifiedTree, setEngineeringSimplifiedTree] =
    useState(null);
  const [engineeringDetailedTree, setEngineeringDetailedTree] = useState(null);
  const [engineeringLastQuery, setEngineeringLastQuery] = useState("");
  const [engineeringHasSearched, setEngineeringHasSearched] = useState(false);
  const [engineeringTreeMode, setEngineeringTreeMode] = useState("simplified");

  return (
    <AppStoreContext.Provider
      value={{
        // Sales
        salesOrders,
        setSalesOrders,
        salesSelectedOrderId,
        setSalesSelectedOrderId,
        salesSelectedOrder,
        setSalesSelectedOrder,
        salesActiveFilters,
        setSalesActiveFilters,
        salesListLoading,
        setSalesListLoading,
        salesInitialized,
        setSalesInitialized,

        // Inventory
        inventorySearchResults,
        setInventorySearchResults,
        inventoryPart,
        setInventoryPart,
        inventoryHasSearched,
        setInventoryHasSearched,
        inventoryLastQuery,
        setInventoryLastQuery,

        // Engineering
        engineeringSearchResults,
        setEngineeringSearchResults,
        engineeringSelectedWO,
        setEngineeringSelectedWO,
        engineeringSimplifiedTree,
        setEngineeringSimplifiedTree,
        engineeringDetailedTree,
        setEngineeringDetailedTree,
        engineeringLastQuery,
        setEngineeringLastQuery,
        engineeringHasSearched,
        setEngineeringHasSearched,
        engineeringTreeMode,
        setEngineeringTreeMode,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}
