import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Users, 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  role: 'guest' | 'manager' | 'employee' | 'hr';
  userHash: string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  role,
  userHash,
  onLogout
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['manager', 'employee', 'hr'] },
    { id: 'reviews', label: 'Reviews', icon: FileText, roles: ['manager', 'employee', 'hr'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['manager', 'hr'] },
    { id: 'employees', label: 'Employees', icon: Users, roles: ['manager', 'hr'] },
    { id: 'profile', label: 'Profile', icon: User, roles: ['manager', 'employee', 'hr'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['manager', 'employee', 'hr'] },
  ];

  const visibleNavs = navItems.filter(item => item.roles.includes(role));

  const roleLabel = {
    manager: 'Manager Portal',
    employee: 'Employee Portal',
    hr: 'HR Administrator',
    guest: 'Guest'
  }[role];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#121829]/90 backdrop-blur-xl border-r border-white/10 select-none transition-all duration-300">
      {/* Brand Logo & Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Midnight <span className="text-indigo-400 font-mono text-xs px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">dApp</span>
              </span>
              <span className="text-xs text-gray-400 truncate">Confidential HR</span>
            </div>
          )}
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300 tracking-wide">{roleLabel}</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {visibleNavs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Hash & Logout */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {!collapsed && userHash && (
          <div className="px-3 py-2 rounded-lg bg-black/30 border border-white/5 text-xs text-gray-400">
            <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Witness Identity</span>
            <span className="font-mono-hash text-indigo-300 truncate block mt-0.5">{userHash.substring(0, 14)}...</span>
          </div>
        )}
        
        <button
          onClick={onLogout}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Desktop Permanent Sidebar */}
      <aside className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 md:hidden transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>
    </>
  );
};
