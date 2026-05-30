'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LoanApplication } from '@/types';
import { getApiErrorMessage } from '@/lib/errors';

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function SanctionPage() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ loan: LoanApplication; type: 'sanction' | 'reject' } | null>(null);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLoans = () => {
    setLoading(true);
    api.get('/sanction/applications')
      .then(({ data }) => setLoans(data.loans))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/sanction/applications')
      .then(({ data }) => setLoans(data.loans))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async () => {
    if (!modal) return;
    if (modal.type === 'reject' && !reason.trim()) { alert('Please enter a rejection reason'); return; }
    setActionLoading(true);
    try {
      if (modal.type === 'sanction') await api.patch(`/sanction/${modal.loan._id}/sanction`);
      else await api.patch(`/sanction/${modal.loan._id}/reject`, { reason });
      setModal(null);
      setReason('');
      fetchLoans();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Action failed'));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Sanction — Applied Loans</h2>
      <p className="text-gray-500 text-sm mb-6">Review and approve or reject loan applications</p>

      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{['Borrower', 'PAN', 'Amount', 'Tenure', 'Total Repayment', 'Applied On', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y">
              {loans.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No applications pending</td></tr>
              ) : loans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{loan.borrower.name}</p>
                    <p className="text-gray-400 text-xs">{loan.borrower.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{loan.pan}</td>
                  <td className="px-4 py-3">{fmt(loan.loanAmount)}</td>
                  <td className="px-4 py-3">{loan.tenure}d</td>
                  <td className="px-4 py-3 font-medium text-blue-700">{fmt(loan.totalRepayment)}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(loan.appliedAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => setModal({ loan, type: 'sanction' })}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium hover:bg-green-200">Approve</button>
                    <button onClick={() => { setModal({ loan, type: 'reject' }); setReason(''); }}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-medium hover:bg-red-200">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold mb-3">
              {modal.type === 'sanction' ? '✅ Approve Loan' : '❌ Reject Loan'}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Borrower: <strong>{modal.loan.borrower.name}</strong> · {fmt(modal.loan.loanAmount)}
            </p>
            {modal.type === 'reject' && (
              <textarea required className="w-full border rounded-lg p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                rows={3} placeholder="Enter rejection reason..." value={reason} onChange={(e) => setReason(e.target.value)} />
            )}
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 border py-2 rounded-lg text-sm text-gray-600">Cancel</button>
              <button onClick={handleAction} disabled={actionLoading}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50
                  ${modal.type === 'sanction' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {actionLoading ? 'Processing...' : (modal.type === 'sanction' ? 'Confirm Approval' : 'Confirm Rejection')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
