"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const ROLES = ["Admin", "Operations", "Viewer"]

export default function RoleDropdown() {
  const [open, setOpen] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState("")

  return (
    <div className="flex-1 w-full flex flex-col gap-1 relative">
      <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Role</span>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-11 bg-white border border-[#E2E8F0] rounded-lg px-4 flex items-center justify-between text-[14px] outline-none focus:ring-2 focus:ring-[#E2E8F0] transition-all"
      >
        <span className={cn(selectedRole ? "text-[#0F172A]" : "text-[#64748B]")}>
          {selectedRole || "Select Role"}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[#64748B]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#64748B]" />
        )}
      </button>

      {/* Dropdown Menu - Matches image_442a9c.png */}
      {open && (
        <div className="absolute top-[76px] left-0 w-full bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden p-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-1">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setSelectedRole(role)
                  setOpen(false)
                }}
                className="flex items-center gap-4 w-full p-4 hover:bg-slate-50 transition-colors rounded-xl text-left group"
              >
                {/* Custom Radio-style Circle from image_442a9c.png */}
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  selectedRole === role 
                    ? "border-[#0F172A] bg-[#0F172A]" 
                    : "border-[#E2E8F0] group-hover:border-[#CBD5E1]"
                )}>
                  {selectedRole === role && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                
                <span className="text-[#334155] font-medium text-[16px]">
                  {role}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}