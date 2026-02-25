"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ExceptionCard from "@/src/components/ui/Dashboard/ExceptionCard";
import { FilterBar } from "@/src/components/common/FilterBar";
import { RefreshCwOff, FileText, CalendarX, ClipboardList } from "lucide-react";
import { apiClient } from "@/src/lib/api/client";
import Pagination from "@/src/components/ui/Pagination";

interface ExceptionSummary {
  NoUpdate: number; MissingPOD: number; Delay: number; NotDispatched: number; total: number;
}
interface ExceptionLog {
  _id: string;
  shipment_id: { shipment_id: string; client_name: string; carrier_name: string; status: string } | null;
  exception_type: string; description: string; resolved: boolean; createdAt: string;
}
interface ExceptionsApiResponse { total: number; data: ExceptionLog[]; }

function ExceptionBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    NoUpdate: "bg-amber-50 text-amber-700 border-amber-200",
    MissingPOD: "bg-orange-50 text-orange-700 border-orange-200",
    Delay: "bg-red-50 text-red-700 border-red-200",
    NotDispatched: "bg-slate-100 text-slate-600 border-slate-200",
  }
  const label: Record<string, string> = {
    NoUpdate: "No Update", MissingPOD: "Missing POD", Delay: "Delay", NotDispatched: "Not Dispatched",
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-bold border ${styles[type] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {label[type] || type}
    </span>
  )
}

function ExceptionsContent() {
  const searchParams = useSearchParams();
  const [summary, setSummary] = useState<ExceptionSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [logs, setLogs] = useState<ExceptionLog[]>([]);
  const [total, setTotal] = useState(0);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 15;

  // Read FilterBar URL params
  const currentClient = searchParams.get('client') || 'all';
  const currentCarrier = searchParams.get('carrier') || 'all';
  const currentException = searchParams.get('exceptions') || 'all';

  // Fetch summary
  useEffect(() => {
    apiClient<ExceptionSummary>("/exceptions/summary")
      .then(setSummary)
      .catch(console.error)
      .finally(() => setSummaryLoading(false));
  }, []);

  // Fetch exception logs — re-runs when any filter or resolved toggle changes
  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    setLogsError(null);
    try {
      const params = new URLSearchParams({ resolved: showResolved ? "true" : "false" });
      if (currentClient !== 'all') params.set("client", currentClient);
      if (currentCarrier !== 'all') params.set("carrier", currentCarrier);
      if (currentException !== 'all') params.set("exceptions", currentException);
      const res = await apiClient<ExceptionsApiResponse>(`/exceptions?${params.toString()}`);
      setLogs(res.data);
      setTotal(res.total);
    } catch (e: any) {
      setLogsError(e.message || "Failed to load exceptions");
    } finally {
      setLogsLoading(false);
    }
  }, [showResolved, currentClient, currentCarrier, currentException]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => { setCurrentPage(1); }, [currentClient, currentCarrier, currentException, showResolved]);

  const count = (v?: number) => summaryLoading ? 0 : (v ?? 0);
  const totalPages = Math.ceil(total / LIMIT) || 1;
  const startIdx = total === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const endIdx = Math.min(currentPage * LIMIT, total);

  return (
    <div className="w-full bg-[#FFFFFF] p-6 lg:p-10 space-y-8 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[#0F172A] mb-2 tracking-tight">
          Active Exceptions {!summaryLoading && `(${summary?.total ?? 0})`}
        </h1>
        <p className="text-[15px] font-medium text-slate-500">
          Review and resolve shipment delays and missing documentation.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="flex flex-nowrap lg:flex-row gap-4 overflow-x-auto pb-4 lg:pb-0">
        <ExceptionCard title="No Update" count={count(summary?.NoUpdate)} severity="warning" icon={RefreshCwOff} />
        <ExceptionCard title="Missing POD" count={count(summary?.MissingPOD)} severity="warning" icon={FileText} />
        <ExceptionCard title="Critical Delay" count={count(summary?.Delay)} severity="critical" icon={CalendarX} />
        <ExceptionCard title="Not Dispatched" count={count(summary?.NotDispatched)} severity="neutral" icon={ClipboardList} />
      </div>

      {/* Filter Bar + Resolved Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <FilterBar />
        <button
          onClick={() => setShowResolved(v => !v)}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold border transition-colors cursor-pointer ${showResolved ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
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
                {["Shipment", "Client", "Carrier", "Exception Type", "Description", "Status", "Raised At"].map(h => (
                  <th key={h} className="px-6 py-5 text-[11px] font-bold text-[#64748B] uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {logsLoading ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400 text-[14px]">Loading exceptions…</td></tr>
              ) : logsError ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-red-400 text-[14px]">{logsError}</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-slate-400 text-[14px]">
                  {showResolved ? "No resolved exceptions." : "🎉 No active exceptions right now."}
                </td></tr>
              ) : (
                logs.slice((currentPage - 1) * LIMIT, currentPage * LIMIT).map(ex => (
                  <tr key={ex._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 font-bold text-[14px] text-[#0F172A] whitespace-nowrap">{ex.shipment_id?.shipment_id ?? "—"}</td>
                    <td className="px-6 py-5 text-[13.5px] text-slate-600">{ex.shipment_id?.client_name ?? "—"}</td>
                    <td className="px-6 py-5 text-[13.5px] text-slate-600">{ex.shipment_id?.carrier_name ?? "—"}</td>
                    <td className="px-6 py-5"><ExceptionBadge type={ex.exception_type} /></td>
                    <td className="px-6 py-5 text-[13px] text-slate-500 max-w-[260px]">{ex.description || "—"}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-bold border ${ex.resolved ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {ex.resolved ? "Resolved" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[13px] text-slate-400 whitespace-nowrap">
                      {new Date(ex.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-8 py-5 border-t border-[#E2E8F0]">
          <span className="text-[13px] text-[#64748B]">
            Showing <span className="font-bold text-[#0F172A]">{startIdx}–{endIdx}</span> of <span className="font-bold text-[#0F172A]">{total}</span> exceptions
          </span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}

export default function ExceptionsDashboard() {
  return (
    <Suspense fallback={<div className="p-10 text-slate-400">Loading…</div>}>
      <ExceptionsContent />
    </Suspense>
  );
}
