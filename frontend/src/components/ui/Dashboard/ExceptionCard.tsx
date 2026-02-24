import React from "react";
import { LucideIcon } from "lucide-react";

interface ExceptionCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  severity: "warning" | "critical" | "neutral";
}

const dotColors: Record<ExceptionCardProps["severity"], string> = {
  warning:  "bg-[#F59E0B]",
  critical: "bg-[#EF4444]",
  neutral:  "bg-[#94A3B8]",
};

const ExceptionCard: React.FC<ExceptionCardProps> = ({
  title,
  count,
  icon: Icon,
  severity,
}) => {
  return (
    <div className="bg-white rounded-[16px] px-6 py-6 border border-slate-200 flex-1 min-w-[200px] shadow-[0px_1px_6px_rgba(0,0,0,0.03)] flex items-center justify-between gap-4">
      <div className="flex items-center gap-[18px]">
        {/* Circular icon container */}
        <div className="w-[52px] h-[52px] rounded-full bg-[#EEF2F7] flex items-center justify-center shrink-0">
          <Icon size={22} strokeWidth={1.8} className="text-[#475569]" />
        </div>

        {/* Count on top, label below */}
        <div className="flex flex-col justify-center gap-[3px]">
          <span className="text-[28px] leading-none font-bold text-[#0F172A] tracking-tight">
            {count}
          </span>
          <span className="text-[14px] font-medium text-[#64748B] leading-none">
            {title}
          </span>
        </div>
      </div>

      {/* Status dot */}
      <div className={`w-[8px] h-[8px] rounded-full shrink-0 ${dotColors[severity]}`} />
    </div>
  );
};

export default ExceptionCard;
