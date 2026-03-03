import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppShell({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Dark sidebar — fixed width */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}
