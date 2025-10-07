'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardContent from '@/components/me/DashboardContent';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
  