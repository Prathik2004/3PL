'use client';

import React, { useEffect, useState } from 'react';

export interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileFilterSheet = ({ isOpen, onClose, children }: MobileFilterSheetProps) => {
  const [renderState, setRenderState] = useState(isOpen);

  // Sync state cleanly instead of doing it blindly in useEffect
  if (isOpen && !renderState) setRenderState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const timer = setTimeout(() => setRenderState(false), 300); // Wait for CSS transition
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!renderState) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden">
      
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div 
        className={`relative z-10 w-full max-h-[85vh] transform flex flex-col rounded-t-[28px] bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-[#0A0A0A] border-t border-slate-200 dark:border-zinc-800 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Drag handle */}
        <div className="flex w-full items-center justify-center pt-4 pb-2" onClick={onClose}>
          <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-zinc-800 cursor-grab" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-slate-100 dark:border-zinc-800/50">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">Filter Options</h2>
          <button 
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-10">
           <div className="flex flex-col gap-6">
              {children}
           </div>
        </div>
      </div>

    </div>
  );
};
