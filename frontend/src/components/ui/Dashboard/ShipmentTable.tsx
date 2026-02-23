<<<<<<< HEAD
import { ShipmentRowProps } from "@/src/types/types";
import ShipmentRow from "./ShipmentRow"
=======
"use client";

import { useState } from "react";
import { ShipmentRowProps } from "@/src/types/types";
import ShipmentRow from "./ShipmentRow"
import Pagination from "../Pagination";
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4

export const shipments: ShipmentRowProps[] = [
  {
    shipmentId: "#SHP-98231",
    client: "Alpha Retail Solutions",
    lastUpdated: "3hrs",
    carrier: "FedEx Ground",
    dest: "Austin, TX",
    expDel: "24/10 14:00",
    alert: "-",
    alertColor: "None",
    status: "IN TRANSIT",
  },
  {
    shipmentId: "#SHP-98245",
    client: "Zion Logistics Group",
    lastUpdated: "52hrs",
    carrier: "UPS Express",
    dest: "Chicago, IL",
    expDel: "24/10 14:00",
    alert: "NO UPDATE",
    alertColor: "Yellow",
    status: "DISPATCHED",
  },
  {
    shipmentId: "#SHP-98250",
    client: "Metro Food Dist.",
    lastUpdated: "1hr",
    carrier: "DHL Global",
    dest: "Seattle, WA",
    expDel: "25/10 10:00",
    alert: "-",
    alertColor: "None",
    status: "DISPATCHED",
  },
  {
    shipmentId: "#SHP-98255",
    client: "Summit Outfitter",
    lastUpdated: "4hrs",
    carrier: "FedEx Ground",
    dest: "New York, NY",
    expDel: "22/10 16:45",
    alert: "MISSING POD",
    alertColor: "Yellow",
    status: "DELIVERED",
  },
  {
    shipmentId: "#SHP-98260",
    client: "Global Tech Parts",
    lastUpdated: "1hr",
    carrier: "Regional Xpress",
    dest: "Denver, CO",
    expDel: "21/10 09:00",
    alert: "-",
    alertColor: "Red",
    status: "DELAYED",
  },
];

const ShipmentTable = () => {
<<<<<<< HEAD
  return (
    <div
    style={{
        fontFamily: "Inter"
    }} 
    className="w-279.5 max-h-screen bg rounded-2xl border border-[#E2E8F0] flex flex-col items-center justify-center bg-[#F5F9FF] relative overflow-x-auto">
        {/* TABLE HEADER */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center text-[#64748B] text-[12px] font-bold  h-[65.5px] w-full rounded-t-xl">
            <span className="flex-wrap">
                SHIPMENT ID & CLIENT        
            </span>
            <span>
                CARRIER            
            </span>
            <span>
                DESTINATION
            </span>
            <span className="flex-wrap">
                EXP. DELIVERY
            </span>
            <span>
                STATUS
            </span>
            <span>
                ALERTS
            </span>
            <span>
                ACTIONS
            </span>
        </div>
        {/* TABLE CONTENT */}
        <main>
        {
            shipments?.map((shipment, idx)=>(
                <div key={idx}>
                    <ShipmentRow shipmentId={shipment.shipmentId} client={shipment.client} expDel={shipment.expDel} lastUpdated={shipment.lastUpdated} carrier={shipment.carrier} dest={shipment.dest} alert={shipment.alert} alertColor={shipment.alertColor} status={shipment.status}   />
                </div>
            ))
        }
        </main>
        {/* TABLE FOOTER */}
        <div 
        className="flex items-center justify-evenly text-[#64748B] text-[12px] bg- w-full p-2">
            <span className="flex items-center justify-center gap-1">
                SHOWING
                {/* TODO: Number of rows being shown */}
                <span className="text-black"> 1-5 </span>
                OF 
                {/* TODO: Total number of rows */}
                <span className="text-black">
                    1240
                </span>
                    SHIPMENTS
            </span>
            <span>
                PAGINATIONS
            </span>
        </div>
=======
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 48; // As seen in the design
  const itemsPerPage = 5;
  const totalItems = 1240;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="w-full bg-[#F5F9FF] rounded-2xl border border-[#E2E8F0] relative overflow-hidden flex flex-col">
      {/* Scrollable Container */}
      <div className="overflow-x-auto w-full">
        <div className="min-w-[1100px] w-full">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_1fr_1fr] items-center px-6 text-[#64748B] text-[12px] font-bold h-[64px] w-full border-b border-[#E2E8F0] bg-slate-50/50">
            <span className="text-left py-2">SHIPMENT ID & CLIENT</span>
            <span className="text-center py-2">CARRIER</span>
            <span className="text-center py-2">DESTINATION</span>
            <span className="text-center py-2">EXP. DELIVERY</span>
            <span className="text-center py-2">STATUS</span>
            <span className="text-center py-2">ALERTS</span>
            <span className="text-center py-2">ACTIONS</span>
          </div>

          {/* TABLE CONTENT */}
          <div className="w-full flex flex-col">
            {shipments?.map((shipment, idx) => (
              <ShipmentRow
                key={idx}
                shipmentId={shipment.shipmentId}
                client={shipment.client}
                expDel={shipment.expDel}
                lastUpdated={shipment.lastUpdated}
                carrier={shipment.carrier}
                dest={shipment.dest}
                alert={shipment.alert}
                alertColor={shipment.alertColor}
                status={shipment.status}
              />
            ))}
          </div>
        </div>
      </div>

      {/* TABLE FOOTER */}
      <div className="flex items-center justify-between px-8 py-4 text-[#64748B] text-[12px] bg-white border-t border-[#E2E8F0] w-full">
        <div className="flex items-center gap-1">
          <span>SHOWING</span>
          <span className="text-slate-900 font-semibold px-1">{startIdx}-{endIdx}</span>
          <span>OF</span>
          <span className="text-slate-900 font-semibold px-1">{totalItems}</span>
          <span>SHIPMENTS</span>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
    </div>
  )
}

<<<<<<< HEAD
export default ShipmentTable
=======

export default ShipmentTable

>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
