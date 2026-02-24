"use client"
import Image from "next/image"
import BasicInput from "./BasicInput"
import BasicButton from "./BasicButton"
import { ModalProps, CreateShipmentPayload } from "@/src/types/types"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import BasicDropDownInput from "./BasicDropDownInput"

const NewShipmentModal = ({onClose}: ModalProps) => {

  const StatusOptions=["In Transit", "Created", "Dispatched", "Delayed", "Delivered"]
  const destinationOptions = [
  "Austin, TX",
  "Dallas, TX",
  "Houston, TX",
  "San Antonio, TX",
  "Los Angeles, CA",
  "San Diego, CA",
  "San Francisco, CA",
  "Phoenix, AZ",
  "Denver, CO",
  "Chicago, IL",
  "Atlanta, GA",
  "Miami, FL",
  "New York, NY",
  "Seattle, WA",
  "Las Vegas, NV"
  ];
const originDestinationOptions = [
  "Austin, TX",
  "Dallas, TX",
  "Houston, TX",
  "San Antonio, TX",
  "Los Angeles, CA",
  "San Diego, CA",
  "San Francisco, CA",
  "Phoenix, AZ",
  "Denver, CO",
  "Chicago, IL",
  "Atlanta, GA",
  "Miami, FL",
  "New York, NY",
  "Seattle, WA",
  "Las Vegas, NV"
  ];
 const deliveryServicesOptions = [
    "UPS",
    "FedEx",
    "USPS",
    "DHL Express",
    "Amazon Logistics",
    "OnTrac",
    "LaserShip",
    "Spee-Dee Delivery",
    "Purolator",
    "GLS"
  ];

  const [shipmentId, setShipmentId]=useState<string>("");
  const [client, setClient]=useState<string>("");
  const [carrier,setCarrier]=useState<string>("");
  const [status, setStatus]=useState<string>("");
  const [originAddress, setOriginAddress]=useState<string>("");
  const [dest,setDest]=useState<string>("");
  const [dispathDate, setDispatchDate]=useState<string>("");
  const [expDel, setExpDel]=useState("")

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
    // ref={scope}
    style={{
      fontFamily: "Inter"
    }} 
    className="w-full rounded-xl border border-[#E2E8F0] fixed inset-0 flex md:items-center justify-center bg-black/30 backdrop-blur-sm overflow-y-auto">
      <motion.div onClick={(e) => e.stopPropagation()}
      initial={{
        opacity:0,
        filter: "blur(10px)",
        scale:0
      }} 
      animate={{
        scale:[1.5, 1],
        filter: "blur(0px)",
        opacity:1
      }}
      exit={{
        opacity:0,
        filter:"blur(10px)",
        scale:0
      }}
      transition={{
        duration: 0.5,
        type: "spring",
        ease: "easeIn"
      }}
      className="flex flex-col box">
      {/* HEADER */}
      <div className="bg-[#E2E8F0] py-5 px-8 rounded-t-xl flex items-center justify-between">
      <div className="w-[70%] flex flex-col ">
        <span className="text-[22px]/[28px] font-bold">Create New Shipment</span>
        <span className="text-[12px] text-[#64748B]">Initialize a new logistics entry for the 3PL system.</span>
      </div>
      <button onClick={onClose} className="w-6 h-6 rounded-full bg-white flex items-center justify-center cursor-pointer">
        <Image src="/icons/cross.svg" alt="close" width={10} height={10} />
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
        <BasicInput text="Shipment Id" placeholder="#SHP-77241-LX"
        onChange={(e) => setShipmentId(e.target.value)}/>
        <BasicInput text="Client Selection" placeholder="Select Client" onChange={(e) => setClient(e.target.value)} />
        <BasicDropDownInput text="Carrier Name" options={deliveryServicesOptions} onChange={(e) => setCarrier(e.target.value)} />
        <BasicDropDownInput text="Current Status" options={StatusOptions} onChange={(e) => setStatus(e.target.value)} 
        />
      </div>
      {/* TIMELINE & ROUTE SECTION */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Image src="/icons/timeline.svg" alt="image" width={10} height={10} />
          <span className="text-[14px]/[20px] text-black"> TIMELINE & ROUTE </span>
        </div>
        <BasicDropDownInput text="Origin address" options={originDestinationOptions} onChange={(e) => setOriginAddress(e.target.value)} />
        <BasicDropDownInput text="Destination address" options={destinationOptions} onChange={(e) => setDest(e.target.value)} />
        <BasicInput type="datetime-local" text="Dispatch Date" placeholder="mm/dd/yy, --:--:--" onChange={(e) => setDispatchDate(e.target.value)} />
        <BasicInput type="datetime-local" text="Expected Delivery" placeholder="mm/dd/yy, --:--:--" onChange={(e) => setExpDel(e.target.value)} />
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

export default NewShipmentModal
