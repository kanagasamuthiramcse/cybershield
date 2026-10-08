import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  Sliders, 
  Bell, 
  Database,
  Lock,
  Globe,
  Wifi,
  ExternalLink
} from 'lucide-react';
import { api, getBaseApiUrl } from '../services/api';

export function SettingsPage({ onDatabaseReset }) {
  const [settings, setSettings] = useState({
    auto_block_critical: 'true',
    threat_score_threshold: '75',
    rate_limit_rpm: '300',
    email_alerts_enabled: 'true',
    realtime_polling_interval: '5',
    defense_mode: 'Active Defense (Rule-based)'
  });
  const [customApiUrl, setCustomApiUrl] = useState('');
  const [activeApiUrl, setActiveApiUrl] = useState('');
  const [pingStatus, setPingStatus] = useState(null);
  const [pingLoading, setPingLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    setActiveApiUrl(getBaseApiUrl());
    const saved = localStorage.getItem('cs_api_url') || '';
    setCustomApiUrl(saved);

    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(settings);
      setSaveSuccess('Security settings updated successfully.');
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveApiUrl = (e) => {
    e.preventDefault();
    if (customApiUrl.trim()) {
      localStorage.setItem('cs_api_url', customApiUrl.trim());
    } else {
      localStorage.removeItem('cs_api_url');
    }
    setActiveApiUrl(getBaseApiUrl());
    setSaveSuccess('Backend URL preference updated. Refreshing connection...');
    handleTestPing();
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  const handleResetApiUrl = () => {
    localStorage.removeItem('cs_api_url');
    setCustomApiUrl('');
    setActiveApiUrl(getBaseApiUrl());
    setSaveSuccess('Reverted backend endpoint to environment default.');
    setPingStatus(null);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  const handleTestPing = async () => {
    setPingLoading(true);
    setPingStatus(null);
    try {
      const health = await api.getSystemHealth();
      if (health && health.status) {
        setPingStatus({ ok: true, msg: `Connected successfully! Engine: ${health.protection_status}` });
      } else {
        setPingStatus({ ok: false, msg: 'Backend responded with invalid payload.' });
      }
    } catch (err) {
      setPingStatus({ ok: false, msg: `Failed to connect: ${err.message}` });
    } finally {
      setPingLoading(false);
    }
  };

  const handleResetDb = async () => {
    if (!window.confirm('Are you sure you want to re-seed the SQLite database? This will restore clean demo records.')) return;
    setResetting(true);
    try {
      await api.resetDatabase();
      setSaveSuccess('Database successfully reset to initial seed state.');
      if (onDatabaseReset) onDatabaseReset();
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to reset DB:', err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#0d1527]/90 border border-slate-800 glass-panel shadow-xl">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Security Engine Settings & Deployment Configurations
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure rule thresholds, automated firewall enforcement policies, alert channels, and backend deployment endpoints.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Backend API Deployment Target Configuration Card */}
      <div className="p-6 rounded-2xl bg-[#0d1527] border border-cyan-500/30 glass-panel shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Production Backend Connection</h3>
              <p className="text-[11px] text-slate-400">Target FastAPI URL on Render or custom cloud host</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              Active: {activeApiUrl}
            </span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <p className="text-slate-300 text-xs leading-relaxed">
            When deployed to <strong className="text-cyan-300">Vercel</strong>, this frontend connects via the <code className="text-cyan-400 bg-slate-900 px-1 py-0.5 rounded">VITE_API_URL</code> environment variable. You can also test or override your Render backend URL live below:
          </p>

          <form onSubmit={handleSaveApiUrl} className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="e.g. https://cybershield-backend.onrender.com"
              value={customApiUrl}
              onChange={(e) => setCustomApiUrl(e.target.value)}
              className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Endpoint</span>
              </button>
              <button
                type="button"
                onClick={handleTestPing}
                disabled={pingLoading}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition flex items-center gap-1.5"
              >
                <Wifi className={`w-3.5 h-3.5 ${pingLoading ? 'animate-pulse text-cyan-400' : ''}`} />
                <span>{pingLoading ? 'Testing...' : 'Test Connection'}</span>
              </button>
              {customApiUrl && (
                <button
                  type="button"
                  onClick={handleResetApiUrl}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs"
                  title="Reset to default"
                >
                  Reset
                </button>
              )}
            </div>
          </form>

          {pingStatus && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              pingStatus.ok 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}>
              {pingStatus.ok ? <Check className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />}
              <span>{pingStatus.msg}</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automated Defense Policies */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800 glass-panel space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Automated Defense Rules</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Auto block */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="font-semibold text-slate-200 block">Auto-Block Critical Threats</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Automatically add IP to firewall drop list if score exceeds threshold.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.auto_block_critical === 'true'}
                onChange={(e) => setSettings({ ...settings, auto_block_critical: e.target.checked ? 'true' : 'false' })}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            {/* Threshold slider */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex justify-between font-mono">
                <span className="font-semibold text-slate-200">Critical Threat Score Threshold</span>
                <span className="text-cyan-400 font-bold">{settings.threat_score_threshold}/100</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={parseInt(settings.threat_score_threshold) || 75}
                onChange={(e) => setSettings({ ...settings, threat_score_threshold: e.target.value })}
                className="w-full accent-cyan-500"
              />
              <span className="text-[10px] text-slate-400 block font-mono">
                Scores equal to or above this value trigger Critical severity handling.
              </span>
            </div>

            {/* Rate limit */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <label className="font-semibold text-slate-200 block">
                Rate Limit Threshold (Requests per Minute)
              </label>
              <input
                type="number"
                value={settings.rate_limit_rpm}
                onChange={(e) => setSettings({ ...settings, rate_limit_rpm: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 block font-mono">
                Requests exceeding this RPM trigger automated rate-limiting playbooks.
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry & Notifications */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800 glass-panel space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm text-white">Alert Notifications & Polling</h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* Email alerts */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="font-semibold text-slate-200 block">Dispatch SOC Alerts</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Route real-time alerts to the in-app notification drawer and webhook queue.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.email_alerts_enabled === 'true'}
                onChange={(e) => setSettings({ ...settings, email_alerts_enabled: e.target.checked ? 'true' : 'false' })}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            {/* Polling interval */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <label className="font-semibold text-slate-200 block">
                Dashboard Live Polling Frequency
              </label>
              <select
                value={settings.realtime_polling_interval}
                onChange={(e) => setSettings({ ...settings, realtime_polling_interval: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="3">Every 3 seconds (High Frequency)</option>
                <option value="5">Every 5 seconds (Recommended Default)</option>
                <option value="10">Every 10 seconds (Eco Polling)</option>
              </select>
            </div>

            {/* Reset Database */}
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-red-300 block">Re-Seed Demo Database</span>
                  <span className="text-slate-400 text-[11px] block mt-0.5">
                    Clear custom events and reload initial realistic sample dataset.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetDb}
                  disabled={resetting}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
                  <span>Reset DB</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
