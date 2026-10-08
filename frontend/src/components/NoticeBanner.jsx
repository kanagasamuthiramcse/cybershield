import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export function NoticeBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs flex items-center justify-between text-amber-300">
      <div className="flex items-center gap-2 mx-auto">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold tracking-wide uppercase">DEMO SIMULATION</span>
        <span className="text-amber-200/80">— No real attack is performed. All scenarios evaluate defensive rule-based heuristics safely.</span>
      </div>
    </div>
  );
}
