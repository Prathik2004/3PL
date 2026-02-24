"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ShipmentRowProps } from "@/src/types/types";
import ShipmentRow from "./ShipmentRow"
import Pagination from "../Pagination";

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
    alert: "CRITICAL DELAY",
    alertColor: "Red",
    status: "DELAYED",
  },
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
    alert: "CRITICAL DELAY",
    alertColor: "Red",
    status: "DELAYED",
  },
];

const ShipmentTable = ({ onlyExceptions = false }: { onlyExceptions?: boolean }) => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Safely extract our Filter parameters from the URL
  const currentStatus = searchParams.get('status') || 'all';
  const currentCarrier = searchParams.get('carrier') || 'all';
  const currentClient = searchParams.get('client') || 'all';
  const currentException = searchParams.get('exceptions') || 'all';

  // 2. Perform Filtering logic locally over dummy data (to simulate backend DB query)
  const filteredShipments = useMemo(() => {
    // Repeat dummy data twice just for volume like you had
    const allShipments = [...shipments, ...shipments];

    return allShipments.filter((shipment) => {
      // If we only want exceptions, filter out anything where alert is "-" or empty
      if (onlyExceptions && (!shipment.alert || shipment.alert === '-')) {
        return false;
      }

      // Normalize helpers
      const normalize = (str: string | null) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Status Match
      let matchesStatus = true;
      if (currentStatus && currentStatus.toLowerCase() !== 'all') {
         const s = normalize(shipment.status);
         const t = normalize(currentStatus);
         matchesStatus = s === t || (s !== '' && t !== '' && (s.includes(t) || t.includes(s)));
      }

      // Carrier Partial Match
      let matchesCarrier = true;
      if (currentCarrier && currentCarrier.toLowerCase() !== 'all') {
         matchesCarrier = (shipment.carrier || '').toLowerCase().includes(currentCarrier.toLowerCase());
      }

      // Client Partial Match
      let matchesClient = true;
      if (currentClient && currentClient.toLowerCase() !== 'all') {
         matchesClient = (shipment.client || '').toLowerCase().includes(currentClient.toLowerCase());
      }

      // Exception Exact Match
      let matchesException = true;
      if (currentException && currentException.toLowerCase() !== 'all') {
         const s = normalize(shipment.alert);
         const t = normalize(currentException);
         matchesException = s === t || (s !== '' && t !== '' && (s.includes(t) || t.includes(s)));
      }

      return matchesStatus && matchesCarrier && matchesClient && matchesException;
    });
  }, [currentStatus, currentCarrier, currentClient, currentException, onlyExceptions]);

  // 3. Dynamic Pagination based on filtered results
  const totalItems = filteredShipments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  // 4. Finally slice precisely what to render
  const displayShipments = filteredShipments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            {displayShipments?.map((shipment, idx) => (
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
    </div>
  )
}


export default ShipmentTable

