"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import ExportButton from "@/src/components/ui/ExportButton";
import Pagination from "@/src/components/ui/Pagination";
import Image from "next/image";
import { apiClient } from "@/src/lib/api/client";

// ---------- Types ----------
interface LogEntry {
  _id: string;
  timestamp: string;
  user_name: string;
  user_role: string;
  action: string;
  status: "Success" | "Failed";
  event_type: "user" | "system" | "security";
  ip_address?: string;
}

interface LogsApiResponse {
  total: number;
  page: number;
  limit: number;
  data: LogEntry[];
}

// ---------- Filter Dropdown (local, matches existing design) ----------
interface FilterOption { label: string; value: string; }
interface FilterDropdownProps {
  icon: React.ReactNode;
  label?: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

const FilterDropdown = ({ icon, label, value, options, onChange }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const activeLabel = options.find((o) => o.value === value)?.label || "All";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ fontFamily: "Inter" }}
        className="h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer outline-none"
      >
        <span className="text-[#94A3B8]">{icon}</span>
        {label && <span className="text-[14px] font-medium text-[#64748B]">{label}:</span>}
        <span className="text-[14px] font-bold text-[#0F172A]">{activeLabel}</span>
        <ChevronDown className={`h-4 w-4 text-[#64748B] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-[200px] bg-white border border-[#E2E8F0] rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] z-50 py-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              style={{ fontFamily: "Inter" }}
              className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-slate-50 transition-colors cursor-pointer ${value === opt.value ? "font-bold text-[#0F172A] bg-slate-50" : "text-[#64748B]"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------- Page ----------
const LIMIT = 20;

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("7");
  const [eventType, setEventType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search input
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Silently seed demo data if fewer than 10 logs exist (idempotent)
      await apiClient<{ message: string }>("/logs/seed", { method: "POST" }).catch(() => { });

      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(LIMIT),
        days: dateFilter,
      });
      if (eventType !== "all") params.set("event_type", eventType);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await apiClient<LogsApiResponse>(`/logs?${params.toString()}`);
      setLogs(res.data);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, dateFilter, eventType, statusFilter, debouncedSearch]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [dateFilter, eventType, statusFilter]);

  const totalPages = Math.ceil(total / LIMIT) || 1;
  const startIdx = total === 0 ? 0 : (currentPage - 1) * LIMIT + 1;
  const endIdx = Math.min(currentPage * LIMIT, total);

  const dateOptions = [
    { label: "Last 24 Hours", value: "1" },
    { label: "Last 7 Days", value: "7" },
    { label: "Last 30 Days", value: "30" },
  ];
  const eventTypeOptions = [
    { label: "All", value: "all" },
    { label: "User Activity", value: "user" },
    { label: "System Events", value: "system" },
    { label: "Security", value: "security" },
  ];
  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Success", value: "Success" },
    { label: "Failed", value: "Failed" },
  ];

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "Inter" }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight">System Logs</h1>
          <p className="text-[#64748B] text-[16px] font-medium opacity-90">
            Monitor all system activity and administrative changes.
          </p>
        </div>
        <ExportButton />
      </div>

      {/* Filter Bar */}
      <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <img src="/icons/search.svg" alt="Search" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search logs by user, event, or keyword"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-11 pr-4 text-[14.5px] text-[#0F172A] outline-none focus:ring-2 focus:ring-slate-100 focus:bg-white transition-all placeholder:text-[#94A3B8] font-medium"
          />
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown
            icon={<img src="/icons/calendar.svg" alt="Calendar" className="h-4 w-4" />}
            value={dateFilter}
            options={dateOptions}
            onChange={setDateFilter}
          />
          <FilterDropdown
            icon={<img src="/icons/filter.svg" alt="Filter" className="h-4 w-4" />}
            label="Event Type"
            value={eventType}
            options={eventTypeOptions}
            onChange={setEventType}
          />
          <FilterDropdown
            icon={<img src="/icons/filter.svg" alt="Status" className="h-4 w-4" />}
            label="Status"
            value={statusFilter}
            options={statusOptions}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="w-full bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8FAFC]/50 border-b border-[#E2E8F0]">
                {["Timestamp", "User / System", "Event Action", "Status"].map((h) => (
                  <th key={h} className={`px-6 py-5 text-[12px] font-bold text-[#64748B] uppercase tracking-widest ${h === "Status" ? "text-center" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400 text-[14px]">
                    Loading logs…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-red-400 text-[14px]">
                    {error}
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400 text-[14px]">
                    No logs found for this period.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-6 text-[14px] text-[#64748B] font-medium whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center border border-slate-100/50">
                          {log.event_type === "system" ? (
                            <Image src="/icons/cpu.svg" alt="CPU" width={18} height={18} />
                          ) : (
                            <Image src="/icons/avatar-icon.svg" alt="Avatar" width={18} height={18} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14.5px] font-bold text-[#0F172A]">{log.user_name}</span>
                          <span className="text-[12px] text-[#94A3B8]">{log.user_role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-[14.5px] text-[#475569] font-medium leading-relaxed">
                      {log.action}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[12.5px] font-bold ${log.status === "Success"
                        ? "bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]"
                        : "bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]"
                        }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-10 py-6 border-t border-[#E2E8F0] bg-white">
          <span className="text-[14px] text-[#64748B] font-medium">
            Showing <span className="text-[#0F172A] font-bold">{startIdx} to {endIdx}</span> of{" "}
            <span className="text-[#0F172A] font-bold">{total}</span> logs
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
