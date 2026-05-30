'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Lead { _id: string; name: string; email: string; createdAt: string }

export default function SalesPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/sales/leads')
      .then(({ data }) => setLeads(data.leads))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Sales — Lead Tracker</h2>
      <p className="text-gray-500 text-sm mb-6">Borrowers who registered but haven&apos;t applied yet</p>

      {loading ? <p className="text-gray-400">Loading...</p> : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{['Name', 'Email', 'Registered On', 'Status'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-700">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y">
              {leads.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">No leads found</td></tr>
              ) : leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3"><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-medium">Not Applied</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-500">Total: {leads.length} leads</div>
        </div>
      )}
    </div>
  );
}
