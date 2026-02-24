"use client"

import React from "react"
import { Progress } from "@/components/ui/progress"

interface CarrierVolumeData {
  name: string;
  orderCount: number;
  percentage: number; // (Carrier Orders / Total Monthly Orders) * 100
  color: string;
}

// These would be dynamically calculated from your backend (Node/Laravel/Python)
const TOP_CARRIERS: CarrierVolumeData[] = [
  { name: "DTDC EXPRESS", orderCount: 450, percentage: 38, color: "bg-[#0F172A]" },
  { name: "DELHIVERY", orderCount: 320, percentage: 27, color: "bg-[#2563EB]" },
  { name: "FEDEX GROUND", orderCount: 280, percentage: 22, color: "bg-[#3B82F6]" },
  { name: "BLUE DART", orderCount: 150, percentage: 13, color: "bg-[#94A3B8]" },
]

export function CarrierVolumeCard() {
  const totalOrders = 1200; // Mock total for the month

  return (
    <div className="w-full rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#0F172A]">
          Top Carriers by Volume
        </h3>
        <p className="text-[14px] text-[#64748B] mt-1">
          Contribution to total orders this month
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {TOP_CARRIERS.map((carrier) => (
          <div key={carrier.name} className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[12px] font-bold tracking-wider text-[#64748B] uppercase">
                  {carrier.name}
                </span>
                <span className="text-[10px] font-medium text-[#94A3B8]">
                  {carrier.orderCount.toLocaleString()} Orders
                </span>
              </div>
              <span className="text-[14px] font-bold text-[#0F172A]">
                {carrier.percentage}%
              </span>
            </div>
            
            <Progress 
              value={carrier.percentage} 
              indicatorColor={carrier.color} 
              className="h-[8px]"
            />
          </div>
        ))}
      </div>

      {/* Legend / Footer info */}
      <div className="mt-10 pt-6 border-t border-slate-50">
        <div className="flex justify-between items-center">
          <span className="text-[12px] font-bold text-[#64748B] uppercase">Total Shipments</span>
          <span className="text-[14px] font-bold text-[#0F172A]">{totalOrders.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}