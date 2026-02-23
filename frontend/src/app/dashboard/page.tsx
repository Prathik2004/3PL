import KpiCard from "@/src/components/common/KPICard";

const Index = () => {
import ShipmentTable from "@/src/components/ui/Dashboard/ShipmentTable";

export default function Dashboard() {
  return (
    <div className="w-full bg-[#FFFFFF] p-6 lg:p-10">
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
    <div className="space-y-8">
      {/* Heading Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
      </div>

      {/* Stats Grid Placeholder */}
      <ShipmentTable />
      {/* Main Content Area Placeholder */}

    </div>
  );
};

export default Index;