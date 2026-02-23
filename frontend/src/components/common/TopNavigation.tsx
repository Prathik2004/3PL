"use client";

import Image from 'next/image';
import { Search, Menu } from 'lucide-react'; 

export default function TopNavigation() {
  return (
    /* Removed border-b from here to make it "non-connecting" */
    <header className="relative w-full h-[80px] flex items-center justify-between px-4 md:px-[40px] bg-white">
      
      {/* 1. THE NON-CONNECTING LINE */}
      {/* We use ml-[40px] (or whatever gap you want) to stop it from touching the sidebar */}
      <div className="absolute bottom-0 left-[40px] right-[40px] h-[1px] bg-slate-100" />

      {/* Mobile Menu Icon */}
      <button className="block md:hidden mr-2">
        <Menu className="h-6 w-6 text-[#64748B]" />
      </button>

      {/* Search Bar Container */}
      <div className="relative flex-1 md:w-[600px] max-w-[600px] h-[43px]">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#64748B]" />
        </div>
        <input
          type="text"
          placeholder="Search entries, shipments, IDs..."
          className="w-full h-full bg-[#F1F5F9] pl-12 pr-4 rounded-lg text-[14px] text-[#0F172A] placeholder-[#64748B] focus:outline-none border border-transparent focus:border-slate-200 transition-all"
        />
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-[16px] h-[40px] ml-4 shrink-0">
        <div className="w-[40px] h-[40px] relative rounded-full overflow-hidden border border-slate-200">
          <Image
            src="/user-avatar.png" 
            alt="User Profile"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}