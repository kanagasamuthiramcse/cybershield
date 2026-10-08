import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  Slash, 
  Check, 
  Info, 
  ExternalLink,
  X,
  AlertTriangle,
  Terminal,
  ShieldBan
} from 'lucide-react';
import { ThreatBadge } from '../components/ThreatBadge';
import { api } from '../services/api';

export function ThreatFeedPage() {
  const [threats, setThreats] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchThreats = async () => {
    try {
      const data = await api.getThreats({
        search,
        severity: severityFilter,
        status: statusFilter,
        limit: 50
      });
      setThreats(data.items || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Failed to load threats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
    const interval = setInterval(fetchThreats, 5000);
    return () => clearInterval(interval);
  }, [search, severityFilter, statusFilter]);

  const handleAction = async (threatId, action) => {
    setActionLoading(threatId);
    try {
      const res = await api.takeThreatAction(threatId, action);
      setActionSuccess(res.message);
      // Refresh list
      fetchThreats();
      if (selectedThreat && selectedThreat.id === threatId) {
        setSelectedThreat(prev => ({ ...prev, status: res.new_status }));
      }
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to execute threat action:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d1527]/90 border border-slate-800 glass-panel shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Live Threat Feed & Event Monitor
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
              {totalCount} Total Events
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time defensive feed capturing simulated attacks, heuristic detections, and automated firewall blocks.
          </p>
        </div>

        <button
          onClick={fetchThreats}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sync Feed</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0d1527]/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by IP, endpoint, threat type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Severity filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
            {['all', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  severityFilter === sev
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
            {['all', 'Active', 'Blocked', 'Mitigated'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Threats List */}
      <div className="space-y-3">
        {loading && threats.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs">
            Loading real-time threat feed...
          </div>
        ) : threats.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0d1527]/50 border border-slate-800 text-slate-400">
            <ShieldCheck className="w-10 h-10 text-emerald-400/50 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">No threat events matching filter</p>
            <p className="text-xs text-slate-400 mt-1">Adjust search parameters or launch an attack simulation.</p>
          </div>
        ) : (
          threats.map((threat) => (
            <div
              key={threat.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0d1527]/85 border border-slate-800/80 hover:border-cyan-500/40 transition glass-card-hover group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition">
                    {threat.type}
                  </h3>
                  <ThreatBadge severity={threat.severity} score={threat.threat_score} />
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                    threat.status === 'Blocked' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    threat.status === 'Mitigated' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {threat.status}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID #{threat.id}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {threat.detection_reason}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                  <span>Source IP: <span className="text-cyan-300">{threat.source_ip}</span></span>
                  <span>Endpoint: <span className="text-indigo-300">{threat.target_endpoint}</span></span>
                  <span>Timestamp: <span className="text-slate-400">{new Date(threat.timestamp).toLocaleString()}</span></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <button
                  onClick={() => setSelectedThreat(threat)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Details</span>
                </button>

                {threat.status !== 'Blocked' && (
                  <button
                    onClick={() => handleAction(threat.id, 'block_ip')}
                    disabled={actionLoading === threat.id}
                    className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <ShieldBan className="w-3.5 h-3.5 text-red-400" />
                    <span>Block IP</span>
                  </button>
                )}

                {threat.status === 'Active' && (
                  <button
                    onClick={() => handleAction(threat.id, 'mitigate')}
                    disabled={actionLoading === threat.id}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mitigate</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Threat Detail Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0d1527] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedThreat(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedThreat.type}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <ThreatBadge severity={selectedThreat.severity} score={selectedThreat.threat_score} />
                  <span className="text-xs font-mono text-slate-400">Status: {selectedThreat.status}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  Detection Reason (Defensive Rule Hit)
                </span>
                <p className="text-slate-200 leading-relaxed font-sans">{selectedThreat.detection_reason}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                  Recommended Defensive Playbook Action
                </span>
                <p className="text-emerald-200 leading-relaxed font-sans">{selectedThreat.recommended_action}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">SOURCE IP</span>
                  <span className="text-cyan-300 font-bold">{selectedThreat.source_ip}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">TARGET ENDPOINT</span>
                  <span className="text-indigo-300 font-bold">{selectedThreat.target_endpoint}</span>
                </div>
              </div>

              {selectedThreat.details && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Telemetry Artifact</span>
                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                    {typeof selectedThreat.details === 'string'
                      ? JSON.stringify(JSON.parse(selectedThreat.details), null, 2)
                      : JSON.stringify(selectedThreat.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-[10px] text-amber-300 font-mono">
                DEMO SIMULATION — Defensive Rule-Based Detection
              </span>
              <button
                onClick={() => setSelectedThreat(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
