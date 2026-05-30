'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import LoanCalculator from '@/components/LoanCalculator';
import { getApiErrorMessage } from '@/lib/errors';

const formatINR = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function ConfigureLoanPage() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState(150000);
  const [tenure, setTenure] = useState(180);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/borrower/configure-loan', { loanAmount, tenure });
      router.push('/apply/status');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to apply'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Configure Your Loan</h2>
      <p className="text-gray-500 text-sm mb-6">Interest rate is fixed at 12% p.a.</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Loan Amount</label>
            <span className="text-blue-600 font-bold text-lg">{formatINR(loanAmount)}</span>
          </div>
          <input type="range" min={50000} max={500000} step={5000}
            value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>₹50,000</span><span>₹5,00,000</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Tenure</label>
            <span className="text-blue-600 font-bold text-lg">{tenure} days</span>
          </div>
          <input type="range" min={30} max={365} step={5}
            value={tenure} onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>30 days</span><span>365 days</span>
          </div>
        </div>

        <LoanCalculator loanAmount={loanAmount} tenure={tenure} />

        <button onClick={handleApply} disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 text-lg">
          {loading ? 'Submitting...' : '✅ Apply for Loan'}
        </button>
      </div>
    </div>
  );
}
