'use client';
import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { getApiErrorMessage } from '@/lib/errors';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(f.type)) { setError('Only PDF, JPG, PNG allowed'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File size must be under 5MB'); return; }
    setError('');
    setFile(f);
    if (f.type.startsWith('image/')) setPreview(URL.createObjectURL(f));
    else setPreview('');
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file'); return; }
    setLoading(true);
    const formData = new FormData();
    formData.append('salarySlip', file);
    try {
      await api.post('/borrower/upload-salary-slip', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/apply/configure');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Upload failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Upload Salary Slip</h2>
      <p className="text-gray-500 text-sm mb-6">PDF, JPG, or PNG · Max 5 MB</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}

      <label className="block border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-10 text-center cursor-pointer transition">
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
        {file ? (
          <div>
            {preview && <Image src={preview} alt="preview" width={160} height={160} className="mx-auto mb-3 max-h-40 rounded object-contain" />}
            <p className="text-blue-600 font-medium">{file.name}</p>
            <p className="text-gray-400 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-2">📎</p>
            <p className="text-gray-600 font-medium">Click to select file</p>
            <p className="text-gray-400 text-sm">or drag and drop here</p>
          </div>
        )}
      </label>

      <button onClick={handleUpload} disabled={!file || loading}
        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50">
        {loading ? 'Uploading...' : 'Upload & Continue →'}
      </button>
    </div>
  );
}
