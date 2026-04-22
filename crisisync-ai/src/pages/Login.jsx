import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertTriangle, ChevronRight } from 'lucide-react';

const ROLES = [
  { id: 'manager',   label: 'Hotel Manager',     icon: '🏨', color: 'text-crisis-cyan',   border: 'border-crisis-cyan/40',  bg: 'bg-crisis-cyan/10'  },
  { id: 'admin',     label: 'System Admin',       icon: '⚙️', color: 'text-crisis-orange', border: 'border-crisis-orange/40', bg: 'bg-crisis-orange/10' },
  { id: 'hospital',  label: 'Hospital / Medical', icon: '🏥', color: 'text-crisis-green',  border: 'border-crisis-green/40',  bg: 'bg-crisis-green/10'  },
  { id: 'security',  label: 'Security Officer',   icon: '🛡️', color: 'text-purple-400',    border: 'border-purple-400/40',    bg: 'bg-purple-950/30'    },
  { id: 'responder', label: 'Emergency Responder',icon: '🚨', color: 'text-crisis-red',    border: 'border-crisis-red/40',    bg: 'bg-red-950/30'       },
  { id: 'staff',     label: 'Hotel Staff',        icon: '👤', color: 'text-crisis-text',   border: 'border-crisis-border',    bg: 'bg-crisis-card'      },
];

export function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('manager');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPwd, setShowPwd]           = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter credentials'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    const role = ROLES.find(r => r.id === selectedRole);
    onLogin({ name: email.split('@')[0] || 'Operator', role: role?.label || 'Staff', avatar: email.slice(0,2).toUpperCase(), roleId: selectedRole });
    navigate('/dashboard');
  };

  const selectedRoleObj = ROLES.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen hex-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated scan line */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crisis-cyan/30 to-transparent animate-scan-line" />
      </div>

      {/* Background alert */}
      <div className="absolute top-4 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-2 bg-red-950/80 border border-crisis-red/50 rounded-lg px-4 py-2 backdrop-blur">
          <AlertTriangle size={14} className="text-crisis-red animate-pulse" />
          <span className="text-crisis-red text-xs font-mono font-bold">LIVE — 3 ACTIVE INCIDENTS | GRAND HYATT BENGALURU</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-crisis-surface border border-crisis-cyan/30 mb-4 shadow-[0_0_40px_rgba(0,245,255,0.2)]"
          >
            <Shield size={40} className="text-crisis-cyan animate-glow-pulse" />
          </motion.div>
          <h1 className="font-display font-black text-2xl text-white glow-cyan tracking-widest">CRISISSYNC AI</h1>
          <p className="text-crisis-muted text-xs font-mono mt-1 tracking-widest">RAPID CRISIS RESPONSE PLATFORM v2.4</p>
          <p className="text-crisis-muted text-[10px] font-mono mt-0.5">Grand Hyatt Bengaluru | Emergency Operations</p>
        </div>

        {/* Card */}
        <div className="bg-crisis-surface border border-crisis-border rounded-2xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.5)] backdrop-blur">

          {/* Role Grid */}
          <div className="mb-5">
            <p className="text-crisis-muted text-[10px] font-mono tracking-widest mb-3">SELECT ROLE</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`
                    p-2 rounded-lg border text-center transition-all duration-200
                    ${selectedRole === role.id ? `${role.border} ${role.bg}` : 'border-crisis-border bg-crisis-card hover:border-crisis-muted'}
                  `}
                >
                  <div className="text-xl mb-1">{role.icon}</div>
                  <p className={`text-[9px] font-semibold leading-tight ${selectedRole === role.id ? role.color : 'text-crisis-muted'}`}>
                    {role.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-crisis-muted text-[10px] font-mono tracking-widest block mb-1.5">EMAIL / STAFF ID</label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="officer@grandhyatt.com"
                className="w-full bg-crisis-bg border border-crisis-border rounded-lg px-4 py-3 text-crisis-text text-sm font-mono placeholder-crisis-muted/50 focus:outline-none focus:border-crisis-cyan/60 transition-colors"
              />
            </div>

            <div>
              <label className="text-crisis-muted text-[10px] font-mono tracking-widest block mb-1.5">PASSWORD / BADGE PIN</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-crisis-bg border border-crisis-border rounded-lg px-4 py-3 pr-11 text-crisis-text text-sm font-mono placeholder-crisis-muted/50 focus:outline-none focus:border-crisis-cyan/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-crisis-muted hover:text-crisis-text"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-crisis-red text-xs font-mono flex items-center gap-1">
                <AlertTriangle size={12} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3 rounded-lg font-display font-bold text-sm tracking-widest
                flex items-center justify-center gap-2 transition-all duration-300
                ${loading
                  ? 'bg-crisis-muted/30 text-crisis-muted cursor-wait'
                  : `${selectedRoleObj?.bg || 'bg-crisis-cyan/10'} ${selectedRoleObj?.color || 'text-crisis-cyan'} ${selectedRoleObj?.border || 'border-crisis-cyan/40'} border hover:brightness-125 shadow-lg`
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING…
                </>
              ) : (
                <>
                  ACCESS CONTROL ROOM
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-crisis-border flex items-center justify-between">
            <p className="text-crisis-muted text-[10px] font-mono">🔒 256-bit AES encrypted</p>
            <p className="text-crisis-muted text-[10px] font-mono">All access logged</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
