import React from 'react';
import { useAppContext } from '../store/AppContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function AdminAnalytics() {
  const { tickets, categories } = useAppContext();

  // Status breakdown
  const statusCounts = tickets.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const statusColors: Record<string, string> = {
    'NEW': '#f87171',
    'ASSIGNED': '#60a5fa',
    'IN PROGRESS': '#fbbf24',
    'PENDING': '#a1a1aa',
    'RESOLVED': '#4ade80',
    'CLOSED': '#ffffff',
  };

  // Category breakdown
  const categoryCounts = tickets.reduce((acc, t) => {
    const catName = categories.find(c => c.id === t.categoryId)?.name || 'Unknown';
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));

  const customTooltipStyle = {
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '8px',
    color: '#fafafa',
    fontSize: '12px',
    fontFamily: 'monospace'
  };

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-start mb-10">
        <div>
          <h1 className="font-black text-[2.5rem] tracking-[-0.05em] mb-2 text-ink">Analytics</h1>
          <p className="text-ink-muted text-[0.9rem]">Overview of ICT support ticket metrics</p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
          <div className="text-[0.9rem] font-semibold flex items-center gap-2 mb-6 text-ink">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            Tickets by Status
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.name] || '#a1a1aa'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} itemStyle={{ color: '#fafafa' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
          <div className="text-[0.9rem] font-semibold flex items-center gap-2 mb-6 text-ink">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Tickets by Category
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={customTooltipStyle} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
