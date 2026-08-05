import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Ticket, Search, Filter, Plus, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export function TicketsList({ onSelectTicket, onCreateTicket }: { onSelectTicket: (id: string) => void, onCreateTicket: () => void }) {
  const { tickets, currentUser, users, categories } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  let filteredTickets = tickets;

  // Role-based filtering
  if (currentUser?.role === 'Department User') {
    filteredTickets = filteredTickets.filter(t => t.officeId === currentUser.officeId);
  } else if (currentUser?.role === 'ICT Support') {
    filteredTickets = filteredTickets.filter(t => t.assignedToId === currentUser.id);
  }

  // Status filtering
  if (filterStatus !== 'ALL') {
    filteredTickets = filteredTickets.filter(t => t.status === filterStatus);
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'NEW': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'ASSIGNED': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'IN PROGRESS': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'PENDING': return 'bg-surface/5 text-ink-muted border border-white/10';
      case 'RESOLVED': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'CLOSED': return 'bg-black text-ink-muted border border-white/5';
      default: return 'bg-surface/5 text-ink-muted border border-white/10';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'text-red-400 bg-red-500/10 border border-red-500/20';
      case 'High': return 'text-orange-400 bg-orange-500/10 border border-orange-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
      case 'Low': return 'text-ink-muted bg-surface/5 border border-white/10';
      default: return 'text-ink-muted bg-surface/5 border border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h2 className="font-bold text-sm text-ink flex items-center gap-2">
             <div className="w-2 h-2 bg-accent rounded-full"></div>
             Support Tickets
           </h2>
           <div className="flex items-center gap-3">
             <div className="flex items-center space-x-2 bg-bg px-3 py-1.5 rounded-lg border border-border">
               <Filter className="w-3.5 h-3.5 text-ink-muted" />
               <select 
                 className="bg-transparent text-xs font-bold text-ink outline-none cursor-pointer"
                 value={filterStatus}
                 onChange={(e) => setFilterStatus(e.target.value)}
               >
                 <option value="ALL">ALL STATUS</option>
                 <option value="NEW">NEW</option>
                 <option value="ASSIGNED">ASSIGNED</option>
                 <option value="IN PROGRESS">IN PROGRESS</option>
                 <option value="PENDING">PENDING</option>
                 <option value="RESOLVED">RESOLVED</option>
                 <option value="CLOSED">CLOSED</option>
               </select>
             </div>
             {currentUser?.role === 'Department User' && (
                <button
                  onClick={onCreateTicket}
                  className="bg-accent text-white text-xs px-4 py-2 rounded-lg font-bold flex items-center space-x-1 border border-accent hover:brightness-110"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Ticket</span>
                </button>
             )}
           </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-surface/5 border-b border-border">
            <tr className="text-[10px] text-ink-muted uppercase font-bold font-mono">
              <th className="px-4 py-3">Ticket ID & Subject</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Details</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-muted">
                  No tickets found.
                </td>
              </tr>
            ) : (
              filteredTickets.map(ticket => {
                const requester = users.find(u => u.id === ticket.requesterId);
                const category = categories.find(c => c.id === ticket.categoryId);
                
                return (
                  <tr 
                    key={ticket.id} 
                    onClick={() => onSelectTicket(ticket.id)}
                    className="border-b border-white/5 hover:bg-surface/5 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-accent font-mono">{ticket.ticketNumber}</div>
                      <div className="text-ink truncate max-w-xs">{ticket.subject}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-ink-muted">
                      <div>Req: <span className="text-ink">{requester?.name}</span></div>
                      <div>{format(new Date(ticket.updatedAt), 'MMM d, h:mm a')}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="bg-surface/10 text-ink px-3 py-1 rounded text-[10px] font-bold uppercase group-hover:bg-accent group-hover:text-white transition-colors border border-white/10 group-hover:border-accent">
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
