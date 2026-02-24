import React from "react";
import Image from "next/image";

interface KpiCardProps {
  title?: string;
  value?: string | number;
  change?: string;
  status?: "success" | "alert" | "critical" | "neutral";
  iconSrc?: string;
  variant?: "default" | "exception";
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  status = "neutral",
  iconSrc,
  variant = "default",
}) => {
  // Mapping statuses to Figma-accurate background and text colors
  const statusConfig = {
    success: { text: "text-[#10B981]", bg: "bg-[#ECFDF5]", iconBg: "bg-[#F0FDF4]" },
    alert: { text: "text-[#F59E0B]", bg: "bg-[#FFFBEB]", iconBg: "bg-[#FFFBEB]" }, // Yellow
    critical: { text: "text-[#EF4444]", bg: "bg-[#FEF2F2]", iconBg: "bg-[#FEF2F2]" }, // Red
    neutral: { text: "text-[#64748B]", bg: "bg-[#F8FAFC]", iconBg: "bg-[#F8FAFC]" },
  };

  const colors = statusConfig[status];

  // Specific layout for Exceptions Dashboard
  if (variant === "exception") {
    const dotColors = {
      success: "bg-[#10B981]",
      alert: "bg-[#F59E0B]",
      critical: "bg-[#EF4444]",
      neutral: "bg-[#64748B]",
    };

    return (
      <div className="bg-white rounded-xl p-[18px] border border-slate-200 flex-1 min-w-[210px] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Circular Icon Container */}
          {iconSrc && (
            <div className="w-[46px] h-[46px] rounded-full bg-[#F4F7FB] flex items-center justify-center">
              <Image src={iconSrc} alt="" width={20} height={20} className="w-5 h-5 opacity-60" />
            </div>
          )}
          
          {/* Content */}
          <div className="flex flex-col justify-center">
            {value !== undefined && (
              <span className="text-[24px] leading-tight font-extrabold text-[#0F172A]">
                {value}
              </span>
            )}
            {title && (
              <span className="text-[13px] font-medium text-slate-500 leading-tight mt-0.5">
                {title}
              </span>
            )}
          </div>
        </div>

        {/* Small Status Dot on the right */}
        <div className={`w-[6px] h-[6px] rounded-full ${dotColors[status]}`} />
      </div>
    );
  }

  // Default Dashboard Layout
  return (
    /* flex-1 allows cards to grow and fill the line equally */
    <div className="bg-white rounded-2xl p-5 border border-slate-100 flex-1 min-w-[210px] shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1">
          {title && (
            <span className="text-[10px] font-bold tracking-widest text-[#64748B] uppercase">
              {title}
            </span>
          )}
          {value !== undefined && (
            <span className="text-2xl font-bold text-[#0F172A]">{value}</span>
          )}
        </div>
        
        {/* Icon with status-based background color */}
        {iconSrc && (
          <div className={`p-2.5 rounded-xl ${colors.iconBg}`}>
            <Image src={iconSrc} alt="" width={20} height={20} className={`w-5 h-5 ${status === 'neutral' ? 'opacity-60' : 'opacity-100'}`} />
          </div>
        )}
      </div>

      {change && (
        <div className="flex items-center">
          <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${colors.text} ${colors.bg}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
};

export default KpiCard;