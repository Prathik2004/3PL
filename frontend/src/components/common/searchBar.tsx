import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="relative flex-1 md:w-[600px] max-w-[600px] h-[43px]">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-[#64748B]" />
      </div>
      <input
        type="text"
        placeholder="Search entries, shipments, IDs..."
        className="w-full h-full bg-[#F1F5F9] pl-12 pr-4 rounded-lg text-[14px] text-[#0F172A] placeholder-[#64748B] focus:outline-none border border-transparent focus:border-slate-200 transition-all"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-bold text-slate-500 uppercase">
        <span>⌘</span>
        <span>K</span>
      </div>
    </div>
  )
}