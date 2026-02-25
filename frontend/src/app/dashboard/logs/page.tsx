"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Calendar,
  Filter,
  Cpu,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from "lucide-react";
import ExportButton from "@/src/components/ui/ExportButton";
import Pagination from "@/src/components/ui/Pagination";
import Image from "next/image";

// Local Filter Dropdown to match the design exactly as shown in the image
interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  icon: React.ReactNode;
  label?: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

const FilterDropdown = ({ icon, label, value, options, onChange }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLabel = options.find((opt) => opt.value === value)?.label || "All";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ fontFamily: 'Inter' }}
        className="h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <span className="text-[#94A3B8]">{icon}</span>
        {label && <span className="text-[14px] font-medium text-[#64748B]">{label}:</span>}
        <span className="text-[14px] font-bold text-[#0F172A]">{activeLabel}</span>
        <ChevronDown className={`h-4 w-4 text-[#64748B] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-[200px] bg-white border border-[#E2E8F0] rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] z-50 py-2 border-slate-100">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              style={{ fontFamily: 'Inter' }}
              className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-slate-50 transition-colors cursor-pointer ${value === option.value ? "font-bold text-[#0F172A] bg-slate-50" : "text-[#64748B]"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Mock data based on the provided image
const mockLogs = [
  {
    timestamp: "Oct 24, 2024 | 14:00",
    user: "Alice Thompson",
    role: "Admin",
    action: 'User "Alice" deleted "John Doe"',
    status: "Success",
    type: "user",
  },
  {
    timestamp: "Oct 24, 2024 | 12:30",
    user: "Robert Chen",
    role: "User",
    action: "Failed login attempt from IP 192.168.1.1",
    status: "Failed",
    type: "user",
  },
  {
    timestamp: "Oct 24, 2024 | 16:20",
    user: "Alice Thompson",
    role: "Admin",
    action: "Updated shipment route #SHP-9921",
    status: "Success",
    type: "user",
  },
  {
    timestamp: "Oct 24, 2024 | 09:15",
    user: "System Engine",
    role: "System",
    action: "API Key 'Production_Main' rotated",
    status: "Success",
    type: "system",
  },
  {
    timestamp: "Oct 24, 2024 | 18:05",
    user: "Mark Wilson",
    role: "User",
    action: "Exported fleet utilization report",
    status: "Failed",
    type: "user",
  },
  {
    timestamp: "Oct 24, 2024 | 11:20",
    user: "Sarah Jenkins",
    role: "User",
    action: 'New user "T.Smith" onboarded',
    status: "Success",
    type: "user",
  }
];

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("7days");
  const [eventType, setEventType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const dateOptions = [
    { label: "Last 7 Days", value: "7days" },
    { label: "Last 30 Days", value: "30days" },
    { label: "Last 24 Hours", value: "24h" },
  ];

  const eventTypeOptions = [
    { label: "All", value: "all" },
    { label: "User Activity", value: "user" },
    { label: "System Events", value: "system" },
    { label: "Security", value: "security" },
  ];

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: 'Inter' }}>
      {/* Header Section */}
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] h-4 w-4 transition-colors group-focus-within:text-[#0F172A]" />
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
            icon={<Calendar className="h-4 w-4" />}
            value={dateFilter}
            options={dateOptions}
            onChange={setDateFilter}
          />
          <FilterDropdown
            icon={<Filter className="h-4 w-4" />}
            label="Event Type"
            value={eventType}
            options={eventTypeOptions}
            onChange={setEventType}
          />
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="w-full bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8FAFC]/50 border-b border-[#E2E8F0]">
                <th className="px-10 py-5 text-[12px] font-bold text-[#64748B] uppercase tracking-widest">
                  Timestamp
                </th>
                <th className="px-8 py-5 text-[12px] font-bold text-[#64748B] uppercase tracking-widest">
                  User / System
                </th>
                <th className="px-8 py-5 text-[12px] font-bold text-[#64748B] uppercase tracking-widest">
                  Event Action
                </th>
                <th className="px-10 py-5 text-[12px] font-bold text-[#64748B] uppercase tracking-widest text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {mockLogs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6 text-[14px] text-[#64748B] font-medium">
                    {log.timestamp}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center border border-slate-100/50">
                        {log.type === "system" ? (
                          <Image src="/icons/cpu.svg" alt="CPU" width={18} height={18} />
                        ) : (
                          <Image src="/icons/avatar-icon.svg" alt="Avatar" width={18} height={18} />
                        )}
                      </div>
                      <span className="text-[14.5px] font-bold text-[#0F172A]">
                        {log.user}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[14.5px] text-[#475569] font-medium leading-relaxed">
                    {log.action}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-[12.5px] font-bold ${log.status === "Success"
                        ? "bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]"
                        : "bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]"
                        }`}
                    >
                      {log.status === "Success" ? (
                        <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="mr-2 h-3.5 w-3.5" />
                      )}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-10 py-6 border-t border-[#E2E8F0] bg-white">
          <span className="text-[14px] text-[#64748B] font-medium">
            Showing <span className="text-[#0F172A] font-bold">1 to 6</span> of{" "}
            <span className="text-[#0F172A] font-bold">256</span> logs
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={37}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
