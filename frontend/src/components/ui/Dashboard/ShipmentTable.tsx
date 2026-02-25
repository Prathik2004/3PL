"use client";
import { useEffect, useState } from "react";
import { ShipmentRowProps } from "@/src/types/types";
import ShipmentRow from "./ShipmentRow";
import Pagination from "../Pagination";
import { shipmentService } from "../../../services/shipmentService";
import { formatTimeAgo } from "../../../utils/dateUtils";

export interface ShipmentFilters {
  status?: string;
  client?: string;
  carrier?: string;
  exception?: string;
  search?: string;
}

interface ShipmentTableProps {
  onlyExceptions?: boolean;
  filters?: ShipmentFilters;
}

const ShipmentTable = ({ onlyExceptions = false, filters = {} }: ShipmentTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [displayShipments, setDisplayShipments] = useState<ShipmentRowProps[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Stringify filters to use as a stable dependency
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      try {
        // Build query params — only send non-empty, non-'all' values
        const query: Record<string, string> = {};
        if (filters.status && filters.status !== 'all') query.status = filters.status;
        if (filters.client && filters.client !== 'all') query.client = filters.client;
        if (filters.carrier && filters.carrier !== 'all') query.carrier = filters.carrier;
        if (filters.exception && filters.exception !== 'all') query.exception = filters.exception;
        if (filters.search) query.search = filters.search;

        const res = await shipmentService.getAllShipments(currentPage, itemsPerPage, query);

        const mapped: ShipmentRowProps[] = (res.data || []).map((s: any) => {
          let alert = "-";
          let alertColor: "Red" | "Yellow" | "None" = "None";

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
            shipmentId: s.shipment_id,
            internalId: s.id,
            _mongoId: s._id?.toString(),
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
          };
        });

        let finalData = onlyExceptions ? mapped.filter(s => s.alert !== "-") : mapped;
        setDisplayShipments(finalData);
        setTotalItems(res.total || finalData.length);
      } catch (err) {
        console.error("Failed to fetch shipments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filtersKey, onlyExceptions]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="w-full bg-[#F5F9FF] rounded-2xl border border-[#E2E8F0] relative overflow-hidden flex flex-col">
      <div className="overflow-x-auto w-full">
        <div className="min-w-[1100px] w-full">
          {/* TABLE HEADER */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_1fr_1fr] items-center px-6 text-[#64748B] text-[12px] font-bold h-[64px] w-full border-b border-[#E2E8F0] bg-slate-50/50">
            <span className="text-left py-2">SHIPMENT ID &amp; CLIENT</span>
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
