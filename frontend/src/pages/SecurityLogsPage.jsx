import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Trash2, 
  RefreshCw, 
  Check, 
  Clock, 
  ShieldCheck,
  Terminal,
  AlertTriangle
} from 'lucide-react';
import { ThreatBadge } from '../components/ThreatBadge';
import { api } from '../services/api';

export function SecurityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [notice, setNotice] = useState(null);

  const fetchLogs = async () => {
    try {
      const data = await api.getSecurityLogs({
        search,
        severity: severityFilter,
        limit: 100
      });
      setLogs(data.items || []);
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, severityFilter]);

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to purge and archive current security audit logs?')) return;
    try {
      await api.clearLogs();
      setNotice('Security audit logs successfully purged and re-initialized.');
      fetchLogs();
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      console.error('Failed to clear logs:', err);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cybershield_audit_logs_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setNotice('Audit logs exported successfully (JSON format).');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d1527]/90 border border-slate-800 glass-panel shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Security Audit & Forensic Logs
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
              {logs.length} Entries
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable system audit trail logging firewall rule executions, TLS negotiations, and threat mitigations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Logs</span>
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold border border-red-500/30 transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-[#0d1527]/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search logs by keyword, IP, action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          {['all', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg capitalize transition ${
                severityFilter === sev
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="p-5 rounded-2xl bg-[#0d1527] border border-slate-800 glass-panel shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
              <th className="pb-3 w-16">Log ID</th>
              <th className="pb-3 w-40">Event Type</th>
              <th className="pb-3 w-28">Severity</th>
              <th className="pb-3 w-36">Origin IP</th>
              <th className="pb-3">Telemetry Log Message</th>
              <th className="pb-3 w-44 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  Loading security audit logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  No security logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3 text-slate-400">
                    #{log.id}
                  </td>
                  <td className="py-3 font-semibold text-slate-200">
                    {log.event_type}
                  </td>
                  <td className="py-3">
                    <ThreatBadge severity={log.severity} showScore={false} size="sm" />
                  </td>
                  <td className="py-3 text-cyan-300">
                    {log.source_ip}
                  </td>
                  <td className="py-3 text-slate-300 font-sans text-xs leading-relaxed max-w-xl">
                    {log.message}
                  </td>
                  <td className="py-3 text-right text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
