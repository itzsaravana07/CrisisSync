import { useCrisis } from '../../context/CrisisContext';
import { StatusBadge } from '../ui/StatusBadge';
import { PulsingDot } from '../ui/PulsingDot';
import { SENSOR_TYPE_ICONS } from '../../data/sensors';
import { Users, Cpu, BellRing, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

function SensorRow({ sensor }) {
  const isAlert = sensor.status === 'Alert' || sensor.status === 'Breach';
  return (
    <div className={`
      flex items-center justify-between py-2 px-3 rounded
      border transition-all duration-300
      ${isAlert ? 'bg-red-950/30 border-crisis-red/30' : 'bg-crisis-card/50 border-crisis-border/50'}
    `}>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm shrink-0">{SENSOR_TYPE_ICONS[sensor.type] || '📡'}</span>
        <div className="min-w-0">
          <p className={`text-[11px] font-medium truncate ${isAlert ? 'text-crisis-red' : 'text-crisis-text'}`}>
            {sensor.name}
          </p>
          <p className="text-crisis-muted text-[9px] font-mono truncate">{sensor.zone}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0 ml-2">
        <StatusBadge status={sensor.status} />
        <span className="text-crisis-muted text-[9px] font-mono">{sensor.lastPing}</span>
      </div>
    </div>
  );
}

function StaffRow({ member }) {
  const isResponding = member.responding;
  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded bg-crisis-card/50 border border-crisis-border/50">
      <div className={`
        w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
        ${isResponding ? 'bg-crisis-red/20 border border-crisis-red/50 text-crisis-red' : 'bg-crisis-cyan/10 border border-crisis-cyan/30 text-crisis-cyan'}
      `}>
        {member.avatar}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-crisis-text text-[11px] font-medium truncate">{member.name}</p>
        <p className="text-crisis-muted text-[9px] font-mono truncate">{member.zone}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {isResponding && <PulsingDot color="bg-crisis-red" size="w-1.5 h-1.5" />}
        <span className={`text-[9px] font-mono ${isResponding ? 'text-crisis-red' : 'text-crisis-green'}`}>
          {isResponding ? 'RESP' : 'ON'}
        </span>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { sensors, staff } = useCrisis();
  const [sensorOpen, setSensorOpen] = useState(true);
  const [staffOpen, setStaffOpen]   = useState(true);

  const alertSensors  = sensors.filter(s => s.status !== 'Normal' && s.status !== 'Active');
  const normalSensors = sensors.filter(s => s.status === 'Normal' || s.status === 'Active');

  return (
    <aside className="w-64 shrink-0 bg-crisis-surface border-r border-crisis-border flex flex-col overflow-y-auto">
      {/* Sensors Panel */}
      <div className="border-b border-crisis-border">
        <button
          onClick={() => setSensorOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-crisis-card/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-crisis-cyan" />
            <span className="font-display text-[11px] tracking-widest text-crisis-text font-semibold">SENSORS</span>
            <span className="bg-crisis-red text-white text-[9px] rounded px-1.5 py-0.5 font-mono font-bold">
              {alertSensors.length} ALERT
            </span>
          </div>
          {sensorOpen ? <ChevronUp size={12} className="text-crisis-muted" /> : <ChevronDown size={12} className="text-crisis-muted" />}
        </button>

        {sensorOpen && (
          <div className="px-2 pb-3 space-y-1.5">
            {alertSensors.length > 0 && (
              <>
                <p className="text-crisis-red text-[9px] font-mono px-1 py-1 tracking-widest">⚠ ALERTS</p>
                {alertSensors.map(s => <SensorRow key={s.id} sensor={s} />)}
                <p className="text-crisis-muted text-[9px] font-mono px-1 py-1 tracking-widest">NORMAL</p>
              </>
            )}
            {normalSensors.map(s => <SensorRow key={s.id} sensor={s} />)}
          </div>
        )}
      </div>

      {/* Staff Panel */}
      <div>
        <button
          onClick={() => setStaffOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-crisis-card/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Users size={14} className="text-crisis-cyan" />
            <span className="font-display text-[11px] tracking-widest text-crisis-text font-semibold">STAFF</span>
            <span className="bg-crisis-orange text-white text-[9px] rounded px-1.5 py-0.5 font-mono font-bold">
              {staff.filter(s => s.responding).length} RESP
            </span>
          </div>
          {staffOpen ? <ChevronUp size={12} className="text-crisis-muted" /> : <ChevronDown size={12} className="text-crisis-muted" />}
        </button>

        {staffOpen && (
          <div className="px-2 pb-3 space-y-1.5">
            {staff.map(m => <StaffRow key={m.id} member={m} />)}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="mt-auto border-t border-crisis-border p-3">
        <div className="flex items-center gap-2 mb-2">
          <BellRing size={12} className="text-crisis-cyan" />
          <span className="text-[10px] font-mono text-crisis-muted tracking-widest">SYSTEM LOG</span>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-crisis-green">✓ Backup generator online</p>
          <p className="text-[10px] font-mono text-crisis-yellow">⚠ Elevator B stuck at L5</p>
          <p className="text-[10px] font-mono text-crisis-muted">→ Fire dept. ETA: 4 min</p>
          <p className="text-[10px] font-mono text-crisis-muted">→ 108 ETA: 7 min</p>
        </div>
      </div>
    </aside>
  );
}
