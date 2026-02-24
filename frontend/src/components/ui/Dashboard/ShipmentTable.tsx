"use client";
import { Key, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShipmentRowProps } from "@/src/types/types";
import ShipmentRow from "./ShipmentRow";
import Pagination from "../Pagination";
import { shipmentService } from "../../../services/shipmentService";
import { formatTimeAgo } from "../../../utils/dateUtils";

interface ShipmentTableProps {
  onlyExceptions?: boolean;
}

const ShipmentTable = ({ onlyExceptions = false }: ShipmentTableProps) => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [displayShipments, setDisplayShipments] = useState<ShipmentRowProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // 1. Safely extract our Filter parameters from the URL
  const currentStatus = searchParams.get('status') || 'all';
  const currentClient = searchParams.get('client') || 'all';
  const currentCarrier = searchParams.get('carrier') || 'all';
  const currentException = searchParams.get('exception') || 'all';

  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      try {
        // 1. Prepare Backend Filters
        const filters: Record<string, string> = {};
        if (currentStatus !== 'all') filters.status = currentStatus;
        if (currentClient !== 'all') filters.client = currentClient;
        if (currentCarrier !== 'all') filters.carrier = currentCarrier;

        // 2. Call the Service (This hits your backend manual-join logic)
        const res = await shipmentService.getAllShipments(currentPage, itemsPerPage, filters);

        // 3. Map Backend Data to Frontend Row Props (Keeping your Alert Logic)
        const mapped: ShipmentRowProps[] = (res.data || []).map((s: any) => {
          let alert = "-";
          let alertColor: "Red" | "Yellow" | "None" = "None";

          // Alert logic using the manually joined Exception data
          if (s.active_exception) {
            alert = s.active_exception.exception_type.toUpperCase();
            alertColor = "Red";
          } else if (s.status === "Delayed") {
            alert = "DELAYED";
            alertColor = "Red";
          } else if (!s.pod_received && s.status === "Delivered") {
            alert = "MISSING POD";
            alertColor = "Yellow";
          }

          return {
            shipmentId: s.shipment_id, // Mapping DB field to UI prop
            client: s.client_name,
            lastUpdated: s.updated_at ? formatTimeAgo(s.updated_at) : "-",
            carrier: s.carrier_name,
            dest: s.destination,
            expDel: s.expected_delivery_date
              ? new Date(s.expected_delivery_date).toLocaleDateString()
              : "N/A",
            alert,
            alertColor,
            status: s.status,
            origin: s.origin,
          };g
        });

        // if exception filter applied client side
        let finalData = mapped;
        if (currentException !== 'all') {
          finalData = finalData.filter(s => (s.alert || '').toLowerCase().includes(currentException.toLowerCase()));
        }

        if (onlyExceptions) {
          finalData = finalData.filter(s => s.alert !== "-");
        }

        setDisplayShipments(finalData);
        setTotalItems(res.total || finalData.length);

      } catch (err) {
        console.error("Failed to fetch shipments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, [currentPage, itemsPerPage, currentStatus, currentCarrier, currentClient, currentException, onlyExceptions]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="w-full bg-[#F5F9FF] rounded-2xl border border-[#E2E8F0] relative overflow-hidden flex flex-col">
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
          <div className="w-full flex flex-col min-h-[400px]">
            {isLoading ? (
              <div className="flex justify-center items-center py-20 text-slate-400">Loading shipments...</div>
            ) : displayShipments.length === 0 ? (
              <div className="flex justify-center items-center py-20 text-slate-400">No shipments found.</div>
            ) : (
              displayShipments.map((shipment) => (
                <ShipmentRow key={shipment.shipmentId} {...shipment} />
              ))
            )}
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
  );
};

export default ShipmentTable;

