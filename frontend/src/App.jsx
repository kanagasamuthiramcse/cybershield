import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { NoticeBanner } from './components/NoticeBanner';
import { AlertDrawer } from './components/AlertDrawer';
import { DashboardPage } from './pages/DashboardPage';
import { ThreatFeedPage } from './pages/ThreatFeedPage';
import { AttackSimulatorPage } from './pages/AttackSimulatorPage';
import { ThreatAnalysisPage } from './pages/ThreatAnalysisPage';
import { IPMonitoringPage } from './pages/IPMonitoringPage';
import { SecurityLogsPage } from './pages/SecurityLogsPage';
import { SystemHealthPage } from './pages/SystemHealthPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { api } from './services/api';

export function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [toast, setToast] = useState(null);

  // Check initial authentication
  useEffect(() => {
    const token = localStorage.getItem('cs_token');
    const savedUser = localStorage.getItem('cs_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser({ name: 'SOC Administrator', email: 'admin@cybershield.com' });
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
    setUser(null);
  };

  // Called when simulation generates an attack event
  const handleSimulationComplete = (threatEvent) => {
    setAlerts(prev => [threatEvent, ...prev]);
    setToast({
      title: `Simulated ${threatEvent.type} Intercepted`,
      severity: threatEvent.severity,
      score: threatEvent.threat_score,
      reason: threatEvent.detection_reason
    });
    setTimeout(() => setToast(null), 6000);
  };

  const handleCustomThreatDetected = (threatEvent) => {
    setAlerts(prev => [threatEvent, ...prev]);
    setToast({
      title: `Heuristic Scanner: ${threatEvent.type}`,
      severity: threatEvent.severity,
      score: threatEvent.threat_score,
      reason: threatEvent.detection_reason
    });
    setTimeout(() => setToast(null), 6000);
  };

  // If user is not logged in, render the login page
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Mandatory Demo Simulation Notice Banner */}
      <NoticeBanner />

      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenSimulator={() => setCurrentTab('simulator')}
        onToggleAlerts={() => setAlertsOpen(!alertsOpen)}
        alertCount={alerts.length}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      <div className="flex-1 flex">
        {/* Responsive Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onLogout={handleLogout}
          isOpen={mobileSidebarOpen}
          setIsOpen={setMobileSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {/* Active Toast Notification */}
          {toast && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl flex items-center justify-between gap-4 animate-bounce">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold text-sm text-white">{toast.title}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                    Score: {toast.score}/100 ({toast.severity})
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-1">{toast.reason}</p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {currentTab === 'dashboard' && (
            <DashboardPage
              onNavigate={(tab) => setCurrentTab(tab)}
              onTriggerSimulation={handleSimulationComplete}
            />
          )}

          {currentTab === 'threats' && (
            <ThreatFeedPage />
          )}

          {currentTab === 'simulator' && (
            <AttackSimulatorPage
              onSimulationComplete={handleSimulationComplete}
            />
          )}

          {currentTab === 'analysis' && (
            <ThreatAnalysisPage
              onThreatDetected={handleCustomThreatDetected}
            />
          )}

          {currentTab === 'ips' && (
            <IPMonitoringPage />
          )}

          {currentTab === 'logs' && (
            <SecurityLogsPage />
          )}

          {currentTab === 'health' && (
            <SystemHealthPage />
          )}

          {currentTab === 'settings' && (
            <SettingsPage
              onDatabaseReset={() => setCurrentTab('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Slide-out Security Alert Drawer */}
      <AlertDrawer
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        alerts={alerts}
        onClearAlerts={() => setAlerts([])}
      />
    </div>
  );
}

export default App;
