import { useCrisis } from '../../context/CrisisContext';
import { PROPERTY_ZONES, EVAC_ROUTES } from '../../data/mapData';
import { Map, Navigation } from 'lucide-react';

export function PropertyMap() {
  const { incidents } = useCrisis();
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');

  return (
    <div className="p-3 border-b border-crisis-border">
      <div className="flex items-center gap-2 mb-3">
        <Map size={13} className="text-crisis-cyan" />
        <span className="font-display text-[11px] tracking-widest text-crisis-text font-semibold">PROPERTY MAP</span>
        <span className="text-crisis-muted text-[9px] font-mono ml-auto">GRAND HYATT BENGALURU</span>
      </div>

      <div className="relative bg-crisis-bg border border-crisis-border rounded overflow-hidden" style={{ height: 200, backgroundImage: 'linear-gradient(rgba(0,245,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.02) 1px, transparent 1px)', backgroundSize: '10% 10%' }}>

        {/* Floors Label */}
        <div className="absolute left-1 top-1 flex flex-col gap-0.5">
          {['L12','L5','L2','L1','B1','P2'].map(f => (
            <span key={f} className="text-crisis-muted text-[8px] font-mono">{f}</span>
          ))}
        </div>

        {/* Zones */}
        {PROPERTY_ZONES.map(zone => (
          <div
            key={zone.id}
            className="absolute rounded border border-crisis-border/50 flex items-center justify-center"
            style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%`, background: zone.color }}
          >
            <span className="text-[7px] font-mono text-crisis-muted text-center leading-tight px-0.5">{zone.label}</span>
          </div>
        ))}

        {/* Evacuation Routes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {EVAC_ROUTES.map((route, i) => (
            <line
              key={i}
              x1={`${route.from.x}%`} y1={`${route.from.y}%`}
              x2={`${route.to.x}%`}   y2={`${route.to.y}%`}
              stroke={route.active ? '#00FF88' : '#FF1A1A'}
              strokeWidth="1.5"
              strokeDasharray={route.active ? 'none' : '3,3'}
              opacity="0.8"
            />
          ))}
        </svg>

        {/* Incident Dots */}
        {activeIncidents.map(inc => (
          <div
            key={inc.id}
            className="absolute"
            style={{ left: `${inc.coordinates.x}%`, top: `${inc.coordinates.y}%`, transform: 'translate(-50%,-50%)' }}
            title={`${inc.type} — ${inc.location}`}
          >
            <div className={`
              w-4 h-4 rounded-full border-2 flex items-center justify-center
              ${inc.severity_level === 'Critical' ? 'bg-crisis-red border-white' : 'bg-crisis-orange border-white'}
            `}>
              <div className="map-dot-critical absolute w-4 h-4 rounded-full bg-crisis-red/50" />
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-1 right-1 flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-crisis-red" />
            <span className="text-[7px] font-mono text-crisis-muted">INCIDENT</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 border-t-2 border-crisis-green" />
            <span className="text-[7px] font-mono text-crisis-muted">EVAC</span>
          </div>
        </div>
      </div>

      {/* Navigation hint */}
      <div className="mt-2 flex items-center gap-1 text-[9px] font-mono text-crisis-cyan">
        <Navigation size={9} />
        <span>Dynamic routes updating — 2 active evac paths</span>
      </div>
    </div>
  );
}
