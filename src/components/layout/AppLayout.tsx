import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useState, useEffect } from 'react';

export function AppLayout() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    // Close sidebar on mobile by default
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-cyan-950/90 to-slate-900 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto -mt-px">
          <Outlet />
        </main>
      </div>
    </div>
  );
}