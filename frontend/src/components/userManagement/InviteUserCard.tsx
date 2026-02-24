"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import BasicInput from "@/src/components/ui/BasicInput"
import BasicButton from "@/src/components/ui/BasicButton"
import { Card } from "@/src/components/ui/card"

const ROLES = ["Admin", "Operations", "Viewer"]

export default function InviteUserCard() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <Card className="w-full bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-[#0F172A] font-bold text-xl mb-8">Add New User</h3>

      <div className="flex flex-col lg:flex-row items-end gap-6">
        {/* 1. Full Name Input */}
        <div className="flex-1 w-full">
          <BasicInput text="FULL NAME" placeholder="John Doe" />
        </div>
        {/* 2. Email Address Input */}
        <div className="flex-1 w-full">
          <BasicInput text="EMAIL ADDRESS" placeholder="john@walkwel.com" type="email" />
        </div>

        {/* 3. Custom Role Dropdown */}
        <div className="flex-1 w-full flex flex-col gap-1 relative" ref={dropdownRef}>
          <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Role</span>
          
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full h-11 bg-white border border-[#E2E8F0] rounded-lg px-4 flex items-center justify-between text-[14px] outline-none focus:ring-2 focus:ring-[#E2E8F0] transition-all"
          >
            <span className={cn(selectedRole ? "text-[#0F172A]" : "text-[#64748B]")}>
              {selectedRole || "Select Role"}
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-[#64748B]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#64748B]" />
            )}
          </button>

          {/* Radio-style Menu */}
          {isOpen && (
            <div className="absolute top-[76px] left-0 w-full bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden p-2">
              <div className="flex flex-col gap-1">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role)
                      setIsOpen(false)
                    }}
                    className="flex items-center gap-4 w-full p-4 hover:bg-slate-50 transition-colors rounded-xl text-left group"
                  >
                    {/* Circle Indicator */}
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      selectedRole === role 
                        ? "border-[#0F172A] bg-[#0F172A]" 
                        : "border-[#E2E8F0] group-hover:border-[#CBD5E1]"
                    )}>
                      {selectedRole === role && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-[#334155] font-medium text-[16px]">{role}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Send Invite Button */}
        {/* 4. Send Invite Button */}
<BasicButton 
  className="w-full lg:w-[155px] h-11 bg-[#0F172A] hover:bg-[#1e293b] text-white rounded-lg flex items-center justify-center gap-2"
>
  <Image 
    src="/icons/newUser.svg" 
    alt="Add User" 
    width={18} 
    height={18} 
    /* brightness-0 makes it pure black, then invert makes it pure white */
    className="brightness-0 invert" 
  />
  <span className="text-[14px] font-medium">Send Invite</span>
</BasicButton>
      </div>

      {/* Info Footer */}
      <div className="mt-6 flex items-start gap-2">
        <Image src="/icons/info.svg" alt="Info" width={14} height={14} className="mt-0.5 opacity-60" />
        <p className="text-[12px] text-[#64748B]">
          A temporary password and reset link will be sent to this email immediately upon creation.
        </p>
      </div>
    </Card>
  )
}