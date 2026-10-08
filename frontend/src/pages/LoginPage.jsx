import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertTriangle, KeyRound, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@cybershield.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      localStorage.setItem('cs_token', res.access_token);
      localStorage.setItem('cs_user', JSON.stringify(res.user));
      onLoginSuccess(res.user);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid authentication credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@cybershield.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#070b14] relative overflow-hidden">
      {/* Background ambient security grid and radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-2xl shadow-cyan-500/30">
            <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              CyberShield SOC Gateway
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-Time Cyber Threat Detection & Defensive Operations
            </p>
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <div className="leading-relaxed">
            <span className="font-bold">DEMO AUTHENTICATION:</span> Validated via backend cryptographic hashes. Passwords never stored plaintext.
          </div>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1527]/90 border border-slate-800/90 glass-panel shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-mono mb-1.5 font-medium">
                SOC Operator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cybershield.com"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-mono mb-1.5 font-medium">
                Authorization Token / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate SOC Operator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill button */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-cyan-400 text-xs font-mono font-medium transition flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Auto-Fill Demo Credentials (admin@cybershield.com / admin123)</span>
            </button>
          </div>
        </div>

        {/* Footer assurances */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SHA-256 PBKDF2
          </span>
          <span>•</span>
          <span>FastAPI Backend Active</span>
          <span>•</span>
          <span>SQLite Database</span>
        </div>
      </div>
    </div>
  );
}
