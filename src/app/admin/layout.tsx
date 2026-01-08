import React, { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import AdminHeader from '@/components/admin/Header';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <AdminHeader />
      <main>
        {children}
      </main>
    </div>
  );
} 