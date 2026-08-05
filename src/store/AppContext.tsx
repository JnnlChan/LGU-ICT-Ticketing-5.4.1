import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Ticket, Asset, Office, mockCategories } from './mockData';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mapAssetFromDB, mapAssetToDB, mapTicketFromDB, mapTicketToDB, mapUserFromDB, mapOfficeFromDB } from '../lib/mappers';
import { toast } from 'sonner';

interface AppContextType {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
  tickets: Ticket[];
  createNewTicket: (ticket: any) => void;
  changeTicketStatus: (ticketId: string, status: Ticket['status'], assignedToId?: string) => void;
  addComment: (ticketId: string, text: string) => void;
  updateRecommendation: (ticketId: string, recommendation: string) => void;
  users: User[];
  assets: Asset[];
  createNewAsset: (asset: any) => void;
  updateExistingAsset: (id: string, updates: any) => void;
  offices: Office[];
  createNewOffice: (name: string) => void;
  updateExistingOffice: (id: string, name: string) => void;
  categories: typeof mockCategories;
  authError: string | null;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const currentUser: User | null = profile ? {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    role: profile.role === 'system_admin' ? 'Admin' : (profile.role === 'ict_support' ? 'ICT Support' : 'Department User'),
    officeId: profile.department_id || undefined
  } : null;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const fetchData = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      const [ticketsRes, assetsRes, officesRes, usersRes] = await Promise.all([
        supabase.from('tickets').select('*').order('created_at', { ascending: false }),
        supabase.from('assets').select('*').order('created_at', { ascending: false }),
        supabase.from('departments').select('*').order('name'),
        supabase.from('profiles').select('*')
      ]);

      if (ticketsRes.data) setTickets(ticketsRes.data.map(mapTicketFromDB));
      if (assetsRes.data) setAssets(assetsRes.data.map(mapAssetFromDB));
      if (officesRes.data) setOffices(officesRes.data.map(mapOfficeFromDB));
      if (usersRes.data) setUsers(usersRes.data.map(mapUserFromDB));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data from server.');
    }
  };

  useEffect(() => {
    fetchData();
    
    if (isSupabaseConfigured) {
      const ticketsSub = supabase.channel('tickets-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, fetchData).subscribe();
      const assetsSub = supabase.channel('assets-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'assets' }, fetchData).subscribe();
      
      return () => {
        ticketsSub.unsubscribe();
        assetsSub.unsubscribe();
      };
    }
  }, []);

  const login = (userId: string) => {};
  const logout = async () => { await signOut(); };

  const createNewTicket = async (ticket: any) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('tickets').insert(mapTicketToDB(ticket));
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast.error('Failed to create ticket: ' + error.message);
    }
  };

  const changeTicketStatus = async (ticketId: string, status: Ticket['status'], assignedToId?: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const updates: any = { status };
      if (assignedToId) updates.assigned_to = assignedToId;
      const { error } = await supabase.from('tickets').update(updates).eq('id', ticketId);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast.error('Failed to update ticket: ' + error.message);
    }
  };

  const addComment = async (ticketId: string, text: string) => {
    if (!isSupabaseConfigured || !currentUser) return;
    try {
      const { error } = await supabase.from('ticket_comments').insert({
        ticket_id: ticketId,
        author_id: currentUser.id,
        content: text
      });
      if (error) throw error;
      // Depending on UI, we might need to fetch comments for tickets
    } catch (error: any) {
      toast.error('Failed to add comment: ' + error.message);
    }
  };

  const updateRecommendation = async (ticketId: string, recommendation: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('tickets').update({ recommendation }).eq('id', ticketId);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast.error('Failed to update recommendation: ' + error.message);
    }
  };

  const createNewAsset = async (asset: any) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('assets').insert(mapAssetToDB(asset));
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast.error('Failed to create asset: ' + error.message);
    }
  };
  
  const updateExistingAsset = async (id: string, updates: any) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('assets').update(mapAssetToDB(updates)).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast.error('Failed to update asset: ' + error.message);
    }
  };
  
  const createNewOffice = async (name: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('departments').insert({ name });
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast.error('Failed to create department: ' + error.message);
    }
  };
  
  const updateExistingOffice = async (id: string, name: string) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.from('departments').update({ name }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast.error('Failed to update department: ' + error.message);
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, tickets, createNewTicket, changeTicketStatus, addComment, updateRecommendation,
      users, assets, createNewAsset, updateExistingAsset, offices, createNewOffice, updateExistingOffice, categories: mockCategories, authError,
      theme, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
