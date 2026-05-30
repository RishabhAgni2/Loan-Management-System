'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LoanApplication } from '@/types';

const statusConfig: Record<string, { label: string; color: string; icon: string; desc: string }> = {
  applied:    { label: 'Under Review',  color: 'bg-yellow-100 text-yellow-700', icon: '⏳', desc: 'Your application is with the sanction team.' },
  sanctioned: { label: 'Sanctioned',    color: 'bg-blue-100 text-blue-700',    icon: '✅', desc: 'Your loan is approved and pending disbursement.' },
  disbursed:  { label: 'Disbursed',     color: 'bg-purple-100 text-purple-700', icon: '💸', desc: 'Funds have been released to your account.' },
  closed:     { label: 'Closed',        color: 'bg-green-100 text-green-700',  icon: '🎉', desc: 'Your loan has been fully repaid. Congratulations!' },
  rejected:   { label: 'Rejected',      color: 'bg-red-100 text-red-700',      icon: '❌', desc: 'Your application was not approved.' },
};

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

export default function StatusPage() {
  const [loan, setLoan] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/borrower/loan-status')
      .then(({ data }) => setLoan(data.application))
      .catch(() => setLoan(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!loan) return <div className="text-center py-20 text-gray-500">No application found.</div>;

  const status = statusConfig[loan.status] || statusConfig.applied;

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
      <div className="text-center mb-6">
        <span className="text-5xl">{status.icon}</span>
        <h2 className="text-2xl font-bold text-gray-800 mt-2">{status.label}</h2>
        <p className="text-gray-500 text-sm mt-1">{status.desc}</p>
        {loan.rejectionReason && (
          <p className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">Reason: {loan.rejectionReason}</p>
        )}
      </div>

      <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${status.color} mb-6 block w-fit mx-auto`}>
        {loan.status.toUpperCase()}
      </span>

      <div className="grid grid-cols-2 gap-3">
        {[
          ['Loan Amount', fmt(loan.loanAmount)],
          ['Tenure', `${loan.tenure} days`],
          ['Interest Rate', `${loan.interestRate}% p.a.`],
          ['Simple Interest', fmt(loan.simpleInterest)],
          ['Total Repayment', fmt(loan.totalRepayment)],
          ['Amount Paid', fmt(loan.totalPaid || 0)],
          ['Outstanding', fmt(loan.totalRepayment - (loan.totalPaid || 0))],
          ['Applied On', new Date(loan.appliedAt).toLocaleDateString('en-IN')],
        ].map(([label, value]) => (
          <div key={label} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800 mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}