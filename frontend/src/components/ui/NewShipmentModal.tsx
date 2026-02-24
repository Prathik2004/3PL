"use client"
import Image from "next/image"
import BasicInput from "./BasicInput"
import BasicButton from "./BasicButton"
import { ModalProps, CreateShipmentPayload } from "@/src/types/types"
import { motion } from "motion/react"
import { useState } from "react"
import { shipmentService } from "@/src/services/shipmentService"

const NewShipmentModal = ({ onClose }: ModalProps) => {
  const [formData, setFormData] = useState<CreateShipmentPayload>({
    shipment_id: "",
    client_name: "",
    carrier_name: "",
    origin: "",
    destination: "",
    dispatch_date: "",
    expected_delivery_date: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof CreateShipmentPayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await shipmentService.createShipment(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create shipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      // ref={scope}
      style={{
        fontFamily: "Inter"
      }}
      className="w-full rounded-xl border border-[#E2E8F0] fixed inset-0 flex md:items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto">
      <motion.div
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
          duration: 0.5,
          type: "spring",
          ease: "easeIn"
        }}
        className="flex flex-col box">
        {/* HEADER */}
        <div className="bg-[#E2E8F0] py-5 px-8 rounded-t-xl flex items-center justify-between">
          <div className="w-[70%]  flex flex-col ">
            <span className="text-[22px]/[28px] font-bold">Create New Shipment</span>
            <span className="text-[12px] text-[#64748B]">Initialize a new logistics entry for the 3PL system.</span>
            {error && <span className="text-[12px] text-red-500 mt-1">{error}</span>}
          </div>
          <button onClick={onClose} className="w-6 h-6 rounded-full bg-white flex items-center justify-center cursor-pointer">
            <Image src="icons/cross.svg" alt="close" width={10} height={10} />
          </button>
        </div>
        {/* CONTENT - LOGISTICS & TIMELINE */}
        <div className="flex md:flex-row flex-col items-center justify-between gap-5 py-8 px-12 bg-white">
          {/* LOGICTICS SECTION */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Image src="/icons/logictics.svg" alt="image" width={10} height={10} />
              <span className="text-[14px]/[20px] text-black"> LOGISTICS BASICS </span>
            </div>
            <BasicInput text="Shipment Id" placeholder="#SHP-77241-LX" value={formData.shipment_id} onChange={handleChange("shipment_id")} />
            <BasicInput text="Client Selection" placeholder="#Select Client" value={formData.client_name} onChange={handleChange("client_name")} />
            <BasicInput text="Carrier Name" placeholder="Select approved carrier" value={formData.carrier_name} onChange={handleChange("carrier_name")} />
            <BasicInput text="Current Status" placeholder="Created (Auto)" value="Created" onChange={() => { }} />
          </div>
          {/* TIMELINE & ROUTE SECTION */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Image src="/icons/timeline.svg" alt="image" width={10} height={10} />
              <span className="text-[14px]/[20px] text-black"> TIMELINE & ROUTE </span>
            </div>
            <BasicInput text="Origin address" placeholder="Enter Origin Address" value={formData.origin} onChange={handleChange("origin")} />
            <BasicInput text="Destination address" placeholder="Enter Destination Address" value={formData.destination} onChange={handleChange("destination")} />
            <BasicInput text="Dispatch Date" placeholder="mm/dd/yy, --:--:--" type="date" value={formData.dispatch_date} onChange={handleChange("dispatch_date")} />
            <BasicInput text="Expected Delivery" placeholder="mm/dd/yy, --:--:--" type="date" value={formData.expected_delivery_date} onChange={handleChange("expected_delivery_date")} />
          </div>
        </div>
        {/* MODAL FOOTER */}
        <div className="bg-[#E2E8F0] flex items-center justify-between rounded-b-xl py-5 px-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-5 bg-[#64748B] rounded-full relative z-5 flex items-center justify-start">
              <span className="w-5 h-5 rounded-full bg-white absolute z-10" />
            </div>
            <span className="text-[12px] text-[#64748B]">POD Received</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <BasicButton onClick={onClose} disabled={loading} className="text-black bg-white border border-[#E2E8F0] py-2 px-4 rounded-lg cursor-pointer" text="Cancel" />
            <BasicButton onClick={handleSubmit} disabled={loading} className="bg-black text-white py-2 px-4 rounded-lg cursor-pointer" text={loading ? "Creating..." : "Create Shipment"} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NewShipmentModal
