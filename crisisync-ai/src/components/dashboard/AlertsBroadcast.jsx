import { useCrisis } from '../../context/CrisisContext';
import { Megaphone, MessageSquare, Bell, Smartphone } from 'lucide-react';

const CHANNELS = [
  { icon: Megaphone,   label: 'PA System',       active: true,  count: '12 zones' },
  { icon: Smartphone,  label: 'Guest App Push',   active: true,  count: '243 guests' },
  { icon: MessageSquare, label: 'Staff SMS',      active: true,  count: '8 staff' },
  { icon: Bell,        label: 'Emergency Services', active: false, count: 'Not sent' },
];

export function AlertsBroadcast() {
  const { setShowBroadcast, setBroadcastTarget } = useCrisis();

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <Megaphone size={13} className="text-crisis-cyan" />
        <span className="font-display text-[11px] tracking-widest text-crisis-text font-semibold">BROADCAST CHANNELS</span>
      </div>
      <div className="space-y-2">
        {CHANNELS.map(({ icon: Icon, label, active, count }) => (
          <div key={label} className={`flex items-center justify-between p-2 rounded border ${active ? 'border-crisis-green/30 bg-green-950/20' : 'border-crisis-border bg-crisis-card/30'}`}>
            <div className="flex items-center gap-2">
              <Icon size={11} className={active ? 'text-crisis-green' : 'text-crisis-muted'} />
              <span className={`text-[10px] font-medium ${active ? 'text-crisis-text' : 'text-crisis-muted'}`}>{label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-crisis-muted">{count}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-crisis-green' : 'bg-crisis-muted'}`} />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => { setBroadcastTarget(null); setShowBroadcast(true); }}
        className="mt-3 w-full py-2 rounded border border-crisis-cyan/40 bg-crisis-cyan/10 text-crisis-cyan text-xs font-bold font-mono tracking-widest hover:bg-crisis-cyan/20 transition-all"
      >
        + BROADCAST ALL CHANNELS
      </button>
    </div>
  );
}
