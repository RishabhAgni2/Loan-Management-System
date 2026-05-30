'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getApiErrorMessages } from '@/lib/errors';

// Client-side BRE for instant feedback (server is authoritative)
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '', pan: '', dateOfBirth: '', monthlySalary: '', employmentMode: 'salaried',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      await api.post('/borrower/personal-details', {
        ...form,
        pan: form.pan.toUpperCase(),
        monthlySalary: Number(form.monthlySalary),
      });
      router.push('/apply/upload');
    } catch (err: unknown) {
      setErrors(getApiErrorMessages(err, 'Failed to save details'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Personal Details</h2>
      <p className="text-gray-500 text-sm mb-6">We&apos;ll run an eligibility check before proceeding</p>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="font-semibold text-red-700 mb-1">Eligibility Check Failed</p>
          {errors.map((e, i) => <p key={i} className="text-red-600 text-sm">• {e}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="As per PAN" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input required maxLength={10} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" />
            {form.pan && !PAN_REGEX.test(form.pan) && (
              <p className="text-orange-500 text-xs mt-1">Format: 5 letters + 4 digits + 1 letter</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input required type="date" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (₹)</label>
            <input required type="number" min={0} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.monthlySalary} onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })} placeholder="e.g. 35000" />
            {form.monthlySalary && Number(form.monthlySalary) < 25000 && (
              <p className="text-orange-500 text-xs mt-1">Minimum salary required: ₹25,000</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Mode</label>
            <select required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.employmentMode} onChange={(e) => setForm({ ...form, employmentMode: e.target.value })}>
              <option value="salaried">Salaried</option>
              <option value="self-employed">Self-Employed</option>
              <option value="unemployed">Unemployed</option>
            </select>
            {form.employmentMode === 'unemployed' && (
              <p className="text-orange-500 text-xs mt-1">Unemployed applicants are not eligible</p>
            )}
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 mt-4">
          {loading ? 'Checking eligibility...' : 'Continue →'}
        </button>
      </form>
    </div>
  );
}
