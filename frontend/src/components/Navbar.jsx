import React from 'react';
import { Shield, ShieldCheck, Bell, Activity, UserCheck, PlayCircle, Menu } from 'lucide-react';

export function Navbar({ user, onOpenSimulator, onToggleAlerts, alertCount, onToggleMobileSidebar, systemStatus }) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#0a0f1d]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-700/60 transition"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0a0f1d] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-lg bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                CyberShield
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                SOC v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">Real-Time Threat Detection & Defense</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Protection status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono tracking-wide">{systemStatus || 'Shield Active: Level 4 Defense'}</span>
        </div>

        {/* Quick Launch Simulator button */}
        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/25 transition active:scale-95"
        >
          <PlayCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Launch Attack Simulator</span>
          <span className="sm:hidden">Simulate</span>
        </button>

        {/* Notifications toggle */}
        <button
          onClick={onToggleAlerts}
          className="relative p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white hover:border-cyan-500/40 transition"
          title="Security Alerts"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </button>

        {/* User Identity pill */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
            CISO
          </div>
          <div className="text-left leading-none">
            <p className="text-xs font-semibold text-slate-200">{user?.name || 'SOC Administrator'}</p>
            <p className="text-[10px] text-cyan-400/80 font-mono mt-0.5">Admin Clearance</p>
          </div>
        </div>
      </div>
    </header>
  );
}
