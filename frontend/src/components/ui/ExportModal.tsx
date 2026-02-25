"use client";
import React, { useEffect, useState } from "react";
import BasicButton from "./BasicButton";
import { motion } from "motion/react";
import { getToken } from "@/src/lib/api/client";
import { resolveBaseUrl } from "@/src/lib/api/urlResolver";

export interface ExportModalProps {
  onClose?: () => void;
}

export const ExportModal = ({ onClose }: ExportModalProps) => {
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const token = getToken();
      const base = resolveBaseUrl();
      const backendFormat = format === "xlsx" ? "xlsx" : "csv";
      const url = `${base}/shipments/export?format=${backendFormat}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Export failed" }));
        throw new Error(errData.error || `Export failed (${res.status})`);
      }

      // Trigger browser download
      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `shipments_${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      setSuccess(true);
      setTimeout(() => onClose?.(), 1200);
    } catch (err: any) {
      setError(err.message || "Failed to export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, filter: "blur(10px)", scale: 0 }}
        animate={{ scale: [1.5, 1], filter: "blur(0px)", opacity: 1 }}
        exit={{ opacity: 0, filter: "blur(10px)", scale: 0 }}
        transition={{ type: "spring", ease: "easeIn", duration: 0.5 }}
        className="w-[430px] rounded-[24px] bg-white p-8 px-10 shadow-[0_12px_45px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center text-center font-sans"
      >
        {/* Icon */}
        <div className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F8FAFC]">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0F172A]">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>

        <h2 className="mb-2.5 text-[22px] font-bold text-[#0F172A]">Export Shipment Data?</h2>
        <p className="mb-8 text-[15px] leading-relaxed text-[#64748B] px-1">
          Choose your preferred format to download all shipments.
        </p>

        {/* Format Toggles */}
        <div className="mb-8 flex w-full gap-3">
          {(["csv", "xlsx"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`h-12 flex-1 rounded-[10px] text-[14px] transition-all border cursor-pointer ${format === fmt
                  ? "border-[#0F172A] font-bold text-[#0F172A] bg-slate-50"
                  : "border-slate-200 font-medium text-[#64748B] hover:border-slate-300"
                }`}
            >
              {fmt === "csv" ? "CSV File" : "Excel (XLSX)"}
            </button>
          ))}
        </div>

        {/* Error / Success */}
        {error && <p className="mb-4 text-[13px] text-red-500 text-center">{error}</p>}
        {success && <p className="mb-4 text-[13px] text-green-600 text-center">✓ Download started!</p>}

        {/* Action Buttons */}
        <div className="flex w-full gap-3">
          <BasicButton
            text="Cancel"
            onClick={onClose}
            className="h-12 flex-1 rounded-[10px] border border-slate-200 bg-white font-medium text-[#64748B] hover:bg-slate-50 transition-colors"
          />
          <BasicButton
            text={isExporting ? "Exporting…" : "Download"}
            onClick={handleExport}
            disabled={isExporting || success}
            className="h-12 flex-1 rounded-[10px] bg-[#0F172A] font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ExportModal;
