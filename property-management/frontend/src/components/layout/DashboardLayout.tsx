import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          {isSidebarOpen && <span className="font-bold text-[#C9A24D]">Pelican Admin</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
            ☰
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {/* Navigation Items */}
          <a href="/dashboard" className="block p-3 rounded hover:bg-gray-800 transition text-[#C9A24D]">
             Dashboard
          </a>
          <a href="/dashboard/properties" className="block p-3 rounded hover:bg-gray-800 transition">
             Properties
          </a>
          <a href="/dashboard/inquiries" className="block p-3 rounded hover:bg-gray-800 transition">
             Inquiries
          </a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-end items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Lenience</span>
            <div className="w-8 h-8 bg-[#C9A24D] rounded-full"></div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}