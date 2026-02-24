import React from "react";

interface KpiCardProps {
  title?: string;
  value?: string | number;
  change?: string;
  trend?: "up" | "down" | "stable";
  status?: "success" | "alert" | "critical" | "neutral";
  iconSrc?: string;
  /** Inline React icon component (e.g. from lucide-react) */
  icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  trend,
  status = "neutral",
  iconSrc,
  icon,
}) => {
  // Mapping statuses to Figma-accurate background and text colors
  const statusConfig = {
    success: { text: "text-[#10B981]", bg: "bg-[#ECFDF5]" },
    alert: { text: "text-[#F59E0B]", bg: "bg-[#FFFBEB]" },
    critical: { text: "text-[#EF4444]", bg: "bg-[#FEF2F2]" },
    neutral: { text: "text-[#64748B]", bg: "bg-[#F8FAFC]" },
  };

  const colors = statusConfig[status];

  const getTrendIcon = () => {
    if (trend === "up") return "↗";
    if (trend === "down") return "↘";
    return "";
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 flex-1 min-w-[240px] shadow-sm transition-all hover:shadow-md hover:border-slate-200 group">
      <div className="flex flex-col gap-4 relative">
        {iconSrc && (
          <div className="absolute top-0 right-0 p-2.5 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors">
            <img src={iconSrc} alt="" className="w-5 h-5 opacity-70" />
          </div>
        )}

        {title && (
          <span className="text-[11px] font-bold tracking-[0.12em] text-[#64748B] uppercase">
            {title}
          </span>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            {value !== undefined && (
              <span className="text-3xl font-bold text-[#0F172A] tracking-tight">{value}</span>
            )}
          </div>

          {change && (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold w-fit ${colors.text} ${colors.bg}`}>
              <span className="text-[14px] leading-none">{getTrendIcon()}</span>
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KpiCard;