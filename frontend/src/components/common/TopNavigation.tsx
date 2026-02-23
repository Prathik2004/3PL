"use client";

import Image from 'next/image';
import { Menu } from 'lucide-react'; 
import SearchBar from './searchBar';

export default function TopNavigation() {
  return (
    <header className="relative w-full h-[80px] flex items-center justify-between px-4 md:px-[40px] bg-white">
      <div className="absolute bottom-0 left-[40px] right-[40px] h-[1px] bg-slate-100" />

      {/* Mobile Menu Icon */}
      <button className="block md:hidden mr-2">
        <Menu className="h-6 w-6 text-[#64748B]" />
      </button>

      {/* Search Bar Container */}
      <SearchBar/>

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