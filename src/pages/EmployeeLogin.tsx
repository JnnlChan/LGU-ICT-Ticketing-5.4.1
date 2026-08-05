import React from 'react';
import { useAuth, Role } from '../store/AuthContext';
import { ShieldCheck, ArrowRight, ServerCrash } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { Link, Navigate } from 'react-router-dom';

export function EmployeeLogin() {
  const { signInWithGoogle, user, profile, loading, mockLogin } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-bg"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // If already authenticated and has a profile, go to app
  if (user && profile) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-accent" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-ink">
          LGU ICT Terminal
        </h2>
        <p className="mt-2 text-center text-sm text-ink-muted">
          Employee Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 shadow-xl shadow-black/5 sm:rounded-2xl sm:px-10 border border-border">
          
          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm flex items-start space-x-3">
              <ServerCrash className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">System Error</p>
                <p className="mt-1">Authentication service is not configured. Please contact the ICT Office.</p>
              </div>
            </div>
          )}

          {user && !profile && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 text-sm">
              <p className="font-bold">Unregistered Account</p>
              <p className="mt-1">Your account is not registered in the LGU ICT Help Desk System. Please contact the ICT Office.</p>
            </div>
          )}

          <div>
            <button
              onClick={signInWithGoogle}
              disabled={!isSupabaseConfigured}
              className="w-full flex justify-center items-center py-3 px-4 border border-border rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <p className="mt-4 text-xs text-center text-ink-muted">
              Only @malungon.gov.ph accounts are allowed.
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">Mock Login for Dev</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => mockLogin('employee')} className="px-4 py-2 border border-border rounded-lg text-xs font-bold hover:bg-bg">Mock Employee</button>
                <button onClick={() => mockLogin('system_admin')} className="px-4 py-2 border border-border rounded-lg text-xs font-bold hover:bg-bg">Mock Admin</button>
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-ink-muted">Authorized personnel only</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/ict-login"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-accent bg-accent/10 hover:bg-accent/20 transition-all"
              >
                Admin & ICT Support Login
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
