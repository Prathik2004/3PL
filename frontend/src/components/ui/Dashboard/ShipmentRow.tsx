import Image from "next/image";
import StatusIcon from "./StatusIcon";
import { ShipmentRowProps, StatusIconProps } from "@/src/types/types";


const ShipmentRow = ({shipmentId, client, lastUpdated, carrier, dest, expDel, alert, status, alertColor="None"}: ShipmentRowProps) => {
  return (
    <div
    style={{
                fontFamily:"Inter"
            }} 
    className={`w-279.5 h-30.25 ${alertColor === "Yellow" ? "bg-[#FFF7ED]" : alertColor === "None" ? "bg-white" : "bg-[#FFE8E8]" } grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center cursor-pointer`}>
        {/* SHIPMENTID & CLIENT */}
        <div className="flex flex-col w-36 h-12.75">
            <span className=" flex items-center gap-1 font-bold text-[16px] text-[#64748B]"> {shipmentId} {alertColor==="Yellow" ? <Image src="/icons/warning.svg" alt="Warning" width={12} height={12} /> : alertColor==="Red" ? <Image src="/icons/critical.svg" alt="Warning" width={3} height={3} /> : "" } </span>
            <span className="text-[12px] text-[#64748B]">
                {client}
            </span>
            <span className="text-[#94A3B8] text-[10px]">
                Last Updated: {lastUpdated} ago
            </span>
        </div>
        {/* CARRIER */}
        <div className="w-12.5 h-10">
            <span className="text-[14px]/[20px] text-[#0F172A]">
                {carrier}
            </span>
        </div>
        {/* DESTINATION */}
        <div className=" h-5">
            <span className="text-[#0F172A]"> {dest} </span>
        </div>
        {/* EXP. DELIVERY */}
        <div className="w-10.5 h-10 flex flex-col text-[#64748B] text-[14px]">
            {/* DATE & TIME */}
            {/* <span className="">
                24/10
            </span>
            <span className="">
                14:00
            </span> */}
            <span>
                {expDel?.toString()}
            </span>
        </div>
        {/* STATUS */}
        <StatusIcon text={status} />
        {/* ALERTS */}
        <div>
            <span className={`${alertColor==="Yellow" ? "text-[#D97706]" : alertColor==="Red" ? "text-[#DC2626]" : "text-[#64748B]"} text-[12px]/[16px]`}>
                {alert ?? "-"}
            </span>
        </div>
        {/* ACTIONS */}
        <div className="flex items-center justify-center w-28 h-17.25 cursor-pointer">
            <button> <Image src="/icons/delete.svg" alt="Delete" width={40} height={40} /> </button>
            <button> <Image src="/icons/edit.svg" alt="Delete" width={40} height={40} /> </button>
        </div>
    </div>
  )
}

export default ShipmentRow
