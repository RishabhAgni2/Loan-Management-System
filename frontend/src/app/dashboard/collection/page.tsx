'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LoanApplication, Payment } from '@/types';
import { getApiErrorMessage } from '@/lib/errors';

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);

export default function CollectionPage() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [form, setForm] = useState({ utrNumber: '', amount: '', paymentDate: new Date().toISOString().split('T')[0] });
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchLoans = () => {
    setLoading(true);
    api.get('/collection/loans').then(({ data }) => setLoans(data.loans)).finally(() => setLoading(false));
  };

  const openLoan = async (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setError('');
    setSuccess('');
    const { data } = await api.get(`/collection/${loan._id}/payments`);
    setPayments(data.payments);
  };

  useEffect(() => {
    api.get('/collection/loans')
      .then(({ data }) => setLoans(data.loans))
      .finally(() => setLoading(false));
  }, []);

  const handlePayment = async () => {
    if (!selectedLoan) return;
    setError('');
    setSuccess('');
    setPayLoading(true);
    try {
      const { data } = await api.post(`/collection/${selectedLoan._id}/payment`, {
        ...form, amount: Number(form.amount),
      });
      setSuccess(data.message);
      setForm({ utrNumber: '', amount: '', paymentDate: new Date().toISOString().split('T')[0] });
      // Refresh
      fetchLoans();
      const updated = await api.get(`/collection/${selectedLoan._id}/payments`);
      setPayments(updated.data.payments);
      // Update selected loan
      const refreshed = await api.get('/collection/loans');
      const updatedLoan = refreshed.data.loans.find((l: LoanApplication) => l._id === selectedLoan._id);
      if (updatedLoan) setSelectedLoan(updatedLoan);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Payment failed'));
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Loans List */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Collection — Disbursed Loans</h2>
        <p className="text-gray-500 text-sm mb-6">Record repayments for active loans</p>
        {loading ? <p className="text-gray-400">Loading...</p> : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{['Borrower', 'Total', 'Paid', 'Outstanding', 'Status', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y">
                {loans.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">No loans</td></tr>
                ) : loans.map((loan) => (
                  <tr key={loan._id} className={`hover:bg-gray-50 ${selectedLoan?._id === loan._id ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{loan.borrower.name}</p>
                      <p className="text-gray-400 text-xs">{loan.borrower.email}</p>
                    </td>
                    <td className="px-4 py-3">{fmt(loan.totalRepayment)}</td>
                    <td className="px-4 py-3 text-green-600">{fmt(loan.totalPaid)}</td>
                    <td className="px-4 py-3 text-red-600">{fmt(loan.totalRepayment - loan.totalPaid)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${loan.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {loan.status === 'disbursed' && (
                        <button onClick={() => openLoan(loan)}
                          className="text-xs text-blue-600 hover:underline font-medium">Record Payment</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Panel */}
      {selectedLoan && (
        <div className="w-80 bg-white rounded-xl shadow-sm border p-5 h-fit sticky top-4">
          <h3 className="font-bold text-gray-800 mb-1">{selectedLoan.borrower.name}</h3>
          <p className="text-xs text-gray-500 mb-4">Outstanding: <strong className="text-red-600">{fmt(selectedLoan.totalRepayment - selectedLoan.totalPaid)}</strong></p>

          {error && <div className="bg-red-50 text-red-600 text-xs p-2 rounded mb-3">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 text-xs p-2 rounded mb-3">{success}</div>}

          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-medium text-gray-600">UTR Number *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.utrNumber} onChange={(e) => setForm({ ...form, utrNumber: e.target.value })} placeholder="Unique UTR" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Amount (₹) *</label>
              <input type="number" min={1} className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Enter amount" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Payment Date *</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} />
            </div>
          </div>

          <button onClick={handlePayment} disabled={payLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition disabled:opacity-50">
            {payLoading ? 'Recording...' : 'Record Payment'}
          </button>

          {/* Payment History */}
          {payments.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-700 mb-2">Payment History</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {payments.map((p) => (
                  <div key={p._id} className="bg-gray-50 rounded p-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-medium text-green-700">{fmt(p.amount)}</span>
                      <span className="text-gray-500">{new Date(p.paymentDate).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p className="text-gray-400 mt-0.5">UTR: {p.utrNumber}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
