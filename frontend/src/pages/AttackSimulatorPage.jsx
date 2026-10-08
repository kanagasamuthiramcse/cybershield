import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Radio, 
  Terminal, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Cpu, 
  Server, 
  Lock, 
  KeyRound, 
  Layers, 
  FileCode, 
  Globe, 
  Bug, 
  Radar, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ThreatBadge } from '../components/ThreatBadge';
import { api } from '../services/api';

export function AttackSimulatorPage({ onSimulationComplete }) {
  const [activeScenario, setActiveScenario] = useState('brute_force');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [error, setError] = useState(null);

  // Scenario specific customizable parameters
  const [params, setParams] = useState({
    failed_attempts: 25,
    target_user: 'admin@cybershield.com',
    request_rate: 2600,
    target_endpoint: '/api/v1/gateway',
    domain: 'portal-auth-cybershield-login.org',
    signature: 'Win32/Emotet.Downloader.Heuristic',
    country: 'Unusual ASN / VPN Exit (Romania)',
    ports: '21, 22, 23, 80, 443, 3389, 8080, 8443'
  });

  const scenarios = [
    {
      id: 'brute_force',
      name: 'Brute-Force Authentication Spike',
      icon: KeyRound,
      tag: 'Auth Layer',
      badgeColor: 'border-red-500/40 text-red-400 bg-red-500/10',
      description: 'Simulates high-velocity password spraying targeting the administrative login API with credential dictionary permutations.',
      typicalSeverity: 'Critical (Score 80–95)',
      ruleTriggered: 'Defensive Rule #BF-101 (Rate-limit threshold breach on auth attempts)'
    },
    {
      id: 'ddos',
      name: 'DDoS Volumetric HTTP Flood',
      icon: Layers,
      tag: 'Network Layer 7',
      badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
      description: 'Simulates abnormal ingress request flood exceeding maximum baseline traffic capacity across critical API gateway.',
      typicalSeverity: 'Critical (Score 90–99)',
      ruleTriggered: 'Defensive Rule #DOS-204 (Volumetric anomaly > 400% baseline)'
    },
    {
      id: 'phishing',
      name: 'Credential Phishing Domain Detection',
      icon: Globe,
      tag: 'Social Engineering',
      badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
      description: 'Simulates detection of typosquatted deceptive landing page impersonating organization single sign-on credentials.',
      typicalSeverity: 'High (Score 68–79)',
      ruleTriggered: 'Defensive Rule #PHISH-302 (Typosquatting & cloned DOM heuristics)'
    },
    {
      id: 'malware',
      name: 'Malware Payload Signature Detection',
      icon: Bug,
      tag: 'Endpoint / EDR',
      badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
      description: 'Simulates defensive detection of an infected binary hash and shellcode packing technique in uploaded asset directory.',
      typicalSeverity: 'Critical (Score 92–98)',
      ruleTriggered: 'Defensive Rule #MALW-401 (Known heuristic signature hash match)'
    },
    {
      id: 'suspicious_login',
      name: 'Suspicious Geo-Location & Impossible Travel',
      icon: Radar,
      tag: 'Identity & Access',
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      description: 'Simulates sudden authentication originating from an abnormal ASN and distant country within impossible travel velocity.',
      typicalSeverity: 'Medium (Score 35–48)',
      ruleTriggered: 'Defensive Rule #GEO-503 (Velocity speed calculation > 800 mph)'
    },
    {
      id: 'port_scan',
      name: 'Port-Scan & Perimeter Reconnaissance',
      icon: Server,
      tag: 'Perimeter Defense',
      badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      description: 'Simulates rapid sequential TCP SYN half-open connection attempts across common sensitive infrastructure ports.',
      typicalSeverity: 'High (Score 58–72)',
      ruleTriggered: 'Defensive Rule #SCAN-602 (SYN handshake omission & port sweeping)'
    }
  ];

  const handleRunSimulation = async () => {
    setSimulating(true);
    setError(null);
    try {
      const result = await api.simulateAttack(activeScenario, params);
      setSimulationResult(result);
      if (onSimulationComplete) {
        onSimulationComplete(result);
      }
    } catch (err) {
      console.error('Simulation failed:', err);
      setError('Simulation failed: ' + (err.message || 'Check FastAPI backend status.'));
    } finally {
      setSimulating(false);
    }
  };

  const selectedScenarioInfo = scenarios.find(s => s.id === activeScenario);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0d1629] to-slate-900/90 border border-slate-800 glass-panel shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Safe Defensive Attack Simulator
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                SANDBOX ENVIRONMENT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Execute controlled offensive scenarios against CyberShield's defensive detection rules engine. 
              Safely observe how defensive scoring, severity rating, and automated mitigations trigger in real time.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-mono flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>DEMO SIMULATION — No real attack is performed.</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isSelected = activeScenario === sc.id;

          return (
            <div
              key={sc.id}
              onClick={() => setActiveScenario(sc.id)}
              className={`
                p-5 rounded-2xl cursor-pointer transition-all glass-panel relative overflow-hidden flex flex-col justify-between
                ${isSelected 
                  ? 'border-cyan-500 bg-gradient-to-b from-cyan-950/40 to-slate-900/90 shadow-xl shadow-cyan-950/50 ring-1 ring-cyan-500' 
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }
              `}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${sc.badgeColor}`}>
                    {sc.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-100 mt-2">{sc.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{sc.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">{sc.typicalSeverity}</span>
                <span className={`font-semibold ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {isSelected ? 'Selected' : 'Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulator Execution Console */}
      <div className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800 glass-panel shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Custom Parameters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Scenario Configuration
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Parameters passed into defensive rule engine</p>
          </div>

          <div className="space-y-3 text-xs">
            {activeScenario === 'brute_force' && (
              <>
                <div>
                  <label className="block text-slate-300 font-mono mb-1">Target Account</label>
                  <input
                    type="text"
                    value={params.target_user}
                    onChange={(e) => setParams({ ...params, target_user: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-mono mb-1">Failed Attempts ({params.failed_attempts})</label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={params.failed_attempts}
                    onChange={(e) => setParams({ ...params, failed_attempts: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </>
            )}

            {activeScenario === 'ddos' && (
              <>
                <div>
                  <label className="block text-slate-300 font-mono mb-1">Target Endpoint</label>
                  <input
                    type="text"
                    value={params.target_endpoint}
                    onChange={(e) => setParams({ ...params, target_endpoint: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-mono mb-1">Request Rate ({params.request_rate} req/sec)</label>
                  <input
                    type="range"
                    min="800"
                    max="6000"
                    step="100"
                    value={params.request_rate}
                    onChange={(e) => setParams({ ...params, request_rate: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </>
            )}

            {activeScenario === 'phishing' && (
              <div>
                <label className="block text-slate-300 font-mono mb-1">Deceptive Domain Name</label>
                <input
                  type="text"
                  value={params.domain}
                  onChange={(e) => setParams({ ...params, domain: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            {activeScenario === 'malware' && (
              <div>
                <label className="block text-slate-300 font-mono mb-1">Signature Identifier</label>
                <input
                  type="text"
                  value={params.signature}
                  onChange={(e) => setParams({ ...params, signature: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            {activeScenario === 'suspicious_login' && (
              <div>
                <label className="block text-slate-300 font-mono mb-1">Anomalous Origin Location</label>
                <input
                  type="text"
                  value={params.country}
                  onChange={(e) => setParams({ ...params, country: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            {activeScenario === 'port_scan' && (
              <div>
                <label className="block text-slate-300 font-mono mb-1">Probed Port Range</label>
                <input
                  type="text"
                  value={params.ports}
                  onChange={(e) => setParams({ ...params, ports: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">Rule To Be Evaluated:</span>
            <span className="font-mono text-cyan-400 block">{selectedScenarioInfo?.ruleTriggered}</span>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition"
          >
            {simulating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Evaluating Heuristics...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Simulate Attack & Evaluate</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Live Defensive Output Console (2 cols) */}
        <div className="lg:col-span-2 rounded-xl bg-slate-950 border border-slate-800 p-5 font-mono flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>SOC Defensive Rules Telemetry Console</span>
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LISTENING
              </span>
            </div>

            {simulationResult ? (
              <div className="space-y-4 text-xs">
                {/* Result Top Alert */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-sm">{simulationResult.type}</span>
                    <ThreatBadge severity={simulationResult.severity} score={simulationResult.threat_score} size="lg" />
                  </div>
                  <p className="text-slate-300 font-sans leading-relaxed text-xs">
                    {simulationResult.detection_reason}
                  </p>
                </div>

                {/* Mitigation Card */}
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <CheckCircle className="w-4 h-4" />
                    Automated Defensive Action Enforced
                  </span>
                  <p className="text-emerald-200 text-xs font-sans leading-relaxed">
                    {simulationResult.recommended_action}
                  </p>
                </div>

                {/* Telemetry Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">SOURCE IP</span>
                    <span className="text-cyan-300 font-bold">{simulationResult.source_ip}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">TARGET ENDPOINT</span>
                    <span className="text-indigo-300 font-bold truncate block">{simulationResult.target_endpoint}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">STATUS IN SQLITE</span>
                    <span className="text-red-400 font-bold">{simulationResult.status} (ID #{simulationResult.id})</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400">
                  <span className="text-cyan-400 block mb-1">Status: Event appended to Live Threat Feed & SQLite Database</span>
                  <span>Notice: {simulationResult.notice}</span>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 font-sans">
                <Cpu className="w-10 h-10 text-cyan-500/40" />
                <div>
                  <p className="font-semibold text-slate-300">Simulator Standing By</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Select a scenario on the left, customize parameters if desired, and click "Simulate Attack & Evaluate".
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>CyberShield Rules Engine v1.0.0</span>
            <span className="text-amber-400">Safe Evaluation Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
