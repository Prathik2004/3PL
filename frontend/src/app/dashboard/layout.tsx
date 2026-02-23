import Sidebar from "@/src/components/common/Sidebar";
import TopNavigation from "@/src/components/common/TopNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopNavigation />
        <main className="flex-1 overflow-y-auto bg-[#F8FAF8] p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
