<<<<<<< HEAD
"use client"
import { useState } from "react";
=======
<<<<<<< HEAD
import ExportButton from "../components/ui/ExportButton";
import NewShipmentButton from "../components/ui/NewShipmentButton";

export default function Home() {
  return (
    <h1 className="text-2xl font-semibold text-[#0F172A] p-10 space-y-5">
        
=======
>>>>>>> bbd0ccaf3e2849c525a15a916a2723cca6ef0424
import BasicInput from "../components/ui/BasicInput";
import BulkUploadModal from "../components/ui/BulkUploadModal";
import DeleteModal from "../components/ui/DeleteModal";
import ExportModal from "../components/ui/ExportModal";

export default function Home() {

<<<<<<< HEAD
  const [openModal, setOpenModal]=useState(true)
  return (
    <h1 className="text-2xl font-semibold text-[#0F172A] p-10 space-y-5 min-h-screen">
      <ExportModal />
=======
      <BasicInput />
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
>>>>>>> bbd0ccaf3e2849c525a15a916a2723cca6ef0424
    </h1>
  );
}