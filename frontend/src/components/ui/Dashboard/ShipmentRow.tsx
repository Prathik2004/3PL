import Image from "next/image";
import StatusIcon from "./StatusIcon";
<<<<<<< HEAD
import { ShipmentRowProps } from "@/src/types/types";
=======
import { ShipmentRowProps, StatusIconProps } from "@/src/types/types";
<<<<<<< HEAD


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
=======
import EditIcon from "@/public/icons/editIcon";
import DeleteIcon from "@/public/icons/deleteIcon";
import { Delete } from "lucide-react";
>>>>>>> bbd0ccaf3e2849c525a15a916a2723cca6ef0424


const ShipmentRow = ({ shipmentId, client, lastUpdated, carrier, dest, expDel, alert, status, alertColor = "None" }: ShipmentRowProps) => {
  return (
    <div
      className={`w-full min-h-[80px] ${alertColor === "Yellow"
        ? "bg-[#FFF7ED] hover:bg-[#FFEDD5]"
        : alertColor === "None"
          ? "bg-white hover:bg-slate-50"
          : "bg-[#FFE8E8] hover:bg-[#FEE2E2]"
        } grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_1fr_1fr] items-center px-6 border-b border-[#E2E8F0] cursor-pointer transition-colors duration-150`}>

      {/* SHIPMENTID & CLIENT */}
      <div className="flex flex-col py-3">
        <span className="flex items-center gap-2 font-bold text-[15px] text-slate-700">
          {shipmentId}
          {alertColor === "Yellow" && <Image src="/icons/warning.svg" alt="Warning" width={14} height={14} />}
          {alertColor === "Red" && <Image src="/icons/critical.svg" alt="Critical" width={3} height={3} />}
        </span>
        <span className="text-[13px] text-slate-500 font-medium">
          {client}
        </span>
        <span className="text-slate-400 text-[11px] mt-0.5">
          Last Updated: {lastUpdated} ago
        </span>
      </div>

      {/* CARRIER */}
      <div className="text-center">
        <span className="text-[14px] text-slate-700 font-medium">
          {carrier}
        </span>
      </div>

      {/* DESTINATION */}
      <div className="text-center">
        <span className="text-[14px] text-slate-700"> {dest} </span>
      </div>

      {/* EXP. DELIVERY */}
      <div className="flex flex-col items-center text-slate-600 text-[14px]">
        <span className="font-medium">
          {expDel?.toString()}
        </span>
      </div>

      {/* STATUS */}
      <div className="flex justify-center">
        <StatusIcon text={status} />
      </div>

      {/* ALERTS */}
      <div className="text-center">
        <span className={`${alertColor === "Yellow"
          ? "text-amber-600 bg-amber-50"
          : alertColor === "Red"
            ? "text-red-600 bg-red-50"
            : "text-slate-400"
          } text-[11px] font-bold px-2 py-1 rounded-md uppercase tracking-wider`}>
          {alert && alert !== "-" ? alert : "-"}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-center gap-1">
        <button className="p-2 hover:bg-red-50 rounded-full transition-colors group">
          <Image alt="delete" src={'/icons/delete.svg'} width={18} height={18}/>
        </button>
        <button className="p-2 hover:bg-blue-50 rounded-full transition-colors group">
          <Image alt="edit" src={'/icons/Edit.svg'} width={40} height={40}/>
        </button>
      </div>
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
    </div>
  )
}

<<<<<<< HEAD
=======

>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
export default ShipmentRow
