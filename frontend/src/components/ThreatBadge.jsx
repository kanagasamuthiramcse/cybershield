import React from 'react';

export function ThreatBadge({ severity, score, showScore = true, size = 'md' }) {
  const getColors = () => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-red-500/15',
          text: 'text-red-400',
          border: 'border-red-500/30',
          dot: 'bg-red-500 shadow-red-500/50'
        };
      case 'high':
        return {
          bg: 'bg-orange-500/15',
          text: 'text-orange-400',
          border: 'border-orange-500/30',
          dot: 'bg-orange-500 shadow-orange-500/50'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/15',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          dot: 'bg-amber-500 shadow-amber-500/50'
        };
      default: // Low
        return {
          bg: 'bg-cyan-500/15',
          text: 'text-cyan-400',
          border: 'border-cyan-500/30',
          dot: 'bg-cyan-400 shadow-cyan-400/50'
        };
    }
  };

  const c = getColors();
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm font-semibold' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${c.bg} ${c.text} ${c.border} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shadow-sm animate-pulse`} />
      <span>{severity || 'Low'}</span>
      {showScore && score !== undefined && score !== null && (
        <span className="font-mono opacity-80 pl-1 border-l border-current/20">
          {score}/100
        </span>
      )}
    </span>
  );
}
