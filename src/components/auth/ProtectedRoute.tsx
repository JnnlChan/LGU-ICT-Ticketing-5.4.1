import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/" replace />;
  }

  if (profile.status !== 'active') {
    return (
      <div className="h-screen flex items-center justify-center bg-bg text-ink p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Account Suspended</h1>
          <p className="text-ink-muted">Your account is not active. Please contact the ICT Office.</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg text-ink p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-ink-muted">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
