import React from 'react';
import { X, Bell, AlertTriangle, ShieldCheck, ExternalLink, CheckCircle } from 'lucide-react';
import { ThreatBadge } from './ThreatBadge';

export function AlertDrawer({ isOpen, onClose, alerts, onClearAlerts, onSelectThreat }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0d1527] border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0a0f1d]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">Security Notifications</h3>
                <p className="text-[11px] text-slate-400">Live defensive event triggers ({alerts.length})</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {alerts.length > 0 && (
                <button
                  onClick={onClearAlerts}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Alert List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShieldCheck className="w-12 h-12 text-emerald-500/50 mb-3" />
                <p className="font-semibold text-slate-300">All Clear — No Active Alerts</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Run a safe attack simulation to generate defensive detection triggers and alerts.
                </p>
              </div>
            ) : (
              alerts.map((alert, idx) => (
                <div
                  key={alert.id || idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 transition">
                      {alert.type || 'Threat Detection'}
                    </span>
                    <ThreatBadge severity={alert.severity} score={alert.threat_score} size="sm" />
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-2">
                    {alert.detection_reason || alert.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/60">
                    <span>IP: {alert.source_ip || 'N/A'}</span>
                    <span className="text-slate-400">
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-[#0a0f1d] border-t border-slate-800 text-center">
            <p className="text-[10px] text-amber-300/80 font-mono">
              DEMO SIMULATION — Notifications triggered via rule-based SOC engine
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
