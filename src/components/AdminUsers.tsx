import React, { useState } from 'react';
import { Building2, Plus, Edit2, Mail, Check, X, Shield, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../store/AppContext';
import { Role } from '../store/AuthContext';

export function AdminUsers() {
  const { offices } = useAppContext();
  const [isInviting, setIsInviting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'ict_support' as Role,
    departmentId: '',
    status: 'active'
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    // In a real application, this would call a secure backend endpoint 
    // that uses the Supabase Admin API to invite the user:
    // await supabase.auth.admin.inviteUserByEmail(formData.email, { data: { ...formData } })
    
    toast.success(`Invitation sent to ${formData.email} successfully.`);
    setIsInviting(false);
    setFormData({
      fullName: '',
      email: '',
      role: 'ict_support',
      departmentId: '',
      status: 'active'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Access Control</p>
          <h2 className="text-2xl font-bold text-ink">User Management</h2>
        </div>
        {!isInviting && (
          <button 
            onClick={() => setIsInviting(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Invite User</span>
          </button>
        )}
      </div>

      {isInviting && (
        <div className="bg-surface border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-ink text-lg">Send Invitation</h3>
                <p className="text-sm text-ink-muted">Invite a new ICT Support or System Admin to the platform.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsInviting(false)}
              className="p-2 text-ink-muted hover:bg-bg rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleInvite} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-bg border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-bg border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="ict.support1@gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                    className="w-full bg-bg border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-accent appearance-none"
                  >
                    <option value="ict_support">ICT Support</option>
                    <option value="system_admin">System Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Department (Optional)</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                    className="w-full bg-bg border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-accent appearance-none"
                  >
                    <option value="">Select Department</option>
                    {offices.map(office => (
                      <option key={office.id} value={office.id}>{office.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-bg border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-accent appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border mt-6">
              <button
                type="button"
                onClick={() => setIsInviting(false)}
                className="px-4 py-2 text-sm font-bold text-ink-muted hover:text-ink mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-accent text-white rounded-lg text-sm font-bold hover:bg-accent/90 transition-colors shadow-sm flex items-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send Invitation</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mock Table of users to visualize */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-bg/50">
          <h3 className="font-bold text-ink">Registered Accounts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg text-ink-muted font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3 font-bold">User</th>
                <th className="px-6 py-3 font-bold">Role</th>
                <th className="px-6 py-3 font-bold">Department</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* This is mocked for UI display purposes since we don't have the user fetch logic */}
              <tr className="hover:bg-bg/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">
                      SM
                    </div>
                    <div>
                      <div className="font-bold text-ink">System Admin</div>
                      <div className="text-xs text-ink-muted">admin@malungon.gov.ph</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider rounded-md">
                    System Admin
                  </span>
                </td>
                <td className="px-6 py-4 text-ink-muted text-xs">
                  ICT Office
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-bold text-ink">Active</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-ink-muted hover:text-accent transition-colors p-1 opacity-0 group-hover:opacity-100">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
