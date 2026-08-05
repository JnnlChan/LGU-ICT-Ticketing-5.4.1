import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Ticket } from '../store/mockData';

export function Dashboard() {
  const { tickets, assets, users, currentUser } = useAppContext();

  // Metrics
  const newTickets = tickets.filter(t => t.status === 'NEW').length;
  const assigned = tickets.filter(t => t.status === 'ASSIGNED').length;
  const inProgress = tickets.filter(t => t.status === 'IN PROGRESS').length;
  const pending = tickets.filter(t => t.status === 'PENDING').length;
  const resolved = tickets.filter(t => t.status === 'RESOLVED').length;
  
  const totalAssets = assets.length;
  const operational = assets.filter(a => a.operationalStatus === 'Operational').length;
  const forRepair = assets.filter(a => a.operationalStatus === 'Non-Operational' || a.operationalStatus === 'Under Maintenance').length;

  // Workload (Active tickets: Assigned + In Progress + Pending)
  const ictStaff = users.filter(u => u.role === 'ICT Support');
  const workload = ictStaff.map(staff => {
    const active = tickets.filter(t => 
      t.assignedToId === staff.id && 
      ['ASSIGNED', 'IN PROGRESS', 'PENDING'].includes(t.status)
    ).length;
    return { name: staff.name, active };
  });

  const StatCard = ({ title, value, colorClass, borderClass }: any) => (
    <div className={`bg-surface p-4 rounded-xl shadow-sm border border-border ${borderClass || ''}`}>
      <p className="font-mono text-[10px] text-ink-muted font-bold uppercase tracking-wider">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${colorClass || 'text-ink'}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 text-sm text-ink-muted font-medium">
        <span>System Dashboard</span> <span className="text-border">/</span> <span className="text-ink">Overview</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Tickets" value={tickets.length} />
        <StatCard title="New Tasks" value={newTickets} colorClass="text-accent" borderClass="border-l-4 border-l-accent" />
        <StatCard title="In Progress" value={inProgress + assigned} colorClass="text-amber-500" borderClass="border-l-4 border-l-amber-500" />
        <StatCard title="Resolved" value={resolved} colorClass="text-green-500" borderClass="border-l-4 border-l-green-500" />
        <StatCard title="Total Assets" value={totalAssets} colorClass="text-ink" borderClass="border-l-4 border-l-ink" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-sm text-ink flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                New Tickets Pending Assignment
              </h2>
            </div>
            <table className="w-full text-left">
              <thead className="bg-surface/5 border-b border-border">
                <tr className="text-[10px] text-ink-muted uppercase font-bold font-mono">
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Priority</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {tickets.filter(t => t.status === 'NEW').slice(0, 5).map(ticket => (
                  <tr key={ticket.id} className="border-b border-white/5 hover:bg-surface/5 transition-colors">
                    <td className="px-4 py-3 font-bold font-mono text-accent">{ticket.ticketNumber}</td>
                    <td className="px-4 py-3 text-ink truncate max-w-xs">{ticket.subject}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        ticket.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        ticket.priority === 'High' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                        ticket.priority === 'Medium' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-surface/10 text-ink-muted border border-white/20'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                  </tr>
                ))}
                {tickets.filter(t => t.status === 'NEW').length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-ink-muted">No new tickets.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
            {ictStaff.map(staff => {
              const active = tickets.filter(t => 
                t.assignedToId === staff.id && 
                ['ASSIGNED', 'IN PROGRESS', 'PENDING'].includes(t.status)
              ).length;
              
              let statusLabel = 'Available';
              let statusClass = 'bg-green-500/10 text-green-400 border-green-500/20';
              let cardClass = '';
              
              if (active >= 6) {
                statusLabel = 'Heavy';
                statusClass = 'bg-red-500/10 text-red-400 border-red-500/20';
                cardClass = 'ring-1 ring-red-500/50';
              } else if (active >= 3) {
                statusLabel = 'Moderate';
                statusClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
              }

              return (
                <div key={staff.id} className={`bg-surface p-4 rounded-xl border border-border shadow-sm flex flex-col h-full ${cardClass}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center font-bold text-[10px] text-ink">
                      {staff.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div className={`${statusClass} border text-[8px] font-bold px-1.5 py-0.5 rounded font-mono uppercase`}>{statusLabel}</div>
                  </div>
                  <p className="text-[10px] font-bold text-ink">{staff.name}</p>
                  <p className={`text-lg font-bold ${active >= 6 ? 'text-red-400' : 'text-ink'}`}>
                    {active} <span className="text-[10px] font-normal text-ink-muted font-mono">Active</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 bg-surface rounded-xl shadow-sm border border-border p-5 space-y-6">
          <h2 className="font-bold text-sm text-ink mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            Asset Health Summary
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-ink font-medium">Operational</span>
              </div>
              <span className="text-xs font-bold text-ink">{operational} Units</span>
            </div>
            <div className="w-full bg-border h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: `${totalAssets > 0 ? (operational / totalAssets) * 100 : 0}%` }}></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs text-ink font-medium">Needs Repair</span>
              </div>
              <span className="text-xs font-bold text-ink">{forRepair} Units</span>
            </div>
            <div className="w-full bg-border h-2 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full" style={{ width: `${totalAssets > 0 ? (forRepair / totalAssets) * 100 : 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
