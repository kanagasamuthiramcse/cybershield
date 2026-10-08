import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Search, 
  ShieldBan, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  AlertTriangle,
  Eye,
  Activity,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export function IPMonitoringPage() {
  const [ips, setIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionSuccess, setActionSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [newStatus, setNewStatus] = useState('Monitoring');

  const fetchIPs = async () => {
    try {
      const data = await api.getMonitoredIPs({
        search,
        status: statusFilter
      });
      setIps(data.items || []);
    } catch (err) {
      console.error('Failed to load monitored IPs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPs();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (ipAddress, nextStatus) => {
    try {
      await api.updateIPStatus(ipAddress, nextStatus);
      setActionSuccess(`IP ${ipAddress} policy updated to '${nextStatus}'.`);
      fetchIPs();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err) {
      console.error('Failed to update IP status:', err);
    }
  };

  const handleAddIP = async (e) => {
    e.preventDefault();
    if (!newIp.trim()) return;
    try {
      await api.updateIPStatus(newIp.trim(), newStatus);
      setShowAddModal(false);
      setNewIp('');
      setActionSuccess(`New IP ${newIp} added to perimeter monitor as '${newStatus}'.`);
      fetchIPs();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err) {
      console.error('Failed to add IP:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d1527]/90 border border-slate-800 glass-panel shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Perimeter IP Monitoring Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              {ips.length} Tracked Nodes
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global network telemetry, autonomous ASN reputations, traffic frequency, and edge firewall ACL rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Monitored IP</span>
          </button>

          <button
            onClick={fetchIPs}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-[#0d1527]/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by IP, country, autonomous org..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
          {['all', 'Blocked', 'Monitoring', 'Whitelisted'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg capitalize transition ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* IPs Table */}
      <div className="p-5 rounded-2xl bg-[#0d1527] border border-slate-800 glass-panel shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
              <th className="pb-3">IP Address</th>
              <th className="pb-3">Risk Score</th>
              <th className="pb-3">Reputation</th>
              <th className="pb-3">Country / Geolocation</th>
              <th className="pb-3">ASN Organization</th>
              <th className="pb-3">Request Rate</th>
              <th className="pb-3">ACL Policy</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-400 font-mono">
                  Loading perimeter IPs...
                </td>
              </tr>
            ) : ips.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-400 font-mono">
                  No monitored IPs matching search query.
                </td>
              </tr>
            ) : (
              ips.map((ip) => (
                <tr key={ip.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 font-mono font-bold text-cyan-300">
                    {ip.ip_address}
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            ip.risk_score >= 75 ? 'bg-red-500' :
                            ip.risk_score >= 50 ? 'bg-orange-500' :
                            ip.risk_score >= 25 ? 'bg-amber-400' :
                            'bg-emerald-400'
                          }`}
                          style={{ width: `${ip.risk_score}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-300">{ip.risk_score}/100</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      ip.reputation === 'Malicious' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                      ip.reputation === 'Suspicious' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                      ip.reputation === 'Trusted' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {ip.reputation}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-300 font-medium">
                    {ip.country}
                  </td>
                  <td className="py-3.5 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                    {ip.asn_org}
                  </td>
                  <td className="py-3.5 font-mono text-slate-300">
                    {ip.requests_per_min} <span className="text-slate-400 text-[10px]">req/m</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      ip.status === 'Blocked' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      ip.status === 'Whitelisted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {ip.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-1.5">
                    {ip.status !== 'Blocked' && (
                      <button
                        onClick={() => handleUpdateStatus(ip.ip_address, 'Blocked')}
                        className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-[11px] font-semibold transition"
                      >
                        Block
                      </button>
                    )}
                    {ip.status === 'Blocked' && (
                      <button
                        onClick={() => handleUpdateStatus(ip.ip_address, 'Monitoring')}
                        className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium transition"
                      >
                        Unblock
                      </button>
                    )}
                    {ip.status !== 'Whitelisted' && (
                      <button
                        onClick={() => handleUpdateStatus(ip.ip_address, 'Whitelisted')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition"
                      >
                        Whitelist
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add IP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0d1527] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add IP Address to Perimeter Monitoring</h3>
            <form onSubmit={handleAddIP} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-mono mb-1">IP Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 198.51.100.22"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">Initial Status Policy</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Monitoring">Monitoring (Active Scrutiny)</option>
                  <option value="Blocked">Blocked (Drop at Perimeter)</option>
                  <option value="Whitelisted">Whitelisted (Trusted Bypass)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
                >
                  Save IP Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
