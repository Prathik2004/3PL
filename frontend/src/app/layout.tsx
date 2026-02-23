import Sidebar from "@/src/components/common/Sidebar";
import TopNavigation from "@/src/components/common/TopNavigation";
import "./globals.css";

export const metadata = {
  title: "Walkwel 3PL Control Lite",
  description: "Operations Visibility and Exception Monitoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-white antialiased">
        {/* Fixed Sidebar - 255px per Figma */}
        <Sidebar />

        {/* Main Workspace */}
        <div className="flex flex-col flex-1">
          {/* Top Navigation - 80px height per Figma */}
          <TopNavigation />
          
          {/* Page Content - Dynamic area for dashboard/analytics */}
          <main className="flex-1 overflow-y-auto bg-[#F8FAF8] p-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}