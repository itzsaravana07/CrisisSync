import { Bell, Radio, Wifi, Shield, Clock } from 'lucide-react';
import { useCrisis } from '../../context/CrisisContext';
import { SOSButton } from '../ui/SOSButton';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/dashboard',    label: 'CONTROL ROOM' },
  { to: '/incidents',    label: 'INCIDENT LOG' },
  { to: '/digital-twin', label: 'DIGITAL TWIN' },
  { to: '/voice',        label: 'VOICE AI' },
  { to: '/reports',      label: 'REPORTS' },
];

export function Header({ user }) {
  const { criticalCount, activeCount, alarmActive, notifications } = useCrisis();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className={`
      h-16 flex items-center justify-between px-4 border-b border-crisis-border
      bg-crisis-surface z-50 relative shrink-0
      ${alarmActive ? 'animate-flicker' : ''}
    `}>
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Shield size={28} className="text-crisis-cyan animate-glow-pulse" />
            {criticalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-crisis-red text-white text-[9px] flex items-center justify-center font-bold animate-pulse">
                {criticalCount}
              </span>
            )}
          </div>
          <div>
            <p className="font-display font-bold text-crisis-cyan text-sm tracking-widest leading-none glow-cyan">
              CRISISSYNC
            </p>
            <p className="text-crisis-muted text-[9px] font-mono tracking-widest">AI RESPONSE SYSTEM</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`
                px-3 py-1.5 rounded text-[10px] font-mono tracking-widest font-medium
                transition-all duration-200
                ${location.pathname === to
                  ? 'bg-crisis-cyan/10 text-crisis-cyan border border-crisis-cyan/30'
                  : 'text-crisis-text hover:text-crisis-cyan hover:bg-crisis-cyan/5'
                }
              `}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Center: Live Status */}
      <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 bg-red-950/50 border border-crisis-red/30 rounded px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-crisis-red animate-pulse" />
          <span className="text-crisis-red font-mono text-xs font-semibold">
            <AnimatedCounter value={criticalCount} /> CRITICAL
          </span>
        </div>
        <div className="flex items-center gap-2 bg-crisis-card border border-crisis-border rounded px-3 py-1.5">
          <Radio size={12} className="text-crisis-orange animate-pulse" />
          <span className="text-crisis-orange font-mono text-xs">
            <AnimatedCounter value={activeCount} /> ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-2 bg-crisis-card border border-crisis-border rounded px-3 py-1.5">
          <Wifi size={12} className="text-crisis-green" />
          <span className="text-crisis-green font-mono text-xs">LIVE</span>
        </div>
      </div>

      {/* Right: Clock + SOS + User */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="font-mono text-crisis-cyan text-sm glow-cyan">
            {time.toLocaleTimeString('en-IN', { hour12: false })}
          </span>
          <span className="font-mono text-crisis-muted text-[10px]">
            {time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        <SOSButton />

        <div className="flex items-center gap-2 bg-crisis-card border border-crisis-border rounded-lg px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-crisis-cyan/20 border border-crisis-cyan/40 flex items-center justify-center text-crisis-cyan font-bold text-xs">
            {user?.avatar || 'MG'}
          </div>
          <div className="hidden sm:block">
            <p className="text-crisis-text text-xs font-medium leading-none">{user?.name || 'Manager'}</p>
            <p className="text-crisis-muted text-[9px] font-mono">{user?.role || 'HOTEL MGR'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
