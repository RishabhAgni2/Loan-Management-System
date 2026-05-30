'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { getStoredUser, logout } from '@/lib/auth';

interface NavItem {
  label: string;
  path: string;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Overview', path: '/dashboard', roles: ['admin'] },
  { label: 'Sales', path: '/dashboard/sales', roles: ['sales', 'admin'] },
  { label: 'Sanction', path: '/dashboard/sanction', roles: ['sanction', 'admin'] },
  { label: 'Disbursement', path: '/dashboard/disbursement', roles: ['disbursement', 'admin'] },
  { label: 'Collection', path: '/dashboard/collection', roles: ['collection', 'admin'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user] = useState(getStoredUser);
  const role = user?.role || '';
  const name = user?.name || '';

  const visible = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="flex min-h-screen">
      <aside className="fixed flex h-full w-60 flex-col bg-gray-900 px-4 py-6 text-white">
        <h1 className="mb-1 text-xl font-bold text-white">LMS</h1>
        <p className="mb-8 text-xs text-gray-400">Operations Dashboard</p>
        <nav className="flex-1 space-y-1">
          {visible.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-700 pt-4">
          <p className="mb-1 text-xs text-gray-400">{name}</p>
          <p className="mb-3 text-xs capitalize text-blue-400">{role}</p>
          <button onClick={logout} className="text-xs text-red-400 hover:text-red-300">
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-60 flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
