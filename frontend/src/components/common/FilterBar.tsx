'use client';

import { useFilters } from '@/src/hooks/useFilters';
import { STATUS_OPTIONS } from '@/src/constants/filters';
// --- HELPER COMPONENTS ---
import { SearchDropdown } from'@/src/components/ui/dropdowns/SearchDropdown';
import { StatusDropdown } from'@/src/components/ui/dropdowns/StatusDropdown';
import { ExceptionsDropdown } from'@/src/components/ui/dropdowns/ExceptionsDropdown';
import { useFilterOptions } from'@/src/hooks/useFilterOptions';

// --- MAIN COMPONENT ---
export const FilterBar = () => {
 const { filters, updateFilter, clearFilters, isPending } = useFilters();
 const { clientOptions, carrierOptions, isLoading } = useFilterOptions();

 const hasActiveFilters = filters.status !=='all' || filters.carrier !=='all' || filters.client !=='all' || filters.exceptions !=='all';

 return (
 <div className="flex w-max items-center gap-4 rounded-xl bg-slate-50/80 px-4 py-2.5 shadow-sm border border-transparent">

 {/* Filter Icon & Label */}
 <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
 <path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" />
 </svg>
 <span className="text-[15px] font-bold text-slate-900 tracking-wide">Filter</span>
 </div>

 {/* Dropdowns */}
 <div className="flex items-center gap-5">
 <SearchDropdown
 label="Client"
 options={clientOptions}
 value={filters.client}
 onChange={(value) => updateFilter('client', value)}
 disabled={isPending || isLoading}
 />
 <SearchDropdown
 label="Carrier"
 options={carrierOptions}
 value={filters.carrier}
 onChange={(value) => updateFilter('carrier', value)}
 disabled={isPending || isLoading}
 />
 <StatusDropdown
 label="Status"
 options={STATUS_OPTIONS}
 value={filters.status}
 onChange={(value) => updateFilter('status', value)}
 disabled={isPending}
 />
 <ExceptionsDropdown
 value={filters.exceptions}
 onChange={(value) => updateFilter('exceptions', value)}
 disabled={isPending}
 />

 {hasActiveFilters && (
 <button
 onClick={clearFilters}
 className="text-sm text-slate-400 hover:text-slate-600 transition-colors ml-2 font-medium"
 >
 Clear
 </button>
 )}
 </div>

 </div>
 );
};
