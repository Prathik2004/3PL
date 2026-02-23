import Image from "next/image";
import StatusIcon from "./StatusIcon";
import { ShipmentRowProps, StatusIconProps } from "@/src/types/types";


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
          {alertColor === "Red" && <Image src="/icons/critical.svg" alt="Critical" width={14} height={14} />}
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
          <Image src="/icons/delete.svg" alt="Delete" width={20} height={20} className="opacity-60 group-hover:opacity-100" />
        </button>
        <button className="p-2 hover:bg-blue-50 rounded-full transition-colors group">
          <Image src="/icons/edit.svg" alt="Edit" width={20} height={20} className="opacity-60 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  )
}


export default ShipmentRow
