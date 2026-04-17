'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Settings, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useAuth } from '@/src/lib/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Avatar Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[40px] h-[40px] relative rounded-full overflow-hidden border border-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all active:scale-95"
      >
        <Image
          src="https://api.dicebear.com/9.x/adventurer/svg?seed=Brooklynn"
          alt="User Profile"
          fill
          unoptimized
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-[240px] bg-white rounded-2xl border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.1)] overflow-hidden z-[100]"
          >
            {/* User Info Section */}
            <div className="px-5 py-4 flex flex-col gap-0.5">
              <span className="text-[16px] font-bold text-[#0F172A] truncate">
                {user?.name || 'Alex Thompson'}
              </span>
              <span className="text-[14px] text-[#64748B] font-medium truncate">
                {user?.email || 'alex.t@walkwel.com'}
              </span>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* Menu Items */}
            <div className="p-1.5 flex flex-col gap-0.5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50/50 transition-colors group text-left"
              >
                <LogOut className="w-[18px] h-[18px] text-[#EF4444] stroke-[1.5px]" />
                <span className="text-[15px] font-medium text-[#EF4444]">
                  Logout
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
