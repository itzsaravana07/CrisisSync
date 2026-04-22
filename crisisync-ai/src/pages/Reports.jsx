import { useCrisis } from '../context/CrisisContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileBarChart, Download } from 'lucide-react';

const COLORS = ['#FF1A1A', '#FF6B1A', '#FFD700', '#00FF88', '#00F5FF'];

export function Reports() {
  const { incidents } = useCrisis();

  const byType = Object.entries(
    incidents.reduce((acc, i) => { acc[i.type] = (acc[i.type] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const bySeverity = ['Critical', 'High', 'Medium', 'Low'].map(s => ({
    name: s,
    count: incidents.filter(i => i.severity_level === s).length,
  }));

  const responseTime = [
    { time: '00:00', incidents: 0 },
    { time: '04:00', incidents: 1 },
    { time: '08:00', incidents: 3 },
    { time: '12:00', incidents: 5 },
    { time: '16:00', incidents: 2 },
    { time: '20:00', incidents: 4 },
    { time: '23:59', incidents: 1 },
  ];

  const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-crisis-surface border border-crisis-border rounded-lg p-3 text-xs font-mono">
        <p className="text-crisis-cyan mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  };

  const stats = [
    { label: 'Total Incidents',    value: incidents.length,                                                   color: 'text-crisis-text'   },
    { label: 'Critical',           value: incidents.filter(i => i.severity_level === 'Critical').length,      color: 'text-crisis-red'    },
    { label: 'Resolved',           value: incidents.filter(i => i.status === 'Resolved').length,              color: 'text-crisis-green'  },
    { label: 'Avg Evac Progress',  value: `${Math.round(incidents.reduce((a, i) => a + i.evacuation_progress, 0) / incidents.length)}%`, color: 'text-crisis-yellow' },
    { label: 'Guests Affected',    value: incidents.reduce((a, i) => a + i.guest_count_affected, 0),          color: 'text-crisis-orange' },
    { label: 'Staff Responding',   value: 4,                                                                   color: 'text-crisis-cyan'   },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-crisis-bg p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileBarChart size={20} className="text-crisis-cyan" />
            <h1 className="font-display font-bold text-white text-lg tracking-widest">INCIDENT ANALYTICS & REPORTS</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded border border-crisis-cyan/40 bg-crisis-cyan/10 text-crisis-cyan text-xs font-mono hover:bg-crisis-cyan/20">
            <Download size={13} />
            EXPORT PDF REPORT
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-crisis-surface border border-crisis-border rounded-xl p-4 text-center">
              <p className={`text-2xl font-display font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-crisis-muted text-[9px] font-mono mt-1 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Incidents by Type */}
          <div className="bg-crisis-surface border border-crisis-border rounded-xl p-5">
            <h3 className="font-display text-[11px] tracking-widest text-crisis-text font-semibold mb-4">INCIDENTS BY TYPE</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={byType} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A2E4A" />
                <XAxis dataKey="name" tick={{ fill: '#2A3F5F', fontSize: 8, fontFamily: 'monospace' }} />
                <YAxis tick={{ fill: '#2A3F5F', fontSize: 9, fontFamily: 'monospace' }} />
                <Tooltip content={<CUSTOM_TOOLTIP />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Incidents by Severity */}
          <div className="bg-crisis-surface border border-crisis-border rounded-xl p-5">
            <h3 className="font-display text-[11px] tracking-widest text-crisis-text font-semibold mb-4">BY SEVERITY</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bySeverity} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {bySeverity.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip content={<CUSTOM_TOOLTIP />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-crisis-surface border border-crisis-border rounded-xl p-5">
          <h3 className="font-display text-[11px] tracking-widest text-crisis-text font-semibold mb-4">INCIDENT TIMELINE (TODAY)</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={responseTime} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2E4A" />
              <XAxis dataKey="time" tick={{ fill: '#2A3F5F', fontSize: 9, fontFamily: 'monospace' }} />
              <YAxis tick={{ fill: '#2A3F5F', fontSize: 9, fontFamily: 'monospace' }} />
              <Tooltip content={<CUSTOM_TOOLTIP />} />
              <Line type="monotone" dataKey="incidents" stroke="#00F5FF" strokeWidth={2} dot={{ fill: '#00F5FF', r: 4 }} activeDot={{ r: 6, fill: '#FF1A1A' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
