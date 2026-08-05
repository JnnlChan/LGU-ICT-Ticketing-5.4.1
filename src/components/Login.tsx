import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ShieldAlert } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const { authError, users, login } = useAppContext();

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    }
  };

  return (
    <div className="h-screen bg-bg text-ink flex items-center justify-center p-4">
      <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border w-full max-w-md">
        <h1 className="text-2xl font-black mb-2 tracking-tight text-center">LGU ICT Terminal</h1>
        <p className="text-sm text-ink-muted text-center mb-8">Select a mock user role to login</p>
        
        <div className="space-y-4">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => login(u.id)}
              className="w-full text-left px-5 py-4 border border-border rounded-xl hover:bg-surface/5 transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-ink group-hover:text-accent transition-colors">{u.name}</div>
                <div className="text-xs text-ink-muted font-mono mt-1 uppercase">{u.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
