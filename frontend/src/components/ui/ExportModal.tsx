'use client';
import React, { useEffect, useState } from 'react';
import BasicButton from './BasicButton';
import { motion } from "motion/react"

export interface ExportModalProps {
  onClose?: () => void;
  onExport?: (format: 'csv' | 'excel') => void;
}

export const ExportModal = ({ onClose, onExport }: ExportModalProps) => {

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEsc);

    // cleanup to avoid memory leaks
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const [format, setFormat] = useState<'csv' | 'excel'>('csv');
  

  return (
    <div onClick={onClose} className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-100'>
      <motion.div onClick={(e) => e.stopPropagation()}
        initial={{
          opacity: 0,
          filter: "blur(10px)",
          scale: 0
        }}
        animate={{
          scale: [1.5, 1],
          filter: "blur(0px)",
          opacity: 1
        }}
        exit={{
          opacity: 0,
          filter: "blur(10px)",
          scale: 0
        }}
        transition={{
          type: "spring",
          ease: "easeIn",
          duration: 0.5
        }}
        className="w-[430px] rounded-[24px] bg-white p-8 px-10 shadow-[0_12px_45px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center text-center font-sans dark:bg-[#0F0F0F] dark:border-zinc-800">

        {/* Icon */}
        <div className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F8FAFC] dark:bg-[#1A1A1A]">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0F172A] dark:text-slate-200">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </div>

        {/* Text Content */}
        <h2 className="mb-2.5 text-[22px] font-bold text-[#0F172A] dark:text-zinc-100">Export Shipment Data?</h2>
        <p className="mb-8 text-[15px] leading-relaxed text-[#64748B] dark:text-zinc-500 px-1">
          Choose your preferred format to download the currently filtered list of shipments.
        </p>

        {/* Format Toggles */}
        <div className="mb-8 flex w-full gap-3">
          <BasicButton
            text="CSV File"
            onClick={() => setFormat('csv')}
            className={`h-12 flex-1 rounded-[10px] text-[14px] transition-all border ${format === 'csv'
                ? 'border-[#0F172A] font-bold text-[#0F172A] dark:border-zinc-300 dark:text-zinc-100'
                : 'border-slate-200 font-medium text-[#0F172A] hover:border-slate-300 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700'
              }`}
          />
          <BasicButton
            text="Excel (XLSX)"
            onClick={() => setFormat('excel')}
            className={`h-12 flex-1 rounded-[10px] text-[14px] transition-all border ${format === 'excel'
                ? 'border-[#0F172A] font-bold text-[#0F172A] dark:border-zinc-300 dark:text-zinc-100'
                : 'border-slate-200 font-medium text-[#0F172A] hover:border-slate-300 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700'
              }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-3">
          <BasicButton
            text="Cancel"
            onClick={onClose}
            className="h-12 flex-1 rounded-[10px] border border-slate-200 bg-white font-medium text-[#64748B] hover:bg-slate-50 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          />
          <BasicButton
            text="Export"
            onClick={() => {
              console.log(`Exporting as ${format}...`);
              onExport?.(format);
              onClose?.();
            }}
            className="h-12 flex-1 rounded-[10px] bg-[#0F172A] font-medium text-white hover:bg-slate-800 transition-colors dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ExportModal;
