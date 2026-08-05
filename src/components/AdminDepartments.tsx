import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Building2, Plus, Edit2, Check, X } from 'lucide-react';
import { Toast, ConfirmModal } from '../lib/toast';

export function AdminDepartments() {
  const { offices, createNewOffice, updateExistingOffice } = useAppContext();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newOfficeName, setNewOfficeName] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newOfficeName.trim()) {
      const result = await ConfirmModal.fire({
        text: 'Are you sure you want to add this department?'
      });
      if (result.isConfirmed) {
        createNewOffice(newOfficeName.trim());
        setNewOfficeName('');
        setIsAdding(false);
        Toast.fire({
          icon: 'success',
          title: 'Department added'
        });
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && editName.trim()) {
      const result = await ConfirmModal.fire({
        text: 'Are you sure you want to update this department?'
      });
      if (result.isConfirmed) {
        updateExistingOffice(editingId, editName.trim());
        setEditingId(null);
        setEditName('');
        Toast.fire({
          icon: 'success',
          title: 'Department updated'
        });
      }
    }
  };

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-start mb-10">
        <div>
          <h1 className="font-black text-[2.5rem] tracking-[-0.05em] mb-2 text-ink">Departments</h1>
          <p className="text-ink-muted text-[0.9rem]">Manage LGU departments and offices</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="flex items-center gap-2 bg-accent text-white px-[1.4rem] py-[0.8rem] rounded-lg font-semibold text-[0.85rem] shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer border-none"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </section>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
           <div className="text-[0.9rem] font-semibold flex items-center gap-2">
             <div className="w-2 h-2 bg-accent rounded-full"></div>
             LGU Departments
           </div>
        </div>
        
        {isAdding && (
          <div className="p-5 border-b border-white/5 bg-white/5">
            <form onSubmit={handleAdd} className="flex items-center gap-3">
              <input
                autoFocus
                type="text"
                placeholder="Enter department name..."
                value={newOfficeName}
                onChange={(e) => setNewOfficeName(e.target.value)}
                className="flex-1 bg-bg border border-border rounded-lg text-ink px-4 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
              <button type="submit" className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:brightness-110">
                <Check className="w-4 h-4" /> Save
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-white/10 text-ink px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-white/20 border border-white/10">
                <X className="w-4 h-4" /> Cancel
              </button>
            </form>
          </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5">
            <tr className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
              <th className="px-6 py-4 font-normal">Department Name</th>
              <th className="px-6 py-4 font-normal">ID</th>
              <th className="px-6 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offices.map(office => (
              <tr key={office.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5 border-b border-border group-last:border-none">
                  {editingId === office.id ? (
                    <form onSubmit={handleUpdate} className="flex items-center gap-2">
                      <input
                        autoFocus
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 bg-bg border border-border rounded-md text-ink px-3 py-1.5 text-sm outline-none focus:border-accent"
                      />
                    </form>
                  ) : (
                    <div className="text-[0.85rem] font-bold text-ink flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-ink-muted" />
                      {office.name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-5 border-b border-border group-last:border-none font-mono text-ink-muted text-xs">
                  {office.id}
                </td>
                <td className="px-6 py-5 border-b border-border group-last:border-none text-right">
                  {editingId === office.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={handleUpdate} className="p-1.5 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={cancelEdit} className="p-1.5 bg-white/10 text-ink-muted rounded hover:bg-white/20">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => startEdit(office.id, office.name)}
                      className="p-1.5 text-ink-muted hover:text-accent rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
