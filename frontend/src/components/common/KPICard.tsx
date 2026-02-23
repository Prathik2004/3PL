import React from "react";

interface KpiCardProps {
  title?: string;
  value?: string | number;
  change?: string;
  status?: "success" | "alert" | "critical" | "neutral";
  iconSrc?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  status = "neutral",
  iconSrc,
}) => {
  // Mapping statuses to Figma-accurate background and text colors
  const statusConfig = {
    success: { text: "text-[#10B981]", bg: "bg-[#ECFDF5]", iconBg: "bg-[#F0FDF4]" },
    alert: { text: "text-[#F59E0B]", bg: "bg-[#FFFBEB]", iconBg: "bg-[#FFFBEB]" }, // Yellow
    critical: { text: "text-[#EF4444]", bg: "bg-[#FEF2F2]", iconBg: "bg-[#FEF2F2]" }, // Red
    neutral: { text: "text-[#64748B]", bg: "bg-[#F8FAFC]", iconBg: "bg-[#F8FAFC]" },
  };

  const colors = statusConfig[status];

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
            <img src={iconSrc} alt="" className={`w-5 h-5 ${status === 'neutral' ? 'opacity-60' : 'opacity-100'}`} />
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