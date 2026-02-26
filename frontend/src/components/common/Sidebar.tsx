'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard/overview', icon: '/icons/dashboard.svg' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: '/icons/analytics.svg' },
  { label: 'Exceptions', href: '/dashboard/exceptions', icon: '/icons/exceptions.svg' },
  { label: 'Logs', href: '/dashboard/logs', icon: '/icons/logs.svg' },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps = {}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-[50]
          w-[255px] h-screen bg-white flex flex-col gap-[4px] px-[16px] border-r border-slate-100
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section - Height 88px */}
        <div className="w-full h-[88px] py-[24px] px-[16px] flex items-center justify-between gap-[12px]">
          <Image src="/icons/logo.svg" alt="Walkwel Logo" width={160} height={40} priority />
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-2 -mr-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items - Gap 4px */}
        <nav className="flex flex-col gap-[4px]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                flex items-center gap-[12px] w-[223px] h-[44px] px-[12px] py-[10px] rounded-[8px] transition-all duration-200
                ${isActive
                    ? 'bg-[#E2E8F0] text-[#0F172A] font-medium' // Active state
                    : 'bg-white text-[#64748B] hover:bg-[#F5F9FF] hover:text-[#0F172A]' // Inactive & Hover
                  }
              `}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={isActive ? 'brightness-0' : 'opacity-70'}
                />
                <span className="text-[14px] leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}