import { Suspense } from "react";
import KpiCard from "@/src/components/common/KPICard";
import { FilterBar } from "@/src/components/common/FilterBar";
import { CarrierVolumeCard } from "@/src/components/analytics/CarrierVolumeCard";
import { MonthlyExceptionHeatmap } from "@/src/components/analytics/CalendarHeatmap";
import { ChartAreaInteractive } from "@/src/components/analytics/AreaChart";
import { ANALYTICS_METRICS } from "@/src/constants/mockData";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Metrics Row */}
      <div className="flex flex-wrap gap-5">
        {ANALYTICS_METRICS.map((metric) => (
          <KpiCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center">
        <Suspense fallback={<div className="h-10 w-48 animate-pulse rounded bg-slate-100" />}>
          <FilterBar />
        </Suspense>
      </div>

      {/* Operations Visibility Chart */}
      <ChartAreaInteractive />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
        <CarrierVolumeCard />
        <MonthlyExceptionHeatmap />
      </div>
    </div>
  );
}
