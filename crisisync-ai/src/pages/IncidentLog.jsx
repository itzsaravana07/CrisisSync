import { useCrisis } from '../context/CrisisContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { Download, FileText } from 'lucide-react';

export function IncidentLog() {
  const { incidents } = useCrisis();

  const handleExport = () => {
    const csv = [
      ['ID', 'Type', 'Location', 'Severity', 'Status', 'Time', 'Guests Affected'].join(','),
      ...incidents.map(i => [i.id, i.type, `"${i.location}"`, i.severity_level, i.status, i.timestamp, i.guest_count_affected].join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'incident_log.csv'; a.click();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-crisis-bg p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-crisis-cyan" />
            <h1 className="font-display font-bold text-white text-lg tracking-widest">INCIDENT LOG</h1>
            <span className="text-crisis-muted font-mono text-xs">— {incidents.length} total records</span>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded border border-crisis-cyan/40 bg-crisis-cyan/10 text-crisis-cyan text-xs font-mono hover:bg-crisis-cyan/20 transition-all"
          >
            <Download size={13} />
            EXPORT CSV
          </button>
        </div>

        <div className="bg-crisis-surface border border-crisis-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-crisis-border">
                {['ID', 'TYPE', 'LOCATION', 'SEVERITY', 'STATUS', 'TIME', 'GUESTS', 'EVAC %'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-mono font-semibold text-crisis-muted tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc, i) => (
                <tr
                  key={inc.id}
                  className={`border-b border-crisis-border/50 hover:bg-crisis-card/50 transition-colors ${inc.severity_level === 'Critical' && inc.status !== 'Resolved' ? 'bg-red-950/10' : ''}`}
                >
                  <td className="px-4 py-3 text-crisis-cyan text-xs font-mono">{inc.id}</td>
                  <td className="px-4 py-3 text-crisis-text text-xs font-medium">{inc.type}</td>
                  <td className="px-4 py-3 text-crisis-text text-xs max-w-[160px] truncate">{inc.location}</td>
                  <td className="px-4 py-3"><StatusBadge status={inc.severity_level} /></td>
                  <td className="px-4 py-3"><StatusBadge status={inc.status} /></td>
                  <td className="px-4 py-3 text-crisis-muted text-[10px] font-mono">{formatDistanceToNow(new Date(inc.timestamp), { addSuffix: true })}</td>
                  <td className="px-4 py-3 text-crisis-text text-xs font-mono text-center">{inc.guest_count_affected}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-crisis-bg rounded-full border border-crisis-border overflow-hidden" style={{ width: 50 }}>
                        <div
                          className={`h-full rounded-full ${inc.evacuation_progress === 100 ? 'bg-crisis-green' : 'bg-crisis-orange'}`}
                          style={{ width: `${inc.evacuation_progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-crisis-muted">{inc.evacuation_progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
