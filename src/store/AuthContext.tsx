import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { mockUsers } from './mockData';

export type Role = 'system_admin' | 'ict_support' | 'employee';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  department_id: string | null;
  status: 'active' | 'inactive' | 'suspended';
  avatar_url?: string;
}

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  mockLogin: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSessionAndProfile = async (currentSession: Session | null) => {
    setSession(currentSession);
    const currentUser = currentSession?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      if (currentUser.app_metadata?.provider === 'google') {
        if (!currentUser.email?.endsWith('@malungon.gov.ph') && currentUser.email !== 'onealmahinay@gmail.com') {
          toast.error('Only @malungon.gov.ph accounts are allowed.');
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          setProfile(null);
          setLoading(false);
          return;
        }
      }
      
      await fetchProfile(currentUser);
    } else {
      setProfile(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkSessionAndProfile(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSessionAndProfile(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (currentUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
           // Create fallback profile
           const { data: newProfile, error: insertError } = await supabase
             .from('profiles')
             .insert({
                id: currentUser.id,
                email: currentUser.email || '',
                full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'New User',
                role: currentUser.email === 'onealmahinay@gmail.com' ? 'system_admin' : 'employee',
                status: 'active'
             })
             .select()
             .single();
             
           if (insertError) {
              console.error('Failed to create fallback profile:', insertError);
              toast.error('Your profile was not found and could not be created automatically. Make sure the database schema is fully deployed.');
           } else {
              setProfile(newProfile);
           }
        } else {
          throw error;
        }
      } else {
        if (currentUser.email === 'onealmahinay@gmail.com' && data.role !== 'system_admin') {
          const { data: updatedData } = await supabase
            .from('profiles')
            .update({ role: 'system_admin' })
            .eq('id', currentUser.id)
            .select()
            .single();
          setProfile(updatedData || { ...data, role: 'system_admin' });
        } else {
          setProfile(data);
        }
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error(error.message || 'Error loading profile. Check if the database schema is correctly deployed.');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      toast.error('Supabase not configured. Use mock login below.');
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: 'select_account'
          }
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase not configured.') };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setProfile(null);
      toast.success('Logged out successfully');
      return;
    }
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const mockLogin = (role: Role) => {
    const mockProfile: Profile = {
      id: 'mock-' + role,
      email: role + '@malungon.gov.ph',
      full_name: role === 'system_admin' ? 'Mock Admin' : role === 'ict_support' ? 'Mock ICT' : 'Mock Employee',
      role: role,
      department_id: role === 'employee' ? 'off-1' : null,
      status: 'active'
    };
    setUser({ id: mockProfile.id, email: mockProfile.email } as SupabaseUser);
    setProfile(mockProfile);
    toast.success('Mock login successful');
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signInWithGoogle, signInWithEmail, signOut, mockLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
