'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LoanApplication } from '@/types';
import { getApiErrorMessage } from '@/lib/errors';

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function DisbursementPage() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [disbursing, setDisbursing] = useState<string | null>(null);

  const fetchLoans = () => {
    setLoading(true);
    api.get('/disbursement/loans')
      .then(({ data }) => setLoans(data.loans))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    api.get('/disbursement/loans')
      .then(({ data }) => setLoans(data.loans))
      .finally(() => setLoading(false));
  }, []);

  const handleDisburse = async (id: string) => {
    if (!confirm('Confirm funds disbursement?')) return;
    setDisbursing(id);
    try {
      await api.patch(`/disbursement/${id}/disburse`);
      fetchLoans();
    } catch (err: unknown) {
      alert(getApiErrorMessage(err, 'Failed'));
    } finally {
      setDisbursing(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Disbursement — Sanctioned Loans</h2>
      <p className="text-gray-500 text-sm mb-6">Release funds for approved loans</p>

      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{['Borrower', 'Amount', 'Tenure', 'Total Repayment', 'Sanctioned On', 'Action'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y">
              {loans.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No sanctioned loans</td></tr>
              ) : loans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{loan.borrower.name}</p>
                    <p className="text-gray-400 text-xs">{loan.borrower.email}</p>
                  </td>
                  <td className="px-4 py-3">{fmt(loan.loanAmount)}</td>
                  <td className="px-4 py-3">{loan.tenure}d</td>
                  <td className="px-4 py-3 font-medium text-blue-700">{fmt(loan.totalRepayment)}</td>
                  <td className="px-4 py-3 text-gray-500">{loan.sanctionedAt ? new Date(loan.sanctionedAt).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDisburse(loan._id)} disabled={disbursing === loan._id}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-medium disabled:opacity-50">
                      {disbursing === loan._id ? 'Processing...' : '💸 Disburse'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
