"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import KpiCard from "@/src/components/common/KPICard";
import ShipmentTable from "@/src/components/ui/Dashboard/ShipmentTable";
import NewShipmentButton from "@/src/components/ui/NewShipmentButton";
import { ResponsiveFilterBar } from "@/src/components/common/ResponsiveFilterBar";
import ExportButton from "@/src/components/ui/ExportButton";
import { shipmentService, DashboardStats } from "@/src/services/shipmentService";
import type { ShipmentFilters } from "@/src/components/ui/Dashboard/ShipmentTable";

// Inner dashboard that reads search params
function DashboardContent() {
  const searchParams = useSearchParams();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    shipmentService
      .getStats()
      .then(setStats)
      .catch((err) => console.error("Failed to load dashboard stats:", err))
      .finally(() => setStatsLoading(false));
  }, []);

  const fmt = (val: number | undefined) =>
    statsLoading ? "—" : (val ?? 0).toLocaleString();

  // Read all filter params from URL at page level and pass as props to table
  const filters: ShipmentFilters = {
    status: searchParams.get("status") ?? undefined,
    client: searchParams.get("client") ?? undefined,
    carrier: searchParams.get("carrier") ?? undefined,
    exception: searchParams.get("exceptions") ?? undefined,  // FilterBar writes 'exceptions'
    search: searchParams.get("search") ?? undefined,
  };

  return (
    <div className="w-full bg-[#FFFFFF] p-6 lg:p-10 space-y-8">
      {/* KPI Row */}
      <div className="flex flex-nowrap lg:flex-row gap-4 overflow-x-auto pb-4 lg:pb-0">
        <KpiCard title="Active Shipments" value={fmt(stats?.activeShipments)} change={statsLoading ? "" : "+Live"} status="success" iconSrc="/icons/shipment.svg" />
        <KpiCard title="Delivered" value={fmt(stats?.delivered)} change={statsLoading ? "" : "+Live"} status="success" iconSrc="/icons/tick.svg" />
        <KpiCard title="Exceptions" value={fmt(stats?.exceptions)} change={stats?.exceptions ? "Critical" : "None"} status={stats?.exceptions ? "critical" : "success"} iconSrc="/icons/criticalException.svg" />
        <KpiCard title="Delayed" value={fmt(stats?.delayed)} change={stats?.delayed ? "Alert" : "None"} status={stats?.delayed ? "alert" : "success"} iconSrc="/icons/delayed.svg" />
        <KpiCard title="On Time %" value={statsLoading ? "—" : (stats?.onTimePercent ?? "N/A")} change="Stable" status="success" iconSrc="/icons/ontime.svg" />
      </div>

      <div className="space-y-6">
        {/* Filter and Action Buttons Row */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <ResponsiveFilterBar />
          <div className="flex items-center gap-3">
            <ExportButton />
            <NewShipmentButton />
          </div>
        </div>

        {/* Shipment Table — receives filters as props, no URL param reading inside */}
        <ShipmentTable filters={filters} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="p-10 text-slate-400">Loading dashboard…</div>}>
      <DashboardContent />
    </Suspense>
  );
}