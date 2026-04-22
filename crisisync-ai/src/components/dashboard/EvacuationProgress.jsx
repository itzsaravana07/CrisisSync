import { useCrisis } from '../../context/CrisisContext';
import { ShieldAlert } from 'lucide-react';

export function EvacuationProgress() {
  const { incidents } = useCrisis();
  const active = incidents.filter(i => i.status !== 'Resolved' && i.evacuation_progress > 0);

  return (
    <div className="p-3 border-b border-crisis-border">
      <div className="flex items-center gap-2 mb-3">
        <ShieldAlert size={13} className="text-crisis-orange" />
        <span className="font-display text-[11px] tracking-widest text-crisis-text font-semibold">EVACUATION STATUS</span>
      </div>
      <div className="space-y-3">
        {active.map(inc => (
          <div key={inc.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-crisis-text text-[10px] font-mono truncate flex-1">{inc.type} — {inc.location.split('—')[0]}</span>
              <span className={`text-[10px] font-mono font-bold ml-2 ${inc.evacuation_progress === 100 ? 'text-crisis-green' : 'text-crisis-orange'}`}>
                {inc.evacuation_progress}%
              </span>
            </div>
            <div className="h-1.5 bg-crisis-bg rounded-full overflow-hidden border border-crisis-border">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  inc.evacuation_progress === 100 ? 'bg-crisis-green' :
                  inc.evacuation_progress > 60 ? 'bg-crisis-yellow' : 'bg-crisis-orange'
                }`}
                style={{ width: `${inc.evacuation_progress}%` }}
              />
            </div>
          </div>
        ))}
        {active.length === 0 && (
          <p className="text-crisis-muted text-[10px] font-mono text-center py-2">No active evacuations</p>
        )}
      </div>
    </div>
  );
}
