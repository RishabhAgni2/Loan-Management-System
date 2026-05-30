import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LMS — Loan Management System',
  description: 'Apply for loans and manage them seamlessly',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}