import React, { useState, useRef, useEffect } from 'react';

export interface DropdownOption<T = string> {
  label: string;
  value: T;
}

export interface FilterDropdownProps<T extends string> {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SearchDropdown = <T extends string>({ label, value, options, onChange, disabled }: FilterDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0] || { label: 'Loading...', value: '' };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative inline-flex items-center gap-1.5 cursor-pointer" ref={dropdownRef}>
      <div className={`flex items-center gap-1.5 outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) setSearchQuery('');
          }
        }}
      >
        <span className="text-[15px] font-medium text-slate-500">{label}:</span>
        <span className="text-[15px] font-bold text-slate-900">{selectedOption.label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 mt-0.5">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-[260px] rounded-[18px] border border-slate-100 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-50">
          <div className="relative mb-2 px-1 pt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input type="text" placeholder="Search" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-[10px] bg-[#f4f7f9] py-2 pl-10 pr-3 text-[14.5px] text-slate-900 outline-none placeholder:text-slate-500"
            />
          </div>
          <div className="h-px w-full bg-slate-100 mb-2 mt-1"></div>
          <div className="max-h-[280px] overflow-y-auto flex flex-col gap-0.5 px-1 pb-1 pt-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-[14px] text-slate-500 text-center">No results found</div>
            ) : null}
            {filteredOptions.map((opt) => (
              <div key={opt.value} className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <div className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] ${value === opt.value ? 'border-slate-800 bg-slate-800' : 'border-slate-300'}`}>
                  {value === opt.value && <div className="h-2 w-2 rounded-full bg-white"></div>}
                </div>
                <span className={`text-[15px] ${value === opt.value ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
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
