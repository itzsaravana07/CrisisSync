import { motion, AnimatePresence } from 'framer-motion';
import { useCrisis } from '../../context/CrisisContext';
import { X, PhoneCall, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const SERVICES = [
  { id: '100', label: 'Police', icon: '🚔', number: '100' },
  { id: '101', label: 'Fire Brigade', icon: '🚒', number: '101' },
  { id: '108', label: 'Ambulance / EMRI', icon: '🚑', number: '108' },
  { id: '1091', label: 'Women Helpline', icon: '🛡️', number: '1091' },
  { id: '1070', label: 'Disaster Mgmt', icon: '⛑️', number: '1070' },
];

export function EscalateModal() {
  const { showEscalate, setShowEscalate, activeIncident, pushNotification } = useCrisis();
  const [calling, setCalling]   = useState(null);
  const [called, setCalled]     = useState([]);

  const handleCall = (service) => {
    setCalling(service.id);
    setTimeout(() => {
      setCalling(null);
      setCalled(prev => [...prev, service.id]);
      pushNotification(`📞 ${service.label} (${service.number}) notified`, 'success');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {showEscalate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={e => e.target === e.currentTarget && setShowEscalate(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-crisis-surface border border-crisis-red/50 rounded-xl w-full max-w-md shadow-[0_0_60px_rgba(255,26,26,0.2)]"
          >
            <div className="flex items-center justify-between p-5 border-b border-crisis-border">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-crisis-red animate-pulse" />
                <div>
                  <h2 className="font-display font-bold text-sm text-white">ESCALATE TO EMERGENCY SERVICES</h2>
                  {activeIncident && (
                    <p className="text-crisis-red text-[10px] font-mono">{activeIncident.id} — {activeIncident.type}</p>
                  )}
                </div>
              </div>
              <button onClick={() => setShowEscalate(false)} className="text-crisis-muted hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-crisis-muted text-xs mb-4 font-mono">
                All calls are recorded and logged automatically. Location and incident details will be transmitted.
              </p>
              <div className="space-y-2">
                {SERVICES.map(service => (
                  <button
                    key={service.id}
                    onClick={() => !called.includes(service.id) && handleCall(service)}
                    disabled={called.includes(service.id)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg border transition-all
                      ${called.includes(service.id)
                        ? 'border-crisis-green/50 bg-green-950/30 text-crisis-green cursor-default'
                        : calling === service.id
                        ? 'border-crisis-yellow/50 bg-yellow-950/30 text-crisis-yellow cursor-wait'
                        : 'border-crisis-border hover:border-crisis-red/50 hover:bg-red-950/20 text-crisis-text'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{service.icon}</span>
                      <div className="text-left">
                        <p className="font-semibold text-sm">{service.label}</p>
                        <p className="font-mono text-[11px] opacity-70">National: {service.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {called.includes(service.id) ? (
                        <span className="text-xs font-mono text-crisis-green">NOTIFIED ✓</span>
                      ) : calling === service.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <PhoneCall size={14} className="text-crisis-red" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
