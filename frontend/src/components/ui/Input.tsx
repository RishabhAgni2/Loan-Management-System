import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
      <input
        id={inputId}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${
          error ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
        } ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
