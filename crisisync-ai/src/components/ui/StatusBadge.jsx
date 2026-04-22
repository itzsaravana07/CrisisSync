const STATUS_STYLES = {
  Active:       'bg-red-900/80 text-crisis-red border border-crisis-red/50',
  Critical:     'bg-red-900/80 text-crisis-red border border-crisis-red animate-pulse',
  New:          'bg-orange-900/80 text-crisis-orange border border-crisis-orange/50',
  Acknowledged: 'bg-blue-900/80 text-blue-300 border border-blue-500/50',
  Monitoring:   'bg-yellow-900/80 text-crisis-yellow border border-yellow-500/50',
  Escalated:    'bg-purple-900/80 text-purple-300 border border-purple-500/50',
  Resolved:     'bg-green-900/80 text-crisis-green border border-crisis-green/50',
  Normal:       'bg-green-900/50 text-crisis-green border border-crisis-green/30',
  Warning:      'bg-yellow-900/50 text-crisis-yellow border border-yellow-500/30',
  Alert:        'bg-red-900/50 text-crisis-red border border-crisis-red/50 animate-pulse',
  Breach:       'bg-red-900/80 text-crisis-red border border-crisis-red animate-pulse',
};

export function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-widest uppercase ${STATUS_STYLES[status] || STATUS_STYLES.Normal}`}>
      {status}
    </span>
  );
}
