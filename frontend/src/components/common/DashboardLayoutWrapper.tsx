'use client';

import { useState } from 'react';
import Sidebar from "./Sidebar";
import TopNavigation from "./TopNavigation";

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden relative">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <TopNavigation onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 bg-[#F8FAF8] p-4 md:p-6 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
