"use client"

import { Search } from "lucide-react"
import { useSearchShortcut } from "@/src/hooks/useSearchShortcut"

export default function SearchBar() {
  const { inputRef, isMac } = useSearchShortcut()

  return (
    <div className="relative flex-1 md:w-[600px] max-w-[600px] h-[43px]">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-[#64748B]" />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search entries, shipments, IDs..."
        className="w-full h-full bg-[#F1F5F9] pl-12 pr-16 rounded-lg text-[14px] text-[#0F172A] placeholder-[#64748B] focus:outline-none border border-transparent focus:border-blue-400/50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all duration-200 font-medium"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-slate-200/80 text-[10px] font-bold text-slate-500 uppercase cursor-default select-none border border-slate-300/50 backdrop-blur-sm shadow-sm">
        <span className={isMac ? "text-[12px]" : "text-[9px]"}>
          {isMac ? "⌘" : "Ctrl"}
        </span>
        <span>K</span>
      </div>
    </div>
  )
}