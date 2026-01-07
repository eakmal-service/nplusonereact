import React from 'react';
import DashboardClient from './DashboardClient'; // This is the old page.tsx content

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return <DashboardClient />;
}
