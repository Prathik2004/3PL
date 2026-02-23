import ShipmentTable from "@/src/components/ui/Dashboard/ShipmentTable";

export default function Dashboard() {
  return (
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
}