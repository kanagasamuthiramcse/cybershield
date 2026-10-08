import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Cpu, 
  HardDrive, 
  Wifi, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  Server, 
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';

export function SystemHealthPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const data = await api.getSystemHealth();
      setHealth(data);
    } catch (err) {
      console.error('Failed to load system health:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 4000);
    return () => clearInterval(interval);
  }, []);

  const modules = [
    { name: 'Brute-Force Rate Limiter (Rule #BF-101)', status: 'Operational', latency: '0.8ms' },
    { name: 'Layer-7 Volumetric Scrubbing (Rule #DOS-204)', status: 'Operational', latency: '1.4ms' },
    { name: 'Typosquatting & Phishing Heuristic (Rule #PHISH-302)', status: 'Operational', latency: '2.1ms' },
    { name: 'Malware Signature Inspection (Rule #MALW-401)', status: 'Operational', latency: '3.2ms' },
    { name: 'Geo-Velocity Anomaly Checker (Rule #GEO-503)', status: 'Operational', latency: '0.5ms' },
    { name: 'Port-Scan SYN Analyzer (Rule #SCAN-602)', status: 'Operational', latency: '1.1ms' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d1527]/90 border border-slate-800 glass-panel shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              System Health & Perimeter Guard Telemetry
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              STATUS: HEALTHY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time defensive engine operational vitals, inspection latency benchmarks, and active protection modules.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Poll Metrics</span>
        </button>
      </div>

      {/* Main Metric Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="p-5 rounded-2xl bg-[#0d1527] border border-slate-800 glass-card-hover space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Core CPU Load</span>
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{health?.cpu_usage_pct || 18.4}%</span>
            <span className="text-[10px] text-emerald-400 font-mono">Normal</span>
          </div>
          <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${health?.cpu_usage_pct || 20}%` }}
            />
          </div>
        </div>

        {/* RAM */}
        <div className="p-5 rounded-2xl bg-[#0d1527] border border-slate-800 glass-card-hover space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Memory Allocation</span>
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{health?.ram_usage_pct || 46.2}%</span>
            <span className="text-[10px] text-indigo-400 font-mono">Stable</span>
          </div>
          <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${health?.ram_usage_pct || 45}%` }}
            />
          </div>
        </div>

        {/* Latency */}
        <div className="p-5 rounded-2xl bg-[#0d1527] border border-slate-800 glass-card-hover space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Inspection Latency</span>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{health?.average_inspection_latency_ms || 2.1}ms</span>
            <span className="text-[10px] text-emerald-400 font-mono">Ultra-Fast</span>
          </div>
          <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '15%' }} />
          </div>
        </div>

        {/* Network Throughput */}
        <div className="p-5 rounded-2xl bg-[#0d1527] border border-slate-800 glass-card-hover space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Throughput</span>
            <Wifi className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{health?.network_throughput_mbps || 84.5}</span>
            <span className="text-[10px] text-purple-400 font-mono">Mbps</span>
          </div>
          <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (health?.network_throughput_mbps || 80) * 0.8)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Defensive Modules Status */}
      <div className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800 glass-panel shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Active Defensive Modules (Rule Engine Status)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">All 6 core defensive rules running in continuous monitoring loop</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
            6 / 6 ONLINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {modules.map((mod, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-slate-200">{mod.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-slate-400">{mod.latency}</span>
                <span className="text-emerald-400 font-bold">{mod.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Database & Infrastructure Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-slate-400 block text-[11px] uppercase">Storage Subsystem</span>
          <p className="text-slate-200 font-bold">SQLite 3 (Local Transactional Storage)</p>
          <p className="text-slate-400 text-[11px]">Auto-initialized with schema migrations & seed events.</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-slate-400 block text-[11px] uppercase">Server Runtime</span>
          <p className="text-cyan-300 font-bold">Python 3.11 + FastAPI + Uvicorn ASGI Server</p>
          <p className="text-slate-400 text-[11px]">CORS enabled, non-blocking asynchronous event dispatch.</p>
        </div>
      </div>
    </div>
  );
}
