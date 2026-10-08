import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  ShieldCheck, 
  Globe2, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  RefreshCw, 
  Zap, 
  AlertTriangle,
  PlayCircle,
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar 
} from 'recharts';
import { ThreatBadge } from '../components/ThreatBadge';
import { api } from '../services/api';

export function DashboardPage({ onNavigate, onTriggerSimulation }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setError('Unable to connect to FastAPI backend. Ensure backend is running on port 8000.');
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Periodic API polling every 6 seconds for live telemetry updates
    const interval = setInterval(() => {
      fetchStats();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-cyan-400">
        <RefreshCw className="w-10 h-10 animate-spin mb-4" />
        <p className="font-mono text-sm tracking-widest uppercase">Connecting to CyberShield SOC Engine...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Detected Threats',
      value: stats?.total_threats || 0,
      icon: ShieldAlert,
      change: '+14% vs 24h',
      color: 'from-blue-600/20 to-cyan-600/10',
      border: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/15'
    },
    {
      title: 'Critical Severity Events',
      value: stats?.critical_threats || 0,
      icon: Flame,
      change: 'Active Alert',
      color: 'from-red-600/20 to-rose-600/10',
      border: 'border-red-500/30',
      textColor: 'text-red-400',
      iconBg: 'bg-red-500/15'
    },
    {
      title: 'Blocked Simulated Attacks',
      value: stats?.blocked_attacks || 0,
      icon: ShieldCheck,
      change: '100% Mitigated',
      color: 'from-emerald-600/20 to-teal-600/10',
      border: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15'
    },
    {
      title: 'Suspicious Monitored IPs',
      value: stats?.suspicious_ips || 0,
      icon: Globe2,
      change: 'Under Scrutiny',
      color: 'from-purple-600/20 to-indigo-600/10',
      border: 'border-purple-500/30',
      textColor: 'text-purple-400',
      iconBg: 'bg-purple-500/15'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0d1629] to-slate-900/90 border border-slate-800 glass-panel shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Security Operations Center (SOC)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time defensive detection heuristics, heuristic rule matching, and network telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => onNavigate('simulator')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Simulate Attack Now</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Key KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-gradient-to-b ${card.color} border ${card.border} glass-card-hover relative overflow-hidden`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider font-mono">{card.title}</p>
                  <h3 className="text-3xl font-extrabold text-white mt-2 font-mono tracking-tight">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${card.iconBg} ${card.textColor} border border-current/20`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] pt-3 border-t border-slate-800/80">
                <span className={`font-semibold ${card.textColor}`}>{card.change}</span>
                <span className="text-slate-400 font-mono">Backend Polled</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Activity Over Time (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0d1527]/90 border border-slate-800/80 glass-panel shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Real-Time Threat Activity Timeline
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Inspected traffic vs detected threats & automated blocks</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" /> Detected
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Blocked
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.activity_timeline || []}>
                <defs>
                  <linearGradient id="threatsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0f1d',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="threats" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#threatsGrad)" />
                <Area type="monotone" dataKey="blocked" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#blockedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Pie Chart (1 col) */}
        <div className="p-5 rounded-2xl bg-[#0d1527]/90 border border-slate-800/80 glass-panel shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-purple-400" />
              Threat Severity Breakdown
            </h2>
            <p className="text-xs text-slate-400 mb-2">Severity categorization based on defensive scores</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.threat_distribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.threat_distribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0f1d',
                    borderColor: '#1e293b',
                    borderRadius: '10px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
            {(stats?.threat_distribution || []).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threat Categories and Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (1 col) */}
        <div className="p-5 rounded-2xl bg-[#0d1527]/90 border border-slate-800/80 glass-panel shadow-lg">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            Top Attack Vectors
          </h2>
          <p className="text-xs text-slate-400 mb-4">Ranked by frequency in SQLite database</p>

          <div className="space-y-3">
            {(stats?.threat_categories || []).map((cat, idx) => {
              const maxCount = Math.max(...(stats?.threat_categories || []).map(c => c.count), 1);
              const pct = Math.round((cat.count / maxCount) * 100);

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat.category}</span>
                    <span className="font-mono text-cyan-400 font-bold">{cat.count} events</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Security Events Table (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0d1527]/90 border border-slate-800/80 glass-panel shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Recent Defensive Security Interceptions
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Live events evaluated by defensive heuristic rules</p>
            </div>
            <button
              onClick={() => onNavigate('threats')}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              <span>View all in feed</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                  <th className="pb-3">Threat Type</th>
                  <th className="pb-3">Severity & Score</th>
                  <th className="pb-3">Source IP</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(stats?.recent_events || []).map((event) => (
                  <tr key={event.id} className="hover:bg-slate-850/50 transition group">
                    <td className="py-3 font-semibold text-slate-200">
                      <div className="flex flex-col">
                        <span>{event.type}</span>
                        <span className="text-[10px] text-slate-400 font-normal line-clamp-1 max-w-xs font-sans">
                          {event.detection_reason}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <ThreatBadge severity={event.severity} score={event.threat_score} size="sm" />
                    </td>
                    <td className="py-3 font-mono text-cyan-300 text-[11px]">
                      {event.source_ip}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                        event.status === 'Blocked' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        event.status === 'Mitigated' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">
                      {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
