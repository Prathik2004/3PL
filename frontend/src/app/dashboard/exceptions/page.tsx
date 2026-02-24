import { Suspense } from "react";
import ExceptionCard from "@/src/components/ui/Dashboard/ExceptionCard";
import ShipmentTable from "@/src/components/ui/Dashboard/ShipmentTable";
import { FilterBar } from "@/src/components/common/FilterBar";
import { RefreshCwOff, FileText, CalendarX, ClipboardList } from "lucide-react";

export const metadata = {
  title: "Exceptions Dashboard | Walkwel 3PL",
  description: "View and resolve active shipment exceptions",
};

export default function ExceptionsDashboard() {
  return (
    <div className="w-full bg-[#FFFFFF] p-6 lg:p-10 space-y-8 min-h-full">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[#0F172A] mb-2 tracking-tight">
          Active Exceptions (24)
        </h1>
        <p className="text-[15px] font-medium text-slate-500">
          Review and resolve shipment delays and missing documentation.
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="flex flex-nowrap lg:flex-row gap-4 overflow-x-auto pb-4 lg:pb-0">
        <ExceptionCard
          title="No Update"
          count={8}
          severity="warning"
          icon={RefreshCwOff}
        />
        <ExceptionCard
          title="Missing POD"
          count={12}
          severity="warning"
          icon={FileText}
        />
        <ExceptionCard
          title="Critical Delay"
          count={3}
          severity="critical"
          icon={CalendarX}
        />
        <ExceptionCard
          title="Not Dispatched"
          count={1}
          severity="neutral"
          icon={ClipboardList}
        />
      </div>

      <div className="space-y-6">
        {/* Filter Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Suspense fallback={<div className="h-10 w-48 animate-pulse rounded bg-slate-100" />}>
            <FilterBar />
          </Suspense>
        </div>

        {/* Shipment Table */}
        <Suspense fallback={<div className="h-64 w-full animate-pulse rounded-2xl bg-slate-100" />}>
          <ShipmentTable onlyExceptions={true} />
        </Suspense>
      </div>
    </div>
  );
}

