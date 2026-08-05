import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ArrowLeft, Monitor, Search, Edit2, Plus } from 'lucide-react';
import { format } from 'date-fns';

export function AssetList({ onSelectAsset, onCreateAsset }: { onSelectAsset: (id: string) => void, onCreateAsset: () => void }) {
  const { assets, offices, currentUser } = useAppContext();
  
  const displayedAssets = currentUser?.role === 'Department User' 
    ? assets.filter(a => a.assignedTo === currentUser.name)
    : assets;

  return (
    <div>
      <section className="flex justify-between items-start mb-10">
        <div>
          <h1 className="font-black text-[2.5rem] tracking-[-0.05em] mb-2 text-ink">Equipment</h1>
          <p className="text-ink-muted text-[0.9rem]">Municipal ICT asset oversight and registry management</p>
        </div>
        {currentUser?.role !== 'Department User' && (
          <button onClick={onCreateAsset} className="flex items-center gap-2 bg-accent text-white px-[1.4rem] py-[0.8rem] rounded-lg font-semibold text-[0.85rem] shadow-[0_0_20px_rgba(99,102,241,0.4)] cursor-pointer border-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Asset
          </button>
        )}
      </section>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border flex justify-between items-center">
           <div className="text-[0.9rem] font-semibold flex items-center gap-2">
             <div className="w-2 h-2 bg-accent rounded-full"></div>
             Asset Registry
           </div>
           <div className="relative">
             <input 
               type="text" 
               placeholder="Filter by ID, Name or Office..." 
               className="bg-bg border border-border rounded-md text-ink px-4 py-2 text-[0.75rem] w-[280px] outline-none"
             />
           </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead className="bg-surface/2">
            <tr className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
              <th className="px-6 py-4 font-normal">Property ID</th>
              <th className="px-6 py-4 font-normal">Item Details</th>
              <th className="px-6 py-4 font-normal">Location</th>
              <th className="px-6 py-4 font-normal">Status</th>
              <th className="px-6 py-4 font-normal">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {displayedAssets.map(asset => {
              const office = offices.find(o => o.id === asset.officeId);
              return (
                <tr 
                  key={asset.id} 
                  onClick={() => onSelectAsset(asset.id)}
                  className="hover:bg-surface/2 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-5 border-b border-border group-last:border-none font-mono text-accent font-medium text-[0.8rem]">{asset.propertyNumber}</td>
                  <td className="px-6 py-5 border-b border-border group-last:border-none">
                    <div className="text-[0.85rem]">{asset.equipmentType}</div>
                    <div className="text-[0.75rem] text-ink-muted mt-0.5">{asset.brand} {asset.model}</div>
                  </td>
                  <td className="px-6 py-5 border-b border-border group-last:border-none text-[0.85rem]">{office?.name}</td>
                  <td className="px-6 py-5 border-b border-border group-last:border-none">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono uppercase border ${
                      asset.operationalStatus === 'Operational' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {asset.operationalStatus}
                    </span>
                  </td>
                  <td className="px-6 py-5 border-b border-border group-last:border-none text-[0.85rem]">{asset.assignedTo || 'Unassigned'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AssetDetail({ assetId, onBack, onEdit }: { assetId: string, onBack: () => void, onEdit?: () => void }) {
  const { assets, offices, tickets, currentUser } = useAppContext();
  const asset = assets.find(a => a.id === assetId);
  
  if (!asset) return null;
  const office = offices.find(o => o.id === asset.officeId);
  const relatedTickets = tickets.filter(t => t.assetId === asset.id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <button onClick={onBack} className="flex items-center space-x-2 text-ink-muted hover:text-ink transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Assets</span>
      </button>

      {/* Header */}
      <div className="bg-surface p-6 rounded-xl shadow-sm border border-border flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-bg border border-border rounded-xl flex items-center justify-center">
            <Monitor className="w-8 h-8 text-ink-muted" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">{asset.equipmentType}</h1>
            <div className="text-xs text-ink-muted mt-0.5">{asset.brand} {asset.model}</div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                {asset.propertyNumber}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                 asset.operationalStatus === 'Operational' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {asset.operationalStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        {currentUser?.role !== 'Department User' && onEdit && (
          <button onClick={onEdit} className="flex items-center space-x-2 px-3 py-1.5 border border-border text-ink-muted rounded-lg hover:bg-bg text-xs font-bold">
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Asset</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Details */}
          <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-bg">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Registry Information</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Office</div>
                <div className="font-medium text-sm text-ink mt-1">{office?.name}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Equipment Type</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.equipmentType}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Property Number</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.propertyNumber}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Inventory Number</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.inventoryNumber}</div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-bg">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Device Information</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Serial Number</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.serialNumber}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Brand</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.brand}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Model</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.model}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Hostname</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.hostname || '-'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Processor</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.processor || '-'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Memory</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.memory || '-'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Disk Storage</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.diskStorage || '-'}</div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-bg">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Software Information</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Operating System</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.operatingSystem || '-'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Microsoft Office</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.microsoftOffice || '-'}</div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-bg">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Assignment and Location</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Assigned To</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.assignedTo || 'Unassigned'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Exact Location</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.exactLocation || '-'}</div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-bg">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Condition and Status</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Condition</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.condition}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Operational Status</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.operationalStatus}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Acquisition Cost</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.acquisitionCost || '-'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Date Acquired</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.dateAcquired || '-'}</div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-bg">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Audit Information</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-y-5 gap-x-4">
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Date Audited</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.dateAudited || '-'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Audited By</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.auditedBy || '-'}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] font-bold uppercase text-ink-muted tracking-wider">Remarks</div>
                <div className="font-medium text-sm text-ink mt-1">{asset.remarks || '-'}</div>
              </div>
            </div>
          </div>

          {/* Ticket History */}
          <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-bg">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Equipment Repair History</h3>
            </div>
            <div className="divide-y divide-white/5">
              {relatedTickets.length === 0 ? (
                <div className="p-6 text-center text-ink-muted text-xs">No repair history found.</div>
              ) : (
                relatedTickets.map(ticket => (
                  <div key={ticket.id} className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-accent">{ticket.ticketNumber}</span>
                        <span className="text-[10px] text-ink-muted">• {format(new Date(ticket.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-ink-muted">
                        {ticket.status}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-ink mb-1">{ticket.subject}</div>
                    <p className="text-xs text-ink-muted">{ticket.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
           {/* Actions / Side Panel */}
           <div className="bg-bg p-5 rounded-xl border border-border shadow-sm">
             <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-4">Quick Actions</h3>
             <div className="space-y-2">
               <button className="w-full text-left px-4 py-2 bg-surface border border-border rounded-lg text-xs font-bold text-ink-muted hover:bg-bg transition-colors shadow-sm">Transfer Asset</button>
               <button className="w-full text-left px-4 py-2 bg-surface border border-border rounded-lg text-xs font-bold text-ink-muted hover:bg-bg transition-colors shadow-sm">Perform Audit</button>
               <button className="w-full text-left px-4 py-2 bg-accent border border-accent rounded-lg text-xs font-bold text-white hover:brightness-110 transition-colors shadow-sm">Create Ticket</button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
