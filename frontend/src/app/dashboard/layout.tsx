import Sidebar from "@/src/components/common/Sidebar";
import TopNavigation from "@/src/components/common/TopNavigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopNavigation />
        <main className="flex-1 bg-[#F8FAF8] p-4 md:p-6 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
