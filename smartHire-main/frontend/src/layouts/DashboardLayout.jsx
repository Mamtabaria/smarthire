import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f3f4f6]">
      <Navbar />
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-3 top-20 z-40 rounded-md bg-[#1e3a8a] p-2 text-white shadow sm:left-4"
        aria-label="Open sidebar"
      >
        <Menu size={18} />
      </button>

      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30"
          aria-label="Close sidebar backdrop"
        />
      )}

      <div className="flex w-full pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 px-3 pb-3 pt-14 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
