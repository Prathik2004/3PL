"use client";

import Image from 'next/image';
import { Menu } from 'lucide-react';
import SearchBar from './searchBar';

interface TopNavigationProps {
  onOpenMobileMenu?: () => void;
}

export default function TopNavigation({ onOpenMobileMenu }: TopNavigationProps) {
  return (
    <header className="relative w-full h-[80px] flex items-center justify-between px-4 lg:px-10 bg-white border-b border-slate-100">

      <div className="flex items-center flex-1 min-w-0 gap-4">
        {/* Mobile Menu Icon */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6 text-[#64748B]" />
        </button>

        {/* Search Bar Container */}
        <div className="flex-1 max-w-[600px] min-w-0">
          <SearchBar />
        </div>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-[16px] h-[40px] ml-4 shrink-0">
        <div className="w-[40px] h-[40px] relative rounded-full overflow-hidden border border-slate-200">
          <Image
            src="https://api.dicebear.com/9.x/adventurer/svg?seed=Brooklynn"
            alt="User Profile"
            fill
            unoptimized
          />
        </div>
      </div>
    </header>
  );
}