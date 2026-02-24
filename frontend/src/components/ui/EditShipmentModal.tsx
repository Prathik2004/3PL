"use client"
import Image from "next/image"
import BasicInput from "./BasicInput"
import BasicButton from "./BasicButton"
import { motion } from "motion/react";
import { useEffect } from "react";

interface EditShipmentModalProps{
    shipmentId?: string;
    client?: string;
    carrier?: string;
    status?: string;
    origin?: string;
    dest?: string;
    dispatchDate?: Date;
    expDelivery?: Date;
    onClose: ()=> void
}

const EditShipmentModal = ({shipmentId, client, carrier, status, origin, dest, dispatchDate, expDelivery, onClose}: EditShipmentModalProps) => {

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    // cleanup to avoid memory leaks
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);
  return (
    <div onClick={onClose}
    style={{
      fontFamily: "Inter"
    }} 
    className="w-full rounded-xl border border-[#E2E8F0] fixed inset-0 flex md:items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto">
      <motion.div onClick={(e) => e.stopPropagation()}
      initial={{
        opacity:0,
        filter: "blur(10px)",
        scale:1
      }} 
      animate={{
        opacity:1,
        filter: "blur(0px)",
        scale: [1.5, 1]
      }}
      exit={{
        opacity:0,
        scale:0,
        filter: "blur(10px)"
      }}
      transition={{
        type: "spring",
        duration:0.5,
        ease: "easeInOut"
      }}
      className="flex flex-col">
      {/* HEADER */}
      <div className="bg-[#E2E8F0] py-5 px-8 rounded-t-xl flex items-center justify-between">
      <div className="w-[70%]  flex flex-col ">
        <span className="text-[22px]/[28px] font-bold">Edit Shipment {shipmentId} </span>
        <span className="text-[12px] text-[#64748B]">Update logistics details and status history.</span>
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
        <BasicInput text="Shipment Id" placeholder="#SHP-77241-LX" value={shipmentId} />
        <BasicInput text="Client Selection" placeholder="#Select Client" value={client} />
        <BasicInput text="Carrier Name" placeholder="Select approved carrier" value={carrier} />
        <BasicInput text="Current Status" placeholder="Created" value={status} />
      </div>
      {/* TIMELINE & ROUTE SECTION */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Image src="/icons/timeline.svg" alt="image" width={10} height={10} />
          <span className="text-[14px]/[20px] text-black"> TIMELINE & ROUTE </span>
        </div>
        <BasicInput text="Origin address" placeholder="Enter Origin Address" value={origin} />
        <BasicInput text="Destination address" placeholder="Enter Destination Address" value={dest} />
        <BasicInput text="Dispatch Date" placeholder="mm/dd/yy, --:--:--" value={dispatchDate?.toString()} />
        <BasicInput text="Expected Delivery" placeholder="mm/dd/yy, --:--:--" value={expDelivery?.toString()} />
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
        <BasicButton onClick={onClose} className="text-black bg-white border border-[#E2E8F0] py-2 px-4 rounded-lg cursor-pointer" text="Cancel" />
        <BasicButton className="bg-black text-white py-2 px-4 rounded-lg cursor-pointer" text="Create Shipment" />
      </div>
    </div>
    </motion.div>
    </div>
  )
}

export default EditShipmentModal
