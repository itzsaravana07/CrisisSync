import { useCrisis } from '../context/CrisisContext';
import { Sidebar }      from '../components/layout/Sidebar';
import { RightPanel }   from '../components/layout/RightPanel';
import { IncidentCard } from '../components/dashboard/IncidentCard';
import { BroadcastModal } from '../components/modals/BroadcastModal';
import { EscalateModal }  from '../components/modals/EscalateModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const FILTERS = ['All', 'Critical', 'High', 'Active', 'Resolved'];

export function Dashboard() {
  const { incidents, notifications, alarmActive } = useCrisis();
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('time');

  const filtered = incidents
    .filter(i => {
      if (filter === 'All')      return true;
      if (filter === 'Active')   return i.status === 'Active' || i.status === 'New';
      if (filter === 'Resolved') return i.status === 'Resolved';
      return i.severity_level === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'time')     return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === 'severity') {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return (order[a.severity_level] ?? 9) - (order[b.severity_level] ?? 9);
      }
      return 0;
    });

  return (
    <div className={`flex flex-1 overflow-hidden ${alarmActive ? 'animate-flicker' : ''}`}>
      <Sidebar />

      {/* Main Feed */}
      <main className="flex-1 overflow-y-auto bg-crisis-bg bg-grid-pattern bg-grid relative">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-crisis-bg/90 backdrop-blur border-b border-crisis-border px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-crisis-cyan" />
            <div className="flex gap-1">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`
                    px-2.5 py-1 rounded text-[10px] font-mono font-semibold tracking-widest transition-all
                    ${filter === f
                      ? 'bg-crisis-cyan/20 text-crisis-cyan border border-crisis-cyan/40'
                      : 'text-crisis-muted hover:text-crisis-text'
                    }
                  `}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-crisis-card border border-crisis-border rounded px-2 py-1 text-crisis-muted text-[10px] font-mono focus:outline-none"
            >
              <option value="time">Sort: Latest</option>
              <option value="severity">Sort: Severity</option>
            </select>
            <div className="flex items-center gap-1.5 text-crisis-green text-[10px] font-mono">
              <RefreshCw size={10} className="animate-spin" />
              LIVE
            </div>
          </div>
        </div>

        {/* Incident Cards */}
        <div className="p-4 space-y-3 max-w-3xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map(incident => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-crisis-muted font-mono text-sm">No incidents match this filter</p>
            </div>
          )}
        </div>
      </main>

      <RightPanel />

      {/* Notifications Toast */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50 w-80">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className={`
                p-3 rounded-lg border backdrop-blur text-sm font-mono
                ${n.type === 'critical' ? 'bg-red-950/90 border-crisis-red text-crisis-red' :
                  n.type === 'success'  ? 'bg-green-950/90 border-crisis-green text-crisis-green' :
                  n.type === 'warning'  ? 'bg-orange-950/90 border-crisis-orange text-crisis-orange' :
                  'bg-crisis-surface/90 border-crisis-border text-crisis-text'}
              `}
            >
              {n.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Alarm Flash Overlay */}
      <AnimatePresence>
        {alarmActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: 5 }}
            className="fixed inset-0 bg-crisis-red pointer-events-none z-40"
          />
        )}
      </AnimatePresence>

      <BroadcastModal />
      <EscalateModal />
    </div>
  );
}
