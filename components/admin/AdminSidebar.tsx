'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Megaphone, Scale, Wallet } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Kelola User', icon: Users },
  { href: '/admin/campaigns', label: 'Kelola Campaign', icon: Megaphone },
  { href: '/admin/disputes', label: 'Dispute', icon: Scale },
  { href: '/admin/withdrawals', label: 'Withdrawal', icon: Wallet },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 md:w-64">
      <div className="rounded-2xl border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <p className="mb-3 px-2 text-[10px] font-black uppercase tracking-wider text-gray-500">
          Admin Panel
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} prefetch={false}>
                <span
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-xs font-black uppercase transition-all ${
                    isActive
                      ? 'border-black bg-[#FFDE59] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'border-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
