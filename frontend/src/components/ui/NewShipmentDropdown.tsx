"use client";

import Image from "next/image";

interface DropdownItemProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

const DropdownItem = ({ icon, title, description, onClick }: DropdownItemProps) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 w-full p-4 hover:bg-slate-50 transition-colors text-left"
  >
    <div className="w-10 h-10 bg-[#F1F5F9] rounded-xl flex items-center justify-center shrink-0">
      <Image src={icon} alt={title} width={20} height={20} />
    </div>
    <div className="flex flex-col">
      <span className="text-[#0F172A] font-bold text-[16px]">{title}</span>
      <span className="text-[#64748B] text-[14px]">{description}</span>
    </div>
  </button>
);

export default function NewShipmentDropdown() {
  return (
    <div className="absolute top-12 right-0 w-[320px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
      {/* 3.1 Functional Requirements: Manual Entry  */}
      <DropdownItem 
        icon="/icons/Container.svg"
        title="Manual Entry"
        description="Create one single order"
        onClick={() => console.log("Manual Entry Clicked")}
      />

      {/* 3.1 Functional Requirements: CSV Bulk Upload  */}
      <DropdownItem 
        icon="/icons/bulkUpload.svg"
        title="Bulk Upload CSV"
        description="Process multiple shipments"
        onClick={() => console.log("Bulk Upload Clicked")}
      />

      {/* Footer per Figma design */}
      <div className="bg-[#F8FAFC] py-3 px-4 text-center border-t border-slate-50">
        <span className="text-[#94A3B8] text-[12px] font-medium uppercase tracking-wider">
          Requires .csv or .xlsx format
        </span>
      </div>
    </div>
  );
}