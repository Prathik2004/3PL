import KpiCard from "@/src/components/common/KPICard";
import ShipmentTable from "@/src/components/ui/Dashboard/ShipmentTable";
import NewShipmentButton from "@/src/components/ui/NewShipmentButton";
import { FilterBar } from "@/src/components/common/FilterBar";
import ExportButton from "@/src/components/ui/ExportButton";

export default function Dashboard() {
  return (
    <div className="w-full bg-[#FFFFFF] p-6 lg:p-10 space-y-8">
      {/* KPI Row: Forced into one line on desktop */}
      <div className="flex flex-nowrap lg:flex-row gap-4 overflow-x-auto pb-4 lg:pb-0">
        <KpiCard
          title="Active Shipments"
          value="1,240"
          change="+2.4%"
          status="success"
          iconSrc="/icons/shipment.svg"
        />
        <KpiCard
          title="Delivered"
          value="856"
          change="+5.1%"
          status="success"
          iconSrc="/icons/tick.svg"
        />
        <KpiCard
          title="Exceptions"
          value="4"
          change="Critical"
          status="critical"
          iconSrc="/icons/criticalException.svg"
        />
        <KpiCard
          title="Delayed"
          value="12"
          change="Alert"
          status="alert"
          iconSrc="/icons/delayed.svg"
        />
        <KpiCard
          title="On Time %"
          value="98.2%"
          change="Stable"
          status="success"
          iconSrc="/icons/ontime.svg"
        />
      </div>


      <div className="space-y-6">
        {/* Filter and Action Buttons Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <FilterBar />
          <div className="flex items-center gap-3">
            <ExportButton />
            <NewShipmentButton />
          </div>
        </div>

        {/* Shipment Table */}
        <ShipmentTable />
      </div>
    </div>
  );
}