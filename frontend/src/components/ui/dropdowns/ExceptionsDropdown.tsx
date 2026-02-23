import React, { useState, useRef, useEffect } from 'react';

export const EXCEPTION_OPTIONS = [
  { label: 'No Update (>24h)', value: 'no_update', icon: 'orange' },
  { label: 'Missing POD', value: 'missing_pod', icon: 'red' },
  { label: 'Critical Delay', value: 'critical_delay', icon: 'yellow' },
];

export const ExceptionsDropdown = ({ value, onChange, disabled }: { value: string, onChange: (v: string) => void, disabled?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const displayLabel = value === 'all' ? 'All' : EXCEPTION_OPTIONS.find(o => o.value === value)?.label || 'All';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const IconMap = {
    'orange': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-[#F5A623]"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>,
    'red': <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-[#E02020]"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>,
    'yellow': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-[18px] h-[18px] text-[#F8E71C]"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  };

  return (
    <div className="relative inline-flex items-center gap-1.5 cursor-pointer" ref={dropdownRef}>
      <div 
        className={`flex items-center gap-1.5 outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="text-[15px] font-medium text-slate-500 dark:text-slate-400">Exceptions:</span>
        <span className="text-[15px] font-bold text-slate-900 dark:text-slate-100">{displayLabel}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 dark:text-slate-400 mt-0.5">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-[240px] rounded-[18px] border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden dark:border-zinc-800 dark:bg-zinc-950 z-50">
          
          <div className="flex items-center gap-2 bg-[#FFF0F0] dark:bg-[#341818] px-4 py-3 border-b border-[#FFE0E0] dark:border-[#4B2222]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[#D32F2F]"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            <span className="text-[15px] font-medium text-[#D32F2F]">Exceptions</span>
          </div>

          <div className="flex flex-col gap-0.5 p-2">
            <div 
              className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
              onClick={() => { onChange('all'); setIsOpen(false); }}
            >
              <div className="w-[18px] flex items-center justify-center">
                 {value === 'all' && <div className="h-1.5 w-1.5 rounded-full bg-slate-400"></div>}
              </div>
              <span className={`text-[15px] ${value === 'all' ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                All
              </span>
            </div>
            {EXCEPTION_OPTIONS.map((opt) => (
              <div 
                key={opt.value} 
                className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
              >
                {IconMap[opt.icon as keyof typeof IconMap]}
                <span className={`text-[15px] ${value === opt.value ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                  {opt.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
