import LoginCard from "@/src/components/ui/login/LoginCard";
import Image from "next/image";

export default function Page() {
  return (
    <div
      style={{
        fontFamily: "Inter"
      }}
      className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 px-4">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
          <Image src="/icons/truck.svg" alt="3PL" width={20} height={20} />
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4">
          <span className="text-[24px]/[30px] sm:text-[30px]/[36px] text-black font-bold">Welcome back to 3PL Control Lite</span>
          <span className="text-[14px]/[20px] sm:text-[16px]/[24px] text-[#64748B]">Logistics Management Platform</span>
        </div>
      </div>
      <LoginCard />
    </div>
  );
}