"use client";

import { Suspense, useEffect, useState } from "react";
import ExceptionCard from "@/src/components/ui/Dashboard/ExceptionCard";
import { FilterBar } from "@/src/components/common/FilterBar";
import { RefreshCwOff, FileText, CalendarX, ClipboardList } from "lucide-react";
import { apiClient } from "@/src/lib/api/client";
import Pagination from "@/src/components/ui/Pagination";

// ── Types ────────────────────────────────────────────────────────────────────
interface ExceptionSummary {
  NoUpdate: number;
  MissingPOD: number;
  Delay: number;
  NotDispatched: number;
  total: number;
}

interface ExceptionLog {
  _id: string;
  shipment_id: {
    shipment_id: string;
    client_name: string;
    carrier_name: string;
    status: string;
  } | null;
  exception_type: string;
  description: string;
  resolved: boolean;
  createdAt: string;
}

interface ExceptionsApiResponse {
  total: number;
  data: ExceptionLog[];
}

// ── Severity badge helper ────────────────────────────────────────────────────
function ExceptionBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    NoUpdate: "bg-amber-50 text-amber-700 border-amber-200",
    MissingPOD: "bg-orange-50 text-orange-700 border-orange-200",
    Delay: "bg-red-50 text-red-700 border-red-200",
    NotDispatched: "bg-slate-100 text-slate-600 border-slate-200",
  }
  const label: Record<string, string> = {
    NoUpdate: "No Update", MissingPOD: "Missing POD",
    Delay: "Delay", NotDispatched: "Not Dispatched",
  }
  const cls = styles[type] || "bg-slate-100 text-slate-600 border-slate-200"
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-bold border ${cls}`}>
      {label[type] || type}
    </span>
  )
}

const LIMIT = 15;

// ── Main page ────────────────────────────────────────────────────────────────
export default function ExceptionsDashboard() {
  const [summary, setSummary] = useState<ExceptionSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [logs, setLogs] = useState<ExceptionLog[]>([]);
  const [total, setTotal] = useState(0);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch KPI summary
  useEffect(() => {
    apiClient<ExceptionSummary>("/exceptions/summary")
      .then(setSummary)
      .catch((e) => console.error("Failed to load exception summary:", e))
      .finally(() => setSummaryLoading(false));
  }, []);

  // Fetch paginated exception logs
  useEffect(() => {
    setLogsLoading(true);
    setLogsError(null);
    const params = new URLSearchParams({
      resolved: showResolved ? "true" : "false",
    });
    apiClient<ExceptionsApiResponse>(`/exceptions?${params.toString()}`)
      .then((res) => { setLogs(res.data); setTotal(res.total); })
      .catch((e) => setLogsError(e.message || "Failed to load exceptions"))
      .finally(() => setLogsLoading(false));
  }, [showResolved, currentPage]);

  const count = (val: number | undefined) => (summaryLoading ? 0 : (val ?? 0));
  const totalPages = Math.ceil(total / LIMIT) || 1;

  return (
    <div className="w-full bg-[#FFFFFF] p-6 lg:p-10 space-y-8 min-h-full">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[#0F172A] mb-2 tracking-tight">
          Active Exceptions {!summaryLoading && `(${summary?.total ?? 0})`}
        </h1>
        <p className="text-[15px] font-medium text-slate-500">
          Review and resolve shipment delays and missing documentation.
        </p>
      </div>

      {/* KPI Summary Cards */}
      <div className="flex flex-nowrap lg:flex-row gap-4 overflow-x-auto pb-4 lg:pb-0">
        <ExceptionCard title="No Update" count={count(summary?.NoUpdate)} severity="warning" icon={RefreshCwOff} />
        <ExceptionCard title="Missing POD" count={count(summary?.MissingPOD)} severity="warning" icon={FileText} />
        <ExceptionCard title="Critical Delay" count={count(summary?.Delay)} severity="critical" icon={CalendarX} />
        <ExceptionCard title="Not Dispatched" count={count(summary?.NotDispatched)} severity="neutral" icon={ClipboardList} />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Suspense fallback={<div className="h-10 w-48 animate-pulse rounded bg-slate-100" />}>
          <FilterBar />
        </Suspense>
        {/* Resolved toggle */}
        <button
          onClick={() => { setShowResolved(!showResolved); setCurrentPage(1); }}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold border transition-colors cursor-pointer ${showResolved
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
        >
          {showResolved ? "Showing Resolved" : "Show Resolved"}
        </button>
      </div>

      {/* Exception Logs Table */}
      <div className="w-full bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead>
              <tr className="bg-[#F8FAFC]/50 border-b border-[#E2E8F0]">
                {["Shipment", "Client", "Carrier", "Exception Type", "Description", "Status", "Raised At"].map((h) => (
                  <th key={h} className="px-6 py-5 text-[11px] font-bold text-[#64748B] uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {logsLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400 text-[14px]">
                    Loading exceptions…
                  </td>
                </tr>
              ) : logsError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-red-400 text-[14px]">
                    {logsError}
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400 text-[14px]">
                    {showResolved ? "No resolved exceptions found." : "🎉 No active exceptions right now."}
                  </td>
                </tr>
              ) : (
                logs.map((ex) => (
                  <tr key={ex._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 font-bold text-[14px] text-[#0F172A] whitespace-nowrap">
                      {ex.shipment_id?.shipment_id ?? "—"}
                    </td>
                    <td className="px-6 py-5 text-[13.5px] text-slate-600">
                      {ex.shipment_id?.client_name ?? "—"}
                    </td>
                    <td className="px-6 py-5 text-[13.5px] text-slate-600">
                      {ex.shipment_id?.carrier_name ?? "—"}
                    </td>
                    <td className="px-6 py-5">
                      <ExceptionBadge type={ex.exception_type} />
                    </td>
                    <td className="px-6 py-5 text-[13px] text-slate-500 max-w-[260px]">
                      {ex.description || "—"}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-bold border ${ex.resolved
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                        {ex.resolved ? "Resolved" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[13px] text-slate-400 whitespace-nowrap">
                      {new Date(ex.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with pagination */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-[#E2E8F0]">
          <span className="text-[13px] text-[#64748B]">
            <span className="font-bold text-[#0F172A]">{total}</span> exception{total !== 1 ? "s" : ""} total
          </span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}
