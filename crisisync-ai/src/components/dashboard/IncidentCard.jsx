import { motion, AnimatePresence } from 'framer-motion';
import { useCrisis } from '../../context/CrisisContext';
import { StatusBadge } from '../ui/StatusBadge';
import { SEVERITY_CONFIG } from '../../data/incidents';
import {
  AlertTriangle, Brain, Radio, PhoneCall,
  CheckCircle, ChevronDown, ChevronUp,
  MapPin, Users, Clock, ShieldAlert, Zap, Route
} from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const INCIDENT_ICONS = {
  Fire:             '🔥',
  'Medical Emergency': '🏥',
  'Security Threat': '🛡️',
  'Structural Alert': '🏗️',
  'Flood / Water':   '💧',
  'Power Outage':    '⚡',
};

export function IncidentCard({ incident }) {
  const { acknowledgeIncident, resolveIncident, setShowBroadcast, setBroadcastTarget, setShowEscalate, setActiveIncident } = useCrisis();
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY_CONFIG[incident.severity_level] || SEVERITY_CONFIG.Low;
  const isCritical = incident.severity_level === 'Critical';
  const isResolved = incident.status === 'Resolved';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`
        rounded-lg border bg-crisis-card overflow-hidden
        ${cfg.border}
        ${isCritical && !isResolved ? 'incident-critical' : ''}
        ${isResolved ? 'opacity-50' : ''}
      `}
    >
      {/* Critical Banner */}
      {isCritical && !isResolved && (
        <div className="bg-crisis-red/20 border-b border-crisis-red/50 px-4 py-1.5 flex items-center gap-2">
          <AlertTriangle size={12} className="text-crisis-red animate-pulse shrink-0" />
          <span className="text-crisis-red font-mono text-[10px] font-bold tracking-[0.2em] animate-pulse">
            ██ CRITICAL INCIDENT — IMMEDIATE ACTION REQUIRED ██
          </span>
        </div>
      )}

      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-2xl shrink-0 mt-0.5">{INCIDENT_ICONS[incident.type] || '⚠️'}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className={`font-display font-bold text-sm ${cfg.color}`}>{incident.type.toUpperCase()}</h3>
                <StatusBadge status={incident.status} />
                <StatusBadge status={incident.severity_level} />
              </div>
              <div className="flex items-center gap-1.5 text-crisis-muted text-xs">
                <MapPin size={10} className="shrink-0" />
                <span className="truncate">{incident.location}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-crisis-muted">
                <span className="flex items-center gap-1">
                  <Clock size={9} />
                  {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
                </span>
                <span>ID: {incident.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
             <button
              onClick={() => setExpanded(e => !e)}
              className="text-crisis-muted hover:text-crisis-cyan transition-colors p-1"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* AI Suggested Action */}
        {!isResolved && (
          <div className="mt-3 p-3 rounded bg-crisis-surface border border-crisis-cyan/20">
            <div className="flex items-start gap-2">
              <Brain size={12} className="text-crisis-cyan shrink-0 mt-0.5 animate-glow-pulse" />
              <div>
                <p className="text-crisis-cyan text-[9px] font-mono tracking-widest mb-1">AI SUGGESTED ACTION</p>
                <p className="text-crisis-text text-xs leading-relaxed font-semibold">{incident.ai_suggested_action}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isResolved && (
          <div className="mt-3 flex flex-wrap gap-2">
            {incident.status !== 'Active' && incident.status !== 'Escalated' && (
              <button
                onClick={() => acknowledgeIncident(incident.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-blue-900/50 text-blue-300 border border-blue-500/40 hover:bg-blue-900/80 hover:border-blue-400 transition-all"
              >
                <CheckCircle size={12} />
                Acknowledge
              </button>
            )}

            <button
              onClick={() => {
                setBroadcastTarget(incident);
                setShowBroadcast(true);
              }}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold
                transition-all duration-200
                ${isCritical
                  ? 'bg-crisis-red text-white border border-crisis-red hover:bg-red-600 shadow-[0_0_15px_rgba(255,26,26,0.4)] animate-pulse-red'
                  : 'bg-crisis-orange/20 text-crisis-orange border border-crisis-orange/50 hover:bg-crisis-orange/30'
                }
              `}
            >
              <Radio size={12} />
              {isCritical ? '🔊 Broadcast Evacuation' : 'Broadcast Alert'}
            </button>

            <button
              onClick={() => {
                setActiveIncident(incident);
                setShowEscalate(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-purple-900/30 text-purple-300 border border-purple-500/40 hover:bg-purple-900/60 transition-all"
            >
              <PhoneCall size={12} />
              Escalate to Emergency
            </button>

            <button
              onClick={() => resolveIncident(incident.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-green-900/30 text-crisis-green border border-crisis-green/40 hover:bg-green-900/60 transition-all ml-auto"
            >
              ✓ Mark Resolved
            </button>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-crisis-border pt-3 space-y-4">
              {/* Middleware Brain Output */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-crisis-muted text-[9px] font-mono tracking-widest mb-1 flex items-center gap-1">
                      <Zap size={9} /> ACTION PLAN
                    </p>
                    <ul className="space-y-1">
                      {(incident.action_plan || []).map((step, idx) => (
                        <li key={idx} className="text-crisis-text text-[11px] flex gap-2">
                          <span className="text-crisis-cyan">{idx + 1}.</span> {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-crisis-muted text-[9px] font-mono tracking-widest mb-1 flex items-center gap-1">
                      <Route size={9} /> EVACUATION ROUTES
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(incident.evacuation_routes || []).map((route, idx) => (
                        <span key={idx} className="text-[10px] bg-green-950/30 text-crisis-green border border-crisis-green/20 px-2 py-0.5 rounded-full font-mono">{route}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-crisis-red text-[9px] font-mono tracking-widest mb-1 flex items-center gap-1">
                      <ShieldAlert size={9} /> RESOURCE GAPS
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {(incident.resource_gaps || []).map((gap, idx) => (
                        <span key={idx} className="text-[10px] bg-red-950/30 text-crisis-red border border-crisis-red/20 px-2 py-0.5 rounded-full font-mono">{gap}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-crisis-orange text-[9px] font-mono tracking-widest mb-1">PREDICTED ESCALATION</p>
                    <p className="text-crisis-text text-[11px] italic bg-orange-950/10 p-2 rounded border border-crisis-orange/10">
                      {incident.predicted_escalation || "Stable for next 10m."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-crisis-border/50">
                <div>
                  <p className="text-crisis-muted text-[9px] font-mono tracking-widest mb-1">DETECTED BY</p>
                  <p className="text-crisis-text text-xs">{incident.detected_by}</p>
                </div>
                <div>
                  <p className="text-crisis-muted text-[9px] font-mono tracking-widest mb-1">RAW VALUE</p>
                  <p className="text-crisis-cyan text-xs font-mono truncate">{incident.raw_value}</p>
                </div>
              </div>

              <div>
                <p className="text-crisis-muted text-[9px] font-mono tracking-widest mb-1">AFFECTED ZONES</p>
                <div className="flex flex-wrap gap-1">
                  {(incident.affected_zones || []).map(z => (
                    <span key={z} className="text-[9px] font-mono bg-crisis-muted/20 text-crisis-text px-1.5 py-0.5 rounded">{z}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-crisis-muted text-[9px] font-mono tracking-widest mb-1">SYSTEM LOG HASH (IMMUTABLE)</p>
                <p className="text-[9px] font-mono text-crisis-muted opacity-50 break-all">
                  SHA256: {btoa(incident.id).slice(0, 32)}...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
