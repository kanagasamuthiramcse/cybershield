import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  Flame, 
  Cpu, 
  Globe2, 
  FileText, 
  HeartPulse, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export function Sidebar({ currentTab, setCurrentTab, onLogout, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'threats', label: 'Live Threat Feed', icon: Radio, badge: 'LIVE' },
    { id: 'simulator', label: 'Safe Attack Simulator', icon: Flame, badge: 'DEMO' },
    { id: 'analysis', label: 'Defensive AI Scanner', icon: Cpu, badge: 'RULE' },
    { id: 'ips', label: 'IP Perimeter Monitor', icon: Globe2, badge: null },
    { id: 'logs', label: 'Security Audit Logs', icon: FileText, badge: null },
    { id: 'health', label: 'System Health & Guard', icon: HeartPulse, badge: '99%' },
    { id: 'settings', label: 'Security Settings', icon: Settings, badge: null },
  ];

  const handleSelect = (id) => {
    setCurrentTab(id);
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64
        bg-[#0a0f1d]/95 backdrop-blur-xl border-r border-slate-800/80
        flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          <div className="px-3 pt-1">
            <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
              Operational Modules
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group
                    ${isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-950/40' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60 hover:bg-slate-800/40 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      item.badge === 'LIVE' ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/30' :
                      item.badge === 'DEMO' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      item.badge === 'RULE' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom card with quick defense metric and logout */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-gradient-to-b from-slate-900/80 to-slate-950 border border-slate-800/90 text-xs">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="font-semibold flex items-center gap-1.5 text-cyan-300">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                Defensive Engine
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">ACTIVE</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Real-time heuristic evaluation running on local SQLite database.
            </p>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End SOC Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
