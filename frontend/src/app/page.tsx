"use client"
import { useState } from "react";
import BasicInput from "../components/ui/BasicInput";
import BulkUploadModal from "../components/ui/BulkUploadModal";
import DeleteModal from "../components/ui/DeleteModal";
import ExportModal from "../components/ui/ExportModal";

export default function Home() {

  const [openModal, setOpenModal]=useState(true)
  return (
    <h1 className="text-2xl font-semibold text-[#0F172A] p-10 space-y-5 min-h-screen">
      <ExportModal />
    </h1>
  );
}