import LoginCard from "@/src/components/ui/login/LoginCard";
import Image from "next/image";

export default function Page() {
    return (
        <div
        style={{
            fontFamily: "Inter"
        }} 
        className="min-h-screen bg-white flex flex-col items-center justify-center gap-5">
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                    <Image src="/icons/truck.svg" alt="3PL" width={20} height={20} />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[30px]/[36px] text-black font-bold flex-wrap">Welcome back to 3PL Control Lite</span>
                    <span className="text-[16px]/[24px] text-[#64748B] flex-wrap">Logistics Management Platform</span>
                </div>
            </div>
            <LoginCard />
        </div>
    );
}