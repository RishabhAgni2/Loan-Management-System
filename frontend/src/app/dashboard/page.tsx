'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { LoanApplication } from '@/types';

type ModuleKey = 'sales' | 'sanction' | 'disbursement' | 'collection';

const roleHome: Record<string, string> = {
  sales: '/dashboard/sales',
  sanction: '/dashboard/sanction',
  disbursement: '/dashboard/disbursement',
  collection: '/dashboard/collection',
};

const modules: {
  key: ModuleKey;
  title: string;
  path: string;
  description: string;
  tone: string;
}[] = [
  {
    key: 'sales',
    title: 'Sales',
    path: '/dashboard/sales',
    description: 'Registered borrowers who have not applied yet.',
    tone: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  {
    key: 'sanction',
    title: 'Sanction',
    path: '/dashboard/sanction',
    description: 'Applied loans waiting for approval or rejection.',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  {
    key: 'disbursement',
    title: 'Disbursement',
    path: '/dashboard/disbursement',
    description: 'Approved loans ready for funds release.',
    tone: 'border-violet-200 bg-violet-50 text-violet-700',
  },
  {
    key: 'collection',
    title: 'Collection',
    path: '/dashboard/collection',
    description: 'Disbursed and closed loans with repayment tracking.',
    tone: 'border-amber-200 bg-amber-50 text-amber-700',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user] = useState(getStoredUser);
  const role = user?.role || '';
  const name = user?.name || '';
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<ModuleKey, number>>({
    sales: 0,
    sanction: 0,
    disbursement: 0,
    collection: 0,
  });
  const [recentLoans, setRecentLoans] = useState<LoanApplication[]>([]);

  useEffect(() => {
    if (role && role !== 'admin') {
      router.replace(roleHome[role] || '/login');
      return;
    }

    if (role === 'admin') {
      Promise.all([
        api.get('/sales/leads'),
        api.get('/sanction/applications'),
        api.get('/disbursement/loans'),
        api.get('/collection/loans'),
      ])
        .then(([sales, sanction, disbursement, collection]) => {
          const collectionLoans = collection.data.loans || [];
          setCounts({
            sales: sales.data.total ?? sales.data.leads?.length ?? 0,
            sanction: sanction.data.loans?.length ?? 0,
            disbursement: disbursement.data.loans?.length ?? 0,
            collection: collectionLoans.length,
          });
          setRecentLoans(collectionLoans.slice(0, 5));
        })
        .finally(() => setLoading(false));
    }
  }, [role, router]);

  const totalWork = useMemo(
    () => counts.sales + counts.sanction + counts.disbursement + counts.collection,
    [counts]
  );

  if (role && role !== 'admin') {
    return <p className="text-gray-500">Redirecting...</p>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Overview</h2>
          <p className="text-sm text-gray-500">Welcome{name ? `, ${name}` : ''}. Monitor each loan stage from one place.</p>
        </div>
        <div className="rounded-lg border bg-white px-4 py-2 text-sm text-gray-600">
          Total active items: <span className="font-bold text-gray-900">{loading ? '...' : totalWork}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((item) => (
          <Link
            key={item.key}
            href={item.path}
            className={`rounded-xl border p-5 shadow-sm hover:shadow-md ${item.tone}`}
          >
            <p className="text-sm font-medium opacity-80">{item.title}</p>
            <p className="mt-2 text-3xl font-bold">{loading ? '...' : counts[item.key]}</p>
            <p className="mt-3 text-sm text-gray-600">{item.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h3 className="font-semibold text-gray-800">Recent Collection Loans</h3>
          <p className="text-xs text-gray-500">Latest disbursed or closed loans visible to admin.</p>
        </div>
        <div className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-5 py-3 font-semibold">Borrower</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Paid</th>
                <th className="px-5 py-3 font-semibold">Outstanding</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td className="px-5 py-8 text-center text-gray-400" colSpan={5}>Loading...</td></tr>
              ) : recentLoans.length === 0 ? (
                <tr><td className="px-5 py-8 text-center text-gray-400" colSpan={5}>No collection loans yet</td></tr>
              ) : recentLoans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{loan.borrower?.name || 'Unknown User'}</p>
                    <p className="text-xs text-gray-400">{loan.borrower?.email || '-'}</p>
                  </td>
                  <td className="px-5 py-3 capitalize">{loan.status}</td>
                  <td className="px-5 py-3">{loan.totalRepayment.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">{loan.totalPaid.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">{(loan.totalRepayment - loan.totalPaid).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
