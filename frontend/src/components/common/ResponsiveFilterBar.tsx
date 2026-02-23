'use client';

import React, { useState } from 'react';
import { useFilters } from '@/src/hooks/useFilters';
import { useFilterOptions } from '@/src/hooks/useFilterOptions';
import { STATUS_OPTIONS } from '@/src/constants/filters';
import { SearchDropdown } from '@/src/components/ui/dropdowns/SearchDropdown';
import { StatusDropdown } from '@/src/components/ui/dropdowns/StatusDropdown';
import { ExceptionsDropdown } from '@/src/components/ui/dropdowns/ExceptionsDropdown';
import { MobileFilterSheet } from './MobileFilterSheet';

export const ResponsiveFilterBar = () => {
    const { filters, updateFilter, clearFilters, isPending } = useFilters();
    const { clientOptions, carrierOptions, isLoading } = useFilterOptions();
    const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

    const hasActiveFilters = filters.status !== 'all' || filters.carrier !== 'all' || filters.client !== 'all' || filters.exceptions !== 'all';
    
    // Extracted shared filter components so we don't repeat logic for Desktop vs Mobile
    const renderDropdowns = (
       <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full">
          <SearchDropdown 
            label="Client"
            options={clientOptions}
            value={filters.client}
            onChange={(v) => updateFilter('client', v)}
            disabled={isPending || isLoading}
          />
          <SearchDropdown 
            label="Carrier"
            options={carrierOptions}
            value={filters.carrier}
            onChange={(v) => updateFilter('carrier', v)}
            disabled={isPending || isLoading}
          />
          <StatusDropdown 
            label="Status"
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(v) => updateFilter('status', v)}
            disabled={isPending}
          />
          <ExceptionsDropdown 
            value={filters.exceptions}
            onChange={(v) => updateFilter('exceptions', v)}
            disabled={isPending}
          />
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="mt-2 sm:mt-0 text-[14px] font-medium text-slate-400 hover:text-slate-600 transition-colors dark:hover:text-slate-300 sm:ml-1"
            >
              Clear All
            </button>
          )}
       </div>
    );

    return (
        <div className="w-full">
           
           {/* Desktop Filter Row (Hidden on mobile) */}
           <div className="hidden sm:flex w-max items-center gap-4 rounded-[14px] bg-slate-50/80 border border-slate-200 px-4 py-2.5 shadow-sm dark:bg-[#0F0F0F]/80 dark:border-zinc-800 backdrop-blur-sm">
               
               {/* Fixed "Filter" prefix icon */}
               <div className="flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-zinc-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700 dark:text-slate-300">
                    <path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/>
                  </svg>
                  <span className="text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                     Filter
                  </span>
               </div>
               
               {/* Render Desktop Filters */}
               {renderDropdowns}
           </div>

           {/* Mobile Trigger Button (Hidden on desktop) */}
           <div className="flex sm:hidden w-full">
               <button 
                 onClick={() => setIsMobileSheetOpen(true)}
                 className="flex w-full items-center justify-between rounded-xl bg-white border border-slate-200 px-5 py-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:bg-[#0F0F0F] dark:border-zinc-800 active:scale-[0.98] transition-all"
               >
                 <div className="flex items-center gap-3 text-slate-700 dark:text-zinc-200 font-semibold text-[15px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>
                    </svg>
                    Filters
                 </div>
                 {hasActiveFilters && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                      •
                    </span>
                 )}
               </button>
           </div>

           {/* Mobile Bottom Sheet (Portaled visually inside parent wrapper) */}
           <MobileFilterSheet 
             isOpen={isMobileSheetOpen} 
             onClose={() => setIsMobileSheetOpen(false)}
           >
             {/* Drop the exact same visual dropdowns into the slide-up sheet */}
             {renderDropdowns}
             
             {/* Bottom Sheet Apply Button */}
             <div className="w-full pt-4 mt-2 border-t border-slate-100 dark:border-zinc-800/50">
                 <button 
                   onClick={() => setIsMobileSheetOpen(false)}
                   className="w-full flex h-14 items-center justify-center rounded-xl bg-[#0F172A] text-[15px] font-bold text-white transition-colors hover:bg-slate-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                 >
                   Apply Filters
                 </button>
             </div>
           </MobileFilterSheet>
           
        </div>
    )
}
