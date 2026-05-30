'use client';

import { usePathname } from 'next/navigation';
import StepIndicator from '@/components/StepIndicator';
import { logout } from '@/lib/auth';

const steps = [
  { label: 'Personal Details', path: '/apply/personal' },
  { label: 'Salary Slip', path: '/apply/upload' },
  { label: 'Loan Config', path: '/apply/configure' },
  { label: 'Status', path: '/apply/status' },
];

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-blue-700">LMS Loan Application</h1>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Logout
        </button>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-8">
        <StepIndicator steps={steps} currentPath={pathname} />
        {children}
      </div>
    </div>
  );
}
