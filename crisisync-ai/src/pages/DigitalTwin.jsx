import { useCrisis } from '../context/CrisisContext';
import { PROPERTY_ZONES, EVAC_ROUTES } from '../data/mapData';
import { Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '../components/ui/StatusBadge';

export function DigitalTwin() {
  const { incidents, staff } = useCrisis();
  const [scale, setScale] = useState(1);
  const [selectedFloor, setSelectedFloor] = useState('all');

  const floors = ['all', '12', '5', '2', '1', 'B1', 'P2'];
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');

  return (
    <div className="flex-1 overflow-y-auto bg-crisis-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Layers size={20} className="text-crisis-cyan" />
            <h1 className="font-display font-bold text-white text-lg tracking-widest">DIGITAL TWIN — LIVE PROPERTY VIEW</h1>
          </div>
          <div className="flex items-center gap-2">
            {floors.map(f => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold transition-all
                  ${selectedFloor === f ? 'bg-crisis-cyan/20 text-crisis-cyan border border-crisis-cyan/40' : 'text-crisis-muted hover:text-crisis-text'}`}
              >
                {f === 'all' ? 'ALL' : `L${f}`}
              </button>
            ))}
            <div className="flex gap-1 ml-2">
              <button onClick={() => setScale(s => Math.min(2, s + 0.2))} className="p-1.5 rounded bg-crisis-card border border-crisis-border text-crisis-muted hover:text-crisis-text transition-colors"><ZoomIn size={13} /></button>
              <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="p-1.5 rounded bg-crisis-card border border-crisis-border text-crisis-muted hover:text-crisis-text transition-colors"><ZoomOut size={13} /></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Map */}
          <div className="col-span-2">
            <div className="bg-crisis-surface border border-crisis-border rounded-xl p-4">
              <div
                className="relative overflow-hidden rounded-lg bg-crisis-bg border border-crisis-border"
                style={{ height: 480, transition: 'transform 0.3s', transform: `scale(${scale})`, transformOrigin: 'top left' }}
              >
                {/* Grid */}
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)', backgroundSize: '5% 5%' }} />

                {/* Zones */}
                {PROPERTY_ZONES.map(zone => (
                  <div
                    key={zone.id}
                    className="absolute rounded border border-crisis-border/70 flex items-center justify-center transition-all hover:brightness-125 cursor-pointer"
                    style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%`, background: zone.color }}
                  >
                    <span className="text-[8px] font-mono text-crisis-muted text-center leading-tight px-1">{zone.label}</span>
                  </div>
                ))}

                {/* Evac Routes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#00FF88" />
                    </marker>
                    <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill="#FF1A1A" />
                    </marker>
                  </defs>
                  {EVAC_ROUTES.map((route, i) => (
                    <line
                      key={i}
                      x1={`${route.from.x}%`} y1={`${route.from.y}%`}
                      x2={`${route.to.x}%`}   y2={`${route.to.y}%`}
                      stroke={route.active ? '#00FF88' : '#FF1A1A'}
                      strokeWidth="2"
                      strokeDasharray={route.active ? 'none' : '4,4'}
                      markerEnd={route.active ? 'url(#arrowGreen)' : 'url(#arrowRed)'}
                      opacity="0.9"
                    />
                  ))}
                </svg>

                {/* Incident Markers */}
                {activeIncidents.map(inc => (
                  <div
                    key={inc.id}
                    className="absolute"
                    style={{ left: `${inc.coordinates.x}%`, top: `${inc.coordinates.y}%`, transform: 'translate(-50%,-50%)' }}
                    title={`${inc.type} — ${inc.location}`}
                  >
                    <div className={`relative w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs
                      ${inc.severity_level === 'Critical' ? 'bg-crisis-red animate-pulse-red' : 'bg-crisis-orange'}`}>
                      <span>!</span>
                      <div className="absolute inset-0 rounded-full bg-current opacity-30 animate-ping" />
                    </div>
                  </div>
                ))}

                {/* Staff positions */}
                {staff.filter(s => s.responding).map((member, i) => {
                  const zone = PROPERTY_ZONES.find(z => z.id.includes(member.zone.split('-')[0]));
                  if (!zone) return null;
                  return (
                    <div
                      key={member.id}
                      className="absolute w-5 h-5 rounded-full bg-crisis-cyan/30 border border-crisis-cyan flex items-center justify-center text-[8px] font-bold text-crisis-cyan"
                      style={{ left: `${zone.x + 5 + i * 3}%`, top: `${zone.y + 3}%`, transform: 'translate(-50%,-50%)' }}
                      title={member.name}
                    >
                      {member.avatar}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Stats */}
          <div className="space-y-3">
            <div className="bg-crisis-surface border border-crisis-border rounded-xl p-4">
              <h3 className="font-display text-[11px] tracking-widest text-crisis-text font-semibold mb-3">INCIDENT OVERLAY</h3>
              <div className="space-y-2">
                {activeIncidents.map(inc => (
                  <div key={inc.id} className={`p-2 rounded border ${inc.severity_level === 'Critical' ? 'border-crisis-red/50 bg-red-950/20' : 'border-crisis-border bg-crisis-card'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-crisis-text font-medium">{inc.type}</span>
                      <StatusBadge status={inc.severity_level} />
                    </div>
                    <p className="text-[9px] font-mono text-crisis-muted mt-0.5">{inc.location}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-crisis-surface border border-crisis-border rounded-xl p-4">
              <h3 className="font-display text-[11px] tracking-widest text-crisis-text font-semibold mb-3">STAFF POSITIONS</h3>
              <div className="space-y-2">
                {staff.map(m => (
                  <div key={m.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold
                        ${m.responding ? 'bg-crisis-red/20 text-crisis-red border border-crisis-red/40' : 'bg-crisis-cyan/10 text-crisis-cyan border border-crisis-cyan/30'}`}>
                        {m.avatar}
                      </div>
                      <div>
                        <p className="text-crisis-text text-[10px] font-medium">{m.name}</p>
                        <p className="text-crisis-muted text-[8px] font-mono">{m.zone}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono ${m.responding ? 'text-crisis-red' : 'text-crisis-green'}`}>
                      {m.responding ? '● RESP' : '● ON'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
