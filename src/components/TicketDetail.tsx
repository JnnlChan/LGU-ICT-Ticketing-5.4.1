import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ArrowLeft, Clock, User, Monitor, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Toast, ConfirmModal } from '../lib/toast';

export function TicketDetail({ ticketId, onBack }: { ticketId: string, onBack: () => void }) {
  const { tickets, users, assets, categories, currentUser, changeTicketStatus, addComment } = useAppContext();
  const ticket = tickets.find(t => t.id === ticketId);
  
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [recommendationText, setRecommendationText] = useState(ticket.ictRecommendation || '');
  const [isEditingRecommendation, setIsEditingRecommendation] = useState(false);
  
  const { updateRecommendation } = useAppContext();

  if (!ticket) return null;

  const requester = users.find(u => u.id === ticket.requesterId);
  const assignee = users.find(u => u.id === ticket.assignedToId);
  const asset = assets.find(a => a.id === ticket.assetId);
  const category = categories.find(c => c.id === ticket.categoryId);
  const ictStaff = users.filter(u => u.role === 'ICT Support');

  const handleAssign = async () => {
    if (selectedAssignee) {
      const result = await ConfirmModal.fire({
        text: 'Are you sure you want to assign this ticket?'
      });
      if (result.isConfirmed) {
        changeTicketStatus(ticket.id, 'ASSIGNED', selectedAssignee);
        Toast.fire({
          icon: 'success',
          title: 'Ticket assigned successfully'
        });
      }
    }
  };

  const handleStatusUpdate = async (newStatus: any) => {
    const result = await ConfirmModal.fire({
      text: `Are you sure you want to change status to ${newStatus}?`
    });
    if (result.isConfirmed) {
      changeTicketStatus(ticket.id, newStatus, ticket.assignedToId);
      Toast.fire({
        icon: 'success',
        title: `Status updated to ${newStatus}`
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim()) {
      addComment(ticket.id, newCommentText.trim());
      setNewCommentText('');
      Toast.fire({
        icon: 'success',
        title: 'Comment added'
      });
    }
  };

  const handleUpdateRecommendation = () => {
    updateRecommendation(ticket.id, recommendationText.trim());
    setIsEditingRecommendation(false);
    Toast.fire({
      icon: 'success',
      title: 'Recommendation saved'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <button onClick={onBack} className="flex items-center space-x-2 text-ink-muted hover:text-ink transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Back to Tickets</span>
      </button>

      {/* Header */}
      <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
        <div className="flex items-center space-x-3 mb-3">
          <h1 className="text-xl font-bold text-ink">{ticket.ticketNumber}</h1>
          <span className="px-2 py-0.5 bg-white/5 text-ink-muted font-bold rounded text-[10px] uppercase">
            {ticket.status}
          </span>
          <span className="px-2 py-0.5 bg-red-50 text-red-600 font-bold rounded text-[10px] border border-red-100 uppercase">
            {ticket.priority} Priority
          </span>
        </div>
        <h2 className="text-sm font-bold text-ink-muted">{ticket.subject}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
           <div className="space-y-4">
              <div className="flex items-start space-x-3">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-ink-muted" />
                 </div>
                 <div>
                    <div className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Requester</div>
                    <div className="text-sm font-bold text-ink">{requester?.name}</div>
                    <div className="text-xs text-ink-muted">{requester?.email}</div>
                 </div>
              </div>
              <div className="flex items-start space-x-3">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-ink-muted" />
                 </div>
                 <div>
                    <div className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Submitted</div>
                    <div className="text-sm font-bold text-ink">{format(new Date(ticket.createdAt), 'PP')}</div>
                    <div className="text-xs text-ink-muted">{format(new Date(ticket.createdAt), 'p')}</div>
                 </div>
              </div>
           </div>

           {asset && (
             <div className="p-4 bg-bg rounded-xl border border-border flex items-start space-x-3">
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                 <Monitor className="w-4 h-4 text-accent" />
               </div>
               <div>
                 <div className="text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-1">Affected Asset</div>
                 <div className="text-sm font-bold text-ink">{asset.equipmentType} - {asset.brand} {asset.model}</div>
                 <div className="text-xs font-medium text-ink-muted mt-0.5">Property No: {asset.propertyNumber}</div>
               </div>
             </div>
           )}
        </div>

        {/* Horizontal Ticket Progress */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-6 text-center">Ticket Progress</h3>
          <div className="flex justify-between relative max-w-3xl mx-auto">
            {[
              { label: 'Submitted', color: 'bg-emerald-500', ring: 'ring-emerald-100' },
              { label: 'Received', color: 'bg-amber-400', ring: 'ring-amber-100' },
              { label: 'Assigned', color: 'bg-blue-500', ring: 'ring-blue-100' },
              { label: 'In Progress', color: 'bg-orange-500', ring: 'ring-orange-100' },
              { label: 'Testing', color: 'bg-purple-500', ring: 'ring-purple-100' },
              { label: 'Resolved', color: 'bg-emerald-500', ring: 'ring-emerald-100' },
              { label: 'Closed', color: 'bg-white/10', ring: 'ring-border' }
            ].map((step, index) => {
              const getTimelineIndex = (status: string) => {
                switch (status) {
                  case 'NEW': return 1;
                  case 'ASSIGNED': return 2;
                  case 'IN PROGRESS': return 3;
                  case 'PENDING': return 4;
                  case 'RESOLVED': return 5;
                  case 'CLOSED': return 6;
                  default: return 1;
                }
              };
              
              const currentIndex = getTimelineIndex(ticket.status);
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isLast = index === 6;

              let dotClass = 'bg-white/5';
              let textClass = 'text-ink-muted font-medium';
              let lineClass = 'bg-white/5';

              if (isCompleted) {
                dotClass = step.color;
                textClass = 'text-ink font-bold';
                lineClass = step.color;
              } else if (isCurrent) {
                dotClass = `${step.color} ring-4 ${step.ring}`;
                textClass = 'text-ink font-bold';
              }

              return (
                <div key={index} className="flex flex-col items-center relative flex-1">
                  {!isLast && (
                    <div className={`absolute left-[50%] right-[-50%] top-2.5 h-0.5 ${lineClass} opacity-30`} />
                  )}
                  <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${dotClass}`}>
                    {isCompleted && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-[10px] text-center mt-3 ${textClass} max-w-[60px] leading-tight`}>{step.label}</span>
                  {(isCompleted || isCurrent) && (() => {
                    let timestampStr = null;
                    if (index === 0) {
                      timestampStr = ticket.createdAt;
                    } else {
                      const statusMap: Record<number, string> = {
                        1: 'NEW', // Or maybe we map 'NEW' to index 0, and 'ASSIGNED' to 2. Let's see. 
                        2: 'ASSIGNED',
                        3: 'IN PROGRESS',
                        4: 'PENDING',
                        5: 'RESOLVED',
                        6: 'CLOSED'
                      };
                      const s = statusMap[index];
                      const historyItem = ticket.statusHistory?.find(h => h.status === s);
                      if (historyItem) {
                        timestampStr = historyItem.timestamp;
                      } else if (isCurrent) {
                        timestampStr = ticket.updatedAt;
                      }
                    }
                    if (timestampStr) {
                      return (
                        <span className="text-[8px] text-ink-muted mt-1 max-w-[70px] text-center leading-tight">
                          {format(new Date(timestampStr), 'MMM d, h:mm a')}
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="space-y-6">
        {/* Description */}
        <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-bg">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Problem Description</h3>
            </div>
            <div className="p-5">
              <p className="text-xs text-ink-muted whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
            </div>
          </div>

          {/* ICT Recommendation */}
          {(ticket.ictRecommendation || (currentUser?.role === 'ICT Support' && ticket.assignedToId === currentUser.id)) && (
            <div className="bg-blue-50/50 rounded-xl shadow-sm border border-blue-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-blue-100 bg-blue-50/80 flex justify-between items-center">
                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">ICT Recommendation</h3>
                {currentUser?.role === 'ICT Support' && ticket.assignedToId === currentUser.id && !isEditingRecommendation && (
                  <button 
                    onClick={() => {
                      setRecommendationText(ticket.ictRecommendation || '');
                      setIsEditingRecommendation(true);
                    }} 
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="p-5">
                {isEditingRecommendation ? (
                  <div className="space-y-3">
                    <textarea 
                      className="w-full p-3 bg-surface border border-blue-200 rounded-lg text-xs outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 min-h-[80px]"
                      placeholder="e.g. Need to change the Motherboard..."
                      value={recommendationText}
                      onChange={(e) => setRecommendationText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setIsEditingRecommendation(false)} 
                        className="px-4 py-2 bg-surface border border-border text-ink-muted rounded-lg text-xs font-bold hover:bg-bg transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpdateRecommendation}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Save Recommendation
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-blue-900 whitespace-pre-wrap leading-relaxed font-medium">
                    {ticket.ictRecommendation ? ticket.ictRecommendation : <span className="text-blue-400 italic">No recommendation added yet.</span>}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions based on Role */}
          {currentUser?.role === 'Admin' && ticket.status !== 'CLOSED' && (
            <div className="bg-accent/10/50 p-5 rounded-xl border border-accent/20 shadow-sm">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3">Assign Ticket</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <select 
                  className="flex-1 p-2 bg-surface border border-indigo-200 rounded-lg text-xs font-medium outline-none focus:border-indigo-400"
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                >
                  <option value="">Select ICT Support...</option>
                  {ictStaff.map(staff => {
                    const active = tickets.filter(t => t.assignedToId === staff.id && ['ASSIGNED', 'IN PROGRESS', 'PENDING'].includes(t.status)).length;
                    return (
                      <option key={staff.id} value={staff.id}>{staff.name} ({active} Active Tickets)</option>
                    );
                  })}
                </select>
                <button 
                  onClick={handleAssign}
                  disabled={!selectedAssignee}
                  className="px-6 py-2 bg-accent text-white text-xs font-bold rounded-lg shadow-lg shadow-accent/20 hover:bg-accent/90 disabled:opacity-50 transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>
          )}

          {currentUser?.role === 'ICT Support' && ticket.assignedToId === currentUser.id && (
            <div className="bg-surface p-5 rounded-xl shadow-sm border border-border">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider mb-4">Update Status</h3>
              <div className="flex flex-wrap gap-3">
                {ticket.status === 'ASSIGNED' && (
                  <button onClick={() => handleStatusUpdate('IN PROGRESS')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 shadow-sm">
                    Start Work (In Progress)
                  </button>
                )}
                {ticket.status === 'IN PROGRESS' && (
                  <>
                    <button onClick={() => handleStatusUpdate('PENDING')} className="px-4 py-2 bg-ink-muted/10 text-ink rounded-lg text-xs font-bold hover:bg-ink-muted/20 shadow-sm border border-border">
                      Put in Pending
                    </button>
                    <button onClick={() => handleStatusUpdate('RESOLVED')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm">
                      Mark as Resolved
                    </button>
                  </>
                )}
                {ticket.status === 'PENDING' && (
                  <button onClick={() => handleStatusUpdate('IN PROGRESS')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 shadow-sm">
                    Resume Work
                  </button>
                )}
              </div>
            </div>
          )}

          {currentUser?.role === 'Department User' && ticket.status === 'RESOLVED' && (
            <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                 <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                 <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Confirm Resolution</h3>
              </div>
              <p className="text-emerald-800 text-xs mb-5 font-medium">ICT Support has marked this ticket as resolved. Please confirm if the issue is fixed.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => handleStatusUpdate('CLOSED')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm">
                  Confirm & Close
                </button>
                <button onClick={() => handleStatusUpdate('IN PROGRESS')} className="px-4 py-2 bg-surface text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-50 shadow-sm">
                  Problem Still Exists (Reopen)
                </button>
              </div>
            </div>
          )}

          {/* Discussion */}
          <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-bg flex justify-between items-center">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Discussion</h3>
              <span className="text-[10px] font-bold bg-white/10 text-ink-muted px-2 py-0.5 rounded-full">{ticket.comments?.length || 0}</span>
            </div>
            <div className="p-5 space-y-6">
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map(comment => {
                  const commentUser = users.find(u => u.id === comment.userId);
                  const isOwn = comment.userId === currentUser?.id;
                  
                  return (
                    <div key={comment.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold ${
                        commentUser?.role === 'Admin' ? 'bg-accent' :
                        commentUser?.role === 'ICT Support' ? 'bg-amber-500' : 'bg-white/10'
                      }`}>
                        {commentUser?.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                      </div>
                      <div className={`max-w-[80%] ${isOwn ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-baseline gap-2 mb-1 justify-between">
                          <span className="text-[10px] font-bold text-ink-muted">{commentUser?.name}</span>
                          <span className="text-[8px] text-ink-muted font-medium">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        <div className={`px-4 py-2.5 rounded-xl text-xs ${
                          isOwn 
                            ? 'bg-accent text-white rounded-tr-none' 
                            : 'bg-bg border border-border text-ink-muted rounded-tl-none'
                        }`}>
                          {comment.text}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-xs text-ink-muted py-4">No comments yet. Start the discussion below.</div>
              )}
            </div>
            
            {ticket.status !== 'CLOSED' && (
              <div className="p-5 border-t border-border bg-bg/50">
                <form onSubmit={handleAddComment} className="flex gap-3">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-surface border border-border rounded-lg px-4 py-2 text-xs outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                  />
                  <button 
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="bg-accent text-white px-5 py-2 rounded-lg text-xs font-bold disabled:opacity-50 hover:bg-accent/90 transition-colors shadow-sm"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
