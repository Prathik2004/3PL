'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: '/icons/dashboard.svg' },
  { label: 'Analytics', href: '/analytics', icon: '/icons/analytics.svg' },
  { label: 'Exceptions', href: '/exceptions', icon: '/icons/exceptions.svg' },
  { label: 'Logs', href: '/logs', icon: '/icons/logs.svg' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[255px] h-screen bg-white flex flex-col gap-[4px] px-[16px] border-r border-slate-100">
      {/* Logo Section */}
      <div className="w-full h-[88px] py-[24px] px-[32px] flex items-center gap-[12px]">
        <Image src="/icons/logo.svg" alt="Walkwel Logo" width={160} height={40} priority />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-[4px]">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-[12px] w-[223px] h-[44px] px-[12px] py-[10px] rounded-[8px] transition-colors
                ${isActive 
                  ? 'bg-side-hover text-side-active-text font-medium' 
                  : 'text-side-text hover:bg-side-hover hover:text-side-active-text'}
              `}
            >
              <Image 
                src={item.icon} 
                alt={item.label} 
                width={20} 
                height={20} 
                className={isActive ? 'brightness-0' : 'opacity-70'}
              />
              <span className="text-[14px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}