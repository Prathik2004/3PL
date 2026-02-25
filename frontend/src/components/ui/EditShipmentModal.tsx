"use client"
import Image from "next/image"
import BasicInput from "./BasicInput"
import BasicButton from "./BasicButton"
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import BasicDropDownInput from "./BasicDropDownInput";
import PODReceived from "./PODReceived";

interface EditShipmentModalProps {
  shipmentId?: string;
  client?: string;
  carrier?: string;
  status?: string;
  origin?: string;
  dest?: string;
  dispatchDate?: Date;
  expDelivery?: Date;
  onClose?: () => void
}

const EditShipmentModal = ({shipmentId, client, carrier, status, origin, dest, dispatchDate, expDelivery, onClose}: EditShipmentModalProps) => {

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

  const StatusOptions=["In Transit", "Created", "Dispatched", "Delayed", "Delivered"]
//   const destinationOptions = [
//     "Austin, TX",
//     "Dallas, TX",
//     "Houston, TX",
//     "San Antonio, TX",
//     "Los Angeles, CA",
//     "San Diego, CA",
//     "San Francisco, CA",
//     "Phoenix, AZ",
//     "Denver, CO",
//     "Chicago, IL",
//     "Atlanta, GA",
//     "Miami, FL",
//     "New York, NY",
//     "Seattle, WA",
//     "Las Vegas, NV"
//   ];
// const originDestinationOptions = [
//     "Austin, TX",
//     "Dallas, TX",
//     "Houston, TX",
//     "San Antonio, TX",
//     "Los Angeles, CA",
//     "San Diego, CA",
//     "San Francisco, CA",
//     "Phoenix, AZ",
//     "Denver, CO",
//     "Chicago, IL",
//     "Atlanta, GA",
//     "Miami, FL",
//     "New York, NY",
//     "Seattle, WA",
//     "Las Vegas, NV"
//   ];
//   const deliveryServicesOptions = [
//     "UPS",
//     "FedEx",
//     "USPS",
//     "DHL Express",
//     "Amazon Logistics",
//     "OnTrac",
//     "LaserShip",
//     "Spee-Dee Delivery",
//     "Purolator",
//     "GLS"
//   ];

  const [shipment_Id, setShipmentId] = useState(shipmentId ?? "");
  const [clientName, setClient] = useState(client ?? "");
  const [carrierName, setCarrier] = useState(carrier ?? "");
  const [currentStatus, setStatus] = useState(status ?? "");
  const [originAddress, setOriginAddress] = useState(origin ?? "");
  const [destinationAddress, setDestination] = useState(dest ?? "");

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
        value={shipment_Id}
        onChange={(e) => setShipmentId(e.target.value)}/>
        <BasicInput text="Client Selection" value={clientName} placeholder="Enter Client" onChange={(e) => setClient(e.target.value)}  />
        <BasicInput text="Carrier Name" placeholder="Enter carrier name" onChange={(e) => setCarrier(e.target.value)} value={carrierName} />
        <BasicDropDownInput text="Current Status" options={StatusOptions} value={currentStatus} onChange={(e) => setStatus(e.target.value)} 
        />
      </div>
      {/* TIMELINE & ROUTE SECTION */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Image src="/icons/timeline.svg" alt="image" width={10} height={10} />
          <span className="text-[14px]/[20px] text-black"> TIMELINE & ROUTE </span>
        </div>
        <BasicInput text="Origin address" placeholder="Enter origin address" value={originAddress} onChange={(e) => setOriginAddress(e.target.value)} />
        <BasicInput value={destinationAddress} text="Destination address" placeholder="Enter destination" onChange={(e) => setDestination(e.target.value)} />
        <BasicInput type="datetime-local" text="Dispatch Date" placeholder="mm/dd/yy, --:--:--" onChange={(e) => setDispatchDate(e.target.value)} />
        <BasicInput type="datetime-local" text="Expected Delivery" placeholder="mm/dd/yy, --:--:--" onChange={(e) => setExpDel(e.target.value)} />
      </div>
      </div>
    {/* MODAL FOOTER */}
    <div className="bg-[#E2E8F0] flex items-center justify-between rounded-b-xl py-5 px-8">
      <PODReceived />
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
