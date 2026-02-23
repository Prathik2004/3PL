"use client"
import Image from "next/image"
import { useState } from "react"
import ExportModal from "./ExportModal";
import { AnimatePresence } from "motion/react";

const ExportButton = () => {
  const [openExportModal, setOpenExportModal]=useState(false);
  return (
    <>
    <button onClick={()=> setOpenExportModal(true)}
    style={{
        fontFamily: "Inter"
    }}
    className="w-[110.35px] h-9 py-2 px-6 flex items-center justify-center bg-[#E2E8F0] border border-[#E2E8F0] rounded-lg gap-2 active:scale-95 transition-transform">
      <Image src="/icons/download.svg" alt="Export" width={10} height={10} />
      <span className="text-black text-[14px]">Export</span>
    </button>
    <AnimatePresence>
      {openExportModal && <ExportModal onClose={()=> setOpenExportModal(false)} />}
    </AnimatePresence>
    </>
  )
}

export default ExportButton
