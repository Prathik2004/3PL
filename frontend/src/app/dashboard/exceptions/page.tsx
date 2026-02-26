"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ExceptionCard from "@/src/components/ui/Dashboard/ExceptionCard";
import { RefreshCwOff, FileText, CalendarX, ClipboardList, ListFilter, ChevronDown, X } from "lucide-react";
import { apiClient } from "@/src/lib/api/client";
import Pagination from "@/src/components/ui/Pagination";
import { MobileFilterSheet } from "@/src/components/common/MobileFilterSheet";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ExceptionSummary {
  NoUpdate: number;
  MissingPOD: number;
  Delay: number;
  NotDispatched: number;
  total: number;
}

interface ExceptionLog {
  _id: string;
  shipment_id: { shipment_id: string; client_name: string; carrier_name: string; status: string } | null;
  exception_type: string;
  description: string;
  resolved: boolean;
  createdAt: string;
}

interface ExceptionsApiResponse {
  total: number;
  data: ExceptionLog[];
}

interface FilterOptions {
  clients: string[];
  carriers: string[];
  exceptionTypes: string[];
}

// ---------------------------------------------------------------------------
// Exception display helpers
// ---------------------------------------------------------------------------
const EXCEPTION_TYPE_LABELS: Record<string, string> = {
  NoUpdate: "No Update",
  MissingPOD: "Missing POD",
  Delay: "Critical Delay",
  NotDispatched: "Not Dispatched",
};

const EXCEPTION_TYPE_VALUES: Record<string, string> = {
  no_update: "NoUpdate",
  missing_pod: "MissingPOD",
  critical_delay: "Delay",
  not_dispatched: "NotDispatched",
};

// Convert DB exception_type to the query-param key the backend expects
const EXCEPTION_DB_TO_PARAM: Record<string, string> = {
  NoUpdate: "no_update",
  MissingPOD: "missing_pod",
  Delay: "critical_delay",
  NotDispatched: "not_dispatched",
};

function ExceptionBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    NoUpdate: "bg-amber-50 text-amber-700 border-amber-200",
    MissingPOD: "bg-orange-50 text-orange-700 border-orange-200",
    Delay: "bg-red-50 text-red-700 border-red-200",
    NotDispatched: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-bold border ${styles[type] || "bg-slate-100 text-slate-600 border-slate-200"
        }`}
    >
      {EXCEPTION_TYPE_LABELS[type] || type}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Generic inline dropdown (no external dependency)
// ---------------------------------------------------------------------------
interface InlineDropdownProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
  disabled?: boolean;
  searchable?: boolean;
}

function InlineDropdown({ label, value, options, onChange, disabled, searchable }: InlineDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const displayLabel = value === "all" ? "All" : options.find((o) => o.value === value)?.label ?? value;
  const filtered = searchable
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-flex items-center gap-1.5" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen((o) => !o);
            setQuery("");
          }
        }}
        className={`flex items-center gap-1.5 outline-none ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="text-[15px] font-medium text-slate-500">{label}:</span>
        <span className="text-[15px] font-bold text-slate-900">{displayLabel}</span>
        <ChevronDown size={14} className="text-slate-500 mt-0.5" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-[240px] rounded-[18px] border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden z-50">
          {searchable && (
            <div className="px-3 pt-3 pb-2">
              <input
                autoFocus
                type="text"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-[10px] bg-[#f4f7f9] px-3 py-2 text-[14px] text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          )}
          <div className="flex flex-col gap-0.5 p-2 max-h-[280px] overflow-y-auto">
            {/* "All" is always the first option */}
            <div
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => { onChange("all"); setOpen(false); }}
            >
              <div className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] ${value === "all" ? "border-slate-800 bg-slate-800" : "border-slate-300"}`}>
                {value === "all" && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <span className={`text-[15px] ${value === "all" ? "font-medium text-slate-900" : "text-slate-600"}`}>All</span>
            </div>
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-[14px] text-slate-400 text-center">No results</div>
            )}
            {filtered.map((opt) => (
              <div
                key={opt.value}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => { onChange(opt.value); setOpen(false); }}
              >
                <div className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] ${value === opt.value ? "border-slate-800 bg-slate-800" : "border-slate-300"}`}>
                  {value === opt.value && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <span className={`text-[15px] ${value === opt.value ? "font-medium text-slate-900" : "text-slate-600"}`}>
                  {opt.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exceptions-specific filter bar
// Fetches its own options from /api/exceptions/filter-options so the dropdowns
// only show clients, carriers, and exception types that are actually present in
// the exceptions collection — they are never polluted by shipments that have no
// exceptions at all.
// ---------------------------------------------------------------------------
interface ExceptionsFilterBarProps {
  currentClient: string;
  currentCarrier: string;
  currentException: string;
  onUpdate: (key: string, value: string) => void;
  onClear: () => void;
}

function ExceptionsFilterBar({
  currentClient,
  currentCarrier,
  currentException,
  onUpdate,
  onClear,
}: ExceptionsFilterBarProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    clients: [],
    carriers: [],
    exceptionTypes: [],
  });
  const [loading, setLoading] = useState(true);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  useEffect(() => {
    apiClient<FilterOptions>("/exceptions/filter-options")
      .then(setFilterOptions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const clientOptions = filterOptions.clients.map((c) => ({ label: c, value: c }));
  const carrierOptions = filterOptions.carriers.map((c) => ({ label: c, value: c }));

  // Map DB exception types (e.g. "NoUpdate") to user-friendly option objects
  const exceptionOptions = filterOptions.exceptionTypes.map((t) => ({
    label: EXCEPTION_TYPE_LABELS[t] ?? t,
    // The backend expects the underscore_case query param key
    value: EXCEPTION_DB_TO_PARAM[t] ?? t.toLowerCase(),
  }));

  const hasActiveFilters =
    currentClient !== "all" || currentCarrier !== "all" || currentException !== "all";

  const renderDropdowns = (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 w-full">
      <InlineDropdown
        label="Client"
        value={currentClient}
        options={clientOptions}
        onChange={(v) => onUpdate("client", v)}
        disabled={loading}
        searchable
      />
      <InlineDropdown
        label="Carrier"
        value={currentCarrier}
        options={carrierOptions}
        onChange={(v) => onUpdate("carrier", v)}
        disabled={loading}
        searchable
      />
      <InlineDropdown
        label="Exceptions"
        value={currentException}
        options={exceptionOptions}
        onChange={(v) => onUpdate("exceptions", v)}
        disabled={loading}
      />
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="hidden sm:block mt-2 sm:mt-0 text-[14px] font-medium text-slate-400 hover:text-slate-600 transition-colors sm:ml-1"
        >
          Clear All
        </button>
      )}
    </div>
  );

  return (
    <div className="relative z-10 w-full">
      {/* Desktop Filter Row (Hidden on mobile) */}
      <div className="hidden sm:flex w-max items-center gap-4 rounded-[14px] bg-slate-50/80 border border-slate-200 px-4 py-2.5 shadow-sm backdrop-blur-sm">
        {/* Fixed "Filter" prefix icon */}
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
          <ListFilter size={16} className="text-slate-700" />
          <span className="text-[15px] font-bold text-slate-900 tracking-wide">
            Filter
          </span>
        </div>
        {/* Render Desktop Filters */}
        {renderDropdowns}
      </div>

      {/* Mobile Trigger Button (Hidden on desktop) */}
      <div className="flex sm:hidden w-full">
        <button
          onClick={() => setIsMobileSheetOpen(true)}
          className="flex w-full items-center justify-between rounded-xl bg-white border border-slate-200 px-5 py-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3 text-slate-700 font-semibold text-[15px]">
            <ListFilter size={18} className="text-slate-700" />
            Filters
          </div>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-bold text-white">
              •
            </span>
          )}
        </button>
      </div>

      {/* Mobile Bottom Sheet (Portaled visually inside parent wrapper) */}
      <MobileFilterSheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
      >
        {/* Drop the exact same visual dropdowns into the slide-up sheet */}
        {renderDropdowns}
        {/* Bottom Sheet Apply Button */}
        <div className="w-full pt-4 mt-2 border-t border-slate-100 flex gap-3">
          <button
            onClick={() => {
              onClear();
              setIsMobileSheetOpen(false);
            }}
            className="flex-1 flex h-14 items-center justify-center rounded-xl bg-slate-100 text-[15px] font-bold text-slate-700 transition-colors hover:bg-slate-200"
          >
            Reset Filters
          </button>
          <button
            onClick={() => setIsMobileSheetOpen(false)}
            className="flex-1 flex h-14 items-center justify-center rounded-xl bg-[#0F172A] text-[15px] font-bold text-white transition-colors hover:bg-slate-800"
          >
            Apply Filters
          </button>
        </div>
      </MobileFilterSheet>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page content
// ---------------------------------------------------------------------------
function ExceptionsContent() {
  const router = useRouter();
  const pathname = usePathname();
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

  // Read filter values from URL params
  const currentClient = searchParams.get("client") || "all";
  const currentCarrier = searchParams.get("carrier") || "all";
  const currentException = searchParams.get("exceptions") || "all";

  // Helpers to update URL params (same strategy as useFilters hook)
  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  // Fetch summary KPIs
  useEffect(() => {
    apiClient<ExceptionSummary>("/exceptions/summary")
      .then(setSummary)
      .catch(console.error)
      .finally(() => setSummaryLoading(false));
  }, []);

  // Fetch exception logs — re-runs whenever any filter or resolved toggle changes
  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    setLogsError(null);
    try {
      const params = new URLSearchParams({ resolved: showResolved ? "true" : "false" });
      if (currentClient !== "all") params.set("client", currentClient);
      if (currentCarrier !== "all") params.set("carrier", currentCarrier);
      if (currentException !== "all") params.set("exceptions", currentException);
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

  const count = (v?: number) => (summaryLoading ? 0 : (v ?? 0));
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

      {/* Dynamic Filter Bar + Resolved Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <ExceptionsFilterBar
          currentClient={currentClient}
          currentCarrier={currentCarrier}
          currentException={currentException}
          onUpdate={updateFilter}
          onClear={clearFilters}
        />
        <button
          onClick={() => setShowResolved((v) => !v)}
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
                  <th
                    key={h}
                    className="px-6 py-5 text-[11px] font-bold text-[#64748B] uppercase tracking-widest whitespace-nowrap"
                  >
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
                    {showResolved ? "No resolved exceptions." : "No active exceptions right now."}
                  </td>
                </tr>
              ) : (
                logs.slice((currentPage - 1) * LIMIT, currentPage * LIMIT).map((ex) => (
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
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-bold border ${ex.resolved
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                          }`}
                      >
                        {ex.resolved ? "Resolved" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[13px] text-slate-400 whitespace-nowrap">
                      {new Date(ex.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-5 gap-4 sm:gap-0 border-t border-[#E2E8F0]">
          <span className="text-[13px] text-[#64748B]">
            Showing{" "}
            <span className="font-bold text-[#0F172A]">
              {startIdx}–{endIdx}
            </span>{" "}
            of <span className="font-bold text-[#0F172A]">{total}</span> exceptions
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
