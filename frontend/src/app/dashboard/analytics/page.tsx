"use client";

import { Suspense, useEffect, useState } from "react";
import KpiCard from "@/src/components/common/KPICard";
import { FilterBar } from "@/src/components/common/FilterBar";
import { CarrierVolumeCard } from "@/src/components/analytics/CarrierVolumeCard";
import { MonthlyExceptionHeatmap } from "@/src/components/analytics/CalendarHeatmap";
import { ChartAreaInteractive } from "@/src/components/analytics/AreaChart";
import { shipmentService, DashboardStats } from "@/src/services/shipmentService";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shipmentService
      .getStats()
      .then(setStats)
      .catch((err) => console.error("Failed to load analytics stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (val: number | undefined) =>
    loading ? "—" : (val ?? 0).toLocaleString();

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Live Metrics Row from real backend stats */}
      <div className="flex flex-wrap gap-5">
        <KpiCard
          title="Active Shipments"
          value={fmt(stats?.activeShipments)}
          change={loading ? "" : "+Live"}
          status="success"
          iconSrc="/icons/shipment.svg"
        />
        <KpiCard
          title="Delivered"
          value={fmt(stats?.delivered)}
          change={loading ? "" : "+Live"}
          status="success"
          iconSrc="/icons/tick.svg"
        />
        <KpiCard
          title="Exceptions"
          value={fmt(stats?.exceptions)}
          change={stats?.exceptions ? "Critical" : "None"}
          status={stats?.exceptions ? "critical" : "success"}
          iconSrc="/icons/criticalException.svg"
        />
        <KpiCard
          title="Delayed"
          value={fmt(stats?.delayed)}
          change={stats?.delayed ? "Alert" : "None"}
          status={stats?.delayed ? "alert" : "success"}
          iconSrc="/icons/delayed.svg"
        />
        <KpiCard
          title="On Time %"
          value={loading ? "—" : (stats?.onTimePercent ?? "N/A")}
          change="Stable"
          status="success"
          iconSrc="/icons/ontime.svg"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center">
        <Suspense fallback={<div className="h-10 w-48 animate-pulse rounded bg-slate-100" />}>
          <FilterBar />
        </Suspense>
      </div>

      {/* Operations Visibility Chart — real trends from backend */}
      <ChartAreaInteractive />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
        <CarrierVolumeCard />
        <MonthlyExceptionHeatmap />
      </div>
    </div>
  );
}
