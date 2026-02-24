"use client";
import { useState } from "react";
import Image from "next/image";
import NewShipmentDropdown from "./NewShipmentDropdown";

const NewShipmentButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-[164.35px] h-9 rounded-lg flex items-center justify-center gap-2 bg-[#0F172A] active:scale-95 transition-transform"
      >
        <Image src="/icons/add.svg" alt="Plus" width={10} height={10} />
        <span className="text-white text-[14px]">New Shipment</span>
      </button>

      {/* Show dropdown if state is open */}
      {isOpen && <NewShipmentDropdown />}
    </div>
  );
};

export default NewShipmentButton;