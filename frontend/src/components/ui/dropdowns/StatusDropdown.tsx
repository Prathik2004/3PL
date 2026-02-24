import React, { useState, useRef, useEffect } from 'react';
import { FilterDropdownProps } from './SearchDropdown'; // importing shared Type

export const StatusDropdown = <T extends string>({ label, value, options, onChange, disabled }: FilterDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeLabel = options.find((opt) => opt.value === value)?.label || 'All';
  const displayLabel = value === 'all' ? 'All' : activeLabel;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-flex items-center gap-1.5 cursor-pointer" ref={dropdownRef}>
      <div className={`flex items-center gap-1.5 outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="text-[15px] font-medium text-slate-500">{label}:</span>
        <span className="text-[15px] font-bold text-slate-900">{displayLabel}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 mt-0.5">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-[240px] rounded-[18px] border border-slate-100 bg-white p-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50 flex flex-col gap-0.5">
          <div className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
            onClick={() => { onChange('all'); setIsOpen(false); }}
          >
            <div className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] ${value === 'all' ? 'border-slate-800 bg-slate-800' : 'border-slate-300'}`}>
              {value === 'all' && <div className="h-2 w-2 rounded-full bg-white"></div>}
            </div>
            <span className={`text-[15px] ${value === 'all' ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
              All
            </span>
          </div>
          {options.map((opt) => {
            const isActive = value === opt.value;
            return (
              <div key={opt.label} className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
              >
                <div className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] ${isActive ? 'border-slate-800 bg-slate-800' : 'border-slate-300'}`}>
                  {isActive && <div className="h-2 w-2 rounded-full bg-white"></div>}
                </div>
                <span className={`text-[15px] ${isActive ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                  {opt.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
