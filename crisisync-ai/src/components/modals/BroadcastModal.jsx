import { motion, AnimatePresence } from 'framer-motion';
import { useCrisis } from '../../context/CrisisContext';
import { X, Radio, Send, Volume2, Smartphone, MessageSquare, Mail } from 'lucide-react';
import { useState } from 'react';

const CHANNELS = [
  { id: 'pa',    icon: Volume2,        label: 'PA System',        desc: 'All hotel floors' },
  { id: 'push',  icon: Smartphone,     label: 'Guest App Push',   desc: '243 active guests' },
  { id: 'sms',   icon: MessageSquare,  label: 'Staff SMS',        desc: '8 on-duty staff' },
  { id: 'email', icon: Mail,           label: 'Management Email', desc: 'GM & Department Heads' },
];

export function BroadcastModal() {
  const { showBroadcast, setShowBroadcast, broadcastTarget, pushNotification } = useCrisis();
  const [selected, setSelected]   = useState(['pa', 'push', 'sms']);
  const [message, setMessage]     = useState(broadcastTarget
    ? `EMERGENCY ALERT — ${broadcastTarget.type} detected at ${broadcastTarget.location}. Please follow staff instructions and proceed to nearest exit. This is NOT a drill.`
    : '');
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);

  const toggle = (id) => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const handleSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1800));
    setSending(false);
    setSent(true);
    pushNotification(`📣 Broadcast sent via ${selected.join(', ')} — ${selected.length} channels`, 'success');
    setTimeout(() => { setSent(false); setShowBroadcast(false); }, 2000);
  };

  return (
    <AnimatePresence>
      {showBroadcast && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={e => e.target === e.currentTarget && setShowBroadcast(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-crisis-surface border border-crisis-border rounded-xl w-full max-w-lg shadow-[0_0_60px_rgba(0,245,255,0.1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-crisis-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-crisis-red/20 border border-crisis-red/40 flex items-center justify-center">
                  <Radio size={20} className="text-crisis-red" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm text-white">EMERGENCY BROADCAST</h2>
                  <p className="text-crisis-muted text-[10px] font-mono">
                    {broadcastTarget ? `For: ${broadcastTarget.id}` : 'General broadcast — all zones'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowBroadcast(false)} className="text-crisis-muted hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Message */}
              <div>
                <label className="text-crisis-muted text-[10px] font-mono tracking-widest block mb-2">MESSAGE CONTENT</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-crisis-bg border border-crisis-border rounded-lg p-3 text-crisis-text text-sm font-mono resize-none focus:outline-none focus:border-crisis-cyan/60"
                />
              </div>

              {/* Channels */}
              <div>
                <label className="text-crisis-muted text-[10px] font-mono tracking-widest block mb-2">BROADCAST CHANNELS</label>
                <div className="grid grid-cols-2 gap-2">
                  {CHANNELS.map(({ id, icon: Icon, label, desc }) => (
                    <button
                      key={id}
                      onClick={() => toggle(id)}
                      className={`
                        p-3 rounded-lg border text-left transition-all
                        ${selected.includes(id)
                          ? 'bg-crisis-cyan/10 border-crisis-cyan/50 text-crisis-text'
                          : 'bg-crisis-card border-crisis-border text-crisis-muted hover:border-crisis-muted'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={13} className={selected.includes(id) ? 'text-crisis-cyan' : 'text-crisis-muted'} />
                        <span className="text-xs font-semibold">{label}</span>
                      </div>
                      <p className="text-[9px] font-mono">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={sending || sent || !message || selected.length === 0}
                className={`
                  w-full py-3 rounded-lg font-bold text-sm font-display tracking-widest
                  flex items-center justify-center gap-2 transition-all
                  ${sent ? 'bg-crisis-green text-black'
                    : sending ? 'bg-crisis-orange/50 text-crisis-orange cursor-wait'
                    : 'bg-crisis-red text-white hover:bg-red-600 shadow-[0_0_20px_rgba(255,26,26,0.4)] hover:shadow-[0_0_30px_rgba(255,26,26,0.6)]'
                  }
                `}
              >
                {sent ? '✓ BROADCAST SENT' : sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    TRANSMITTING…
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    SEND BROADCAST NOW
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
