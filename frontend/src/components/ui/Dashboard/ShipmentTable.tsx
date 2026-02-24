"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ShipmentRowProps } from "@/src/types/types";
import ShipmentRow from "./ShipmentRow"
import Pagination from "../Pagination";
import { shipmentService } from "../../../services/shipmentService";

const ShipmentTable = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [displayShipments, setDisplayShipments] = useState<ShipmentRowProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Safely extract our Filter parameters from the URL
  const currentStatus = searchParams.get('status') || 'all';
  const currentCarrier = searchParams.get('carrier') || 'all';
  const currentClient = searchParams.get('client') || 'all';
  const currentException = searchParams.get('exceptions') || 'all';

  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      try {
        const filters: Record<string, string> = {};
        if (currentStatus !== 'all') filters.status = currentStatus;
        if (currentClient !== 'all') filters.client = currentClient;

        const res = await shipmentService.getAllShipments(currentPage, itemsPerPage, filters);

        let fetchedData = res.data || [];

        // Optional client-side filtering if API doesn't support carrier/alerts natively
        if (currentCarrier !== 'all') {
          fetchedData = fetchedData.filter(s => (s.carrier_name || '').toLowerCase().includes(currentCarrier.toLowerCase()));
        }

        const mapped: ShipmentRowProps[] = fetchedData.map(s => {
          let alert = "-";
          let alertColor: "Red" | "Yellow" | "None" = "None";

          if (s.status.toLowerCase() === "delayed") {
            alert = "DELAYED"; alertColor = "Red";
          } else if (!s.pod_received && s.status.toLowerCase() === "delivered") {
            alert = "MISSING POD"; alertColor = "Yellow";
          }

          if (currentException !== 'all') {
            // Let client side handle exception filter
          }

          const dateStr = s.expected_delivery_date ? new Date(s.expected_delivery_date).toLocaleDateString() : "";

          return {
            shipmentId: s.shipment_id,
            client: s.client_name,
            lastUpdated: s.created_at ? new Date(s.created_at).toLocaleDateString() : "-",
            carrier: s.carrier_name,
            dest: s.destination,
            expDel: dateStr,
            alert,
            alertColor,
            status: s.status.toUpperCase(),
          }
        });

        // if exception filter applied client side
        let finalData = mapped;
        if (currentException !== 'all') {
          finalData = finalData.filter(s => (s.alert || '').toLowerCase().includes(currentException.toLowerCase()));
        }

        setDisplayShipments(finalData);
        setTotalItems(res.total || finalData.length);

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, [currentPage, itemsPerPage, currentStatus, currentCarrier, currentClient, currentException]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
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
