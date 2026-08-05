import React from 'react';
import { useAppContext } from '../store/AppContext';
import { LayoutDashboard, Ticket, MonitorSmartphone, LogOut, Menu, UserCircle, Building2, BarChart3, Sun, Moon, Users } from 'lucide-react';

export function Layout({ children, currentTab, setCurrentTab }: { children: React.ReactNode, currentTab: string, setCurrentTab: (tab: string) => void }) {
  const { currentUser, users, login, logout, theme, toggleTheme } = useAppContext();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'Admin';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, disabled: false },
    { id: 'tickets', label: 'Tickets', icon: Ticket, disabled: false },
    { id: 'assets', label: 'Assets', icon: MonitorSmartphone, disabled: false },
    ...(isAdmin ? [
      { id: 'users', label: 'Users', icon: Users, disabled: false },
      { id: 'departments', label: 'Departments', icon: Building2, disabled: false },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, disabled: false },
    ] : [])
  ];

  return (
    <div className="h-screen bg-bg text-ink flex">
      {/* COMPACT SIDEBAR */}
      <aside className="w-[80px] bg-bg border-r border-border flex flex-col items-center py-6">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-black text-white mb-8">
          M
        </div>
        <nav className="flex flex-col gap-6">
          {navItems.map(item => (
            <div
              key={item.id}
              title={item.label}
              onClick={() => !item.disabled && setCurrentTab(item.id)}
              className={`p-2.5 rounded-lg cursor-pointer transition-colors ${
                currentTab === item.id 
                  ? 'text-accent bg-accent/10' 
                  : item.disabled ? 'text-ink-muted/50 cursor-not-allowed' : 'text-ink-muted hover:text-accent hover:bg-accent/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
            </div>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-6 items-center">
          <div className="w-8 h-8 rounded-full bg-border border border-accent flex items-center justify-center text-[10px] font-bold text-ink">
            {currentUser.name.substring(0, 2).toUpperCase()}
          </div>
          <div 
            className="p-2.5 rounded-lg cursor-pointer text-ink-muted hover:text-accent hover:bg-accent/10 transition-colors"
            title="Sign Out"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="border-b border-border px-8 h-16 flex items-center justify-between bg-surface flex-shrink-0">
          <div className="font-mono text-xs text-ink-muted flex gap-2">
            System / {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} / <span className="text-ink font-medium">Overview</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <button 
              onClick={toggleTheme}
              className="p-2 text-ink-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              LIVE SERVER
            </div>
          </div>
        </header>
        <div className="p-8 overflow-y-auto flex-1 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent)]">
          {children}
        </div>
      </main>
    </div>
  );
}
