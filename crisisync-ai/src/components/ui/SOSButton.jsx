import { useCrisis } from '../../context/CrisisContext';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export function SOSButton() {
  const { triggerSOS, alarmActive } = useCrisis();
  const [held, setHeld] = useState(false);
  const [holdTimer, setHoldTimer] = useState(null);
  const [holdProgress, setHoldProgress] = useState(0);

  const handleMouseDown = () => {
    setHeld(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        triggerSOS();
        setHeld(false);
        setHoldProgress(0);
      }
    }, 100);
    setHoldTimer(interval);
  };

  const handleMouseUp = () => {
    clearInterval(holdTimer);
    setHeld(false);
    setHoldProgress(0);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {/* Outer ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#1A2E4A" strokeWidth="3" />
          {held && (
            <circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke="#FF1A1A"
              strokeWidth="3"
              strokeDasharray={`${holdProgress * 1.76} 176`}
              strokeLinecap="round"
            />
          )}
        </svg>
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className={`
            relative w-16 h-16 rounded-full border-2
            flex flex-col items-center justify-center gap-0.5
            font-display font-black text-[9px] tracking-widest
            transition-all duration-150 select-none
            ${alarmActive
              ? 'bg-crisis-red border-crisis-red text-white animate-pulse-red shadow-[0_0_30px_rgba(255,26,26,0.8)]'
              : 'bg-red-950 border-crisis-red/70 text-crisis-red hover:bg-red-900 hover:shadow-[0_0_20px_rgba(255,26,26,0.5)]'
            }
          `}
        >
          <AlertTriangle size={20} />
          <span>SOS</span>
        </button>
      </div>
      <p className="text-crisis-muted text-[9px] font-mono text-center leading-tight">
        {held ? 'HOLD…' : 'HOLD 2s'}
      </p>
    </div>
  );
}
