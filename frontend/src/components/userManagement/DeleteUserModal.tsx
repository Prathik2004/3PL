"use client"

import React from "react"
import { X, AlertTriangle } from "lucide-react"
import BasicButton from "@/src/components/ui/BasicButton"

interface DeleteUserModalProps {
  userName: string; // Dynamic user name
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteUserModal({ 
  userName, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[480px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-50">
          <h3 className="text-[#0F172A] font-bold text-xl">Delete User</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 flex gap-6">
          <div className="shrink-0 w-12 h-12 bg-[#FEF2F2] rounded-full flex items-center justify-center">
            <AlertTriangle className="text-[#EF4444]" size={24} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#64748B] text-[16px] leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-[#0F172A]">{userName}</span>? 
              This action cannot be undone and they will lose all access to the logistics platform immediately.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F8FAFC] p-6 flex justify-end gap-3">
          <BasicButton 
            text="Cancel"
            onClick={onClose}
            className="w-[100px] h-11 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] rounded-lg font-bold"
          />
          <BasicButton 
            text="Delete User"
            onClick={onConfirm}
            className="w-[140px] h-11 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg font-bold"
          />
        </div>
      </div>
    </div>
  )
}