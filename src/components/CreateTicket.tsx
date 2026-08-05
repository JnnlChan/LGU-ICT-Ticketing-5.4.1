import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ArrowLeft } from 'lucide-react';
import { Toast, ConfirmModal } from '../lib/toast';

export function CreateTicket({ onBack }: { onBack: () => void }) {
  const { categories, assets, currentUser, createNewTicket } = useAppContext();
  
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [priority, setPriority] = useState('Medium');
  const [assetId, setAssetId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Only show assets assigned to this user's office
  const officeAssets = assets.filter(a => a.officeId === currentUser?.officeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const result = await ConfirmModal.fire({
      text: 'Are you sure you want to submit this ticket?'
    });
    
    if (result.isConfirmed) {
      createNewTicket({
        requesterId: currentUser.id,
        officeId: currentUser.officeId,
        categoryId,
        priority,
        assetId: assetId || undefined,
        subject,
        description
      });
      
      Toast.fire({
        icon: 'success',
        title: 'Ticket submitted successfully'
      });
      
      onBack(); // Return to list after submit
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <button onClick={onBack} className="flex items-center space-x-2 text-ink-muted hover:text-ink transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Back to Tickets</span>
      </button>

      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-bg">
          <h2 className="text-lg font-bold text-ink">Submit New ICT Ticket</h2>
          <p className="text-xs text-ink-muted mt-1 font-medium">Please describe your technical issue.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">Category *</label>
              <select 
                required
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full p-2.5 bg-bg border border-border rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-accent"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">Priority *</label>
              <select 
                required
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full p-2.5 bg-bg border border-border rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">Affected Asset (Optional)</label>
            <select 
              value={assetId}
              onChange={e => setAssetId(e.target.value)}
              className="w-full p-2.5 bg-bg border border-border rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">-- Select an Asset --</option>
              {officeAssets.map(a => (
                <option key={a.id} value={a.id}>{a.equipmentType} ({a.propertyNumber})</option>
              ))}
            </select>
            <p className="text-[10px] text-ink-muted mt-1.5 font-medium">Select the specific equipment if applicable.</p>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">Subject *</label>
            <input 
              required
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Brief description of the problem"
              className="w-full p-2.5 bg-bg border border-border rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-1.5">Detailed Description *</label>
            <textarea 
              required
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Please provide as much detail as possible..."
              className="w-full p-2.5 bg-bg border border-border rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onBack}
              className="px-5 py-2 bg-surface text-ink-muted text-xs font-bold border border-border rounded-lg shadow-sm hover:bg-bg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-accent text-white text-xs font-bold rounded-lg shadow-lg shadow-accent/20 hover:bg-accent/90 transition-colors"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
