import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, Globe } from 'lucide-react';
import { useCrisis } from '../context/CrisisContext';

const LANGUAGES = ['English', 'हिन्दी', 'ಕನ್ನಡ', 'தமிழ்', 'বাংলা', 'Español', 'Français', '日本語', 'العربية'];

const DEMO_TRANSCRIPTS = [
  { lang: 'English', text: 'There is fire in the kitchen basement!',  ai: 'FIRE DETECTED — B1 Kitchen. Severity: Critical. Alerting Fire Response Team Alpha and notifying guests on B1–L3.' },
  { lang: 'हिन्दी',   text: 'कमरे 512 में कोई बेहोश हो गया है',        ai: 'MEDICAL EMERGENCY — Room 512, L5. Severity: High. Dispatching first-aid staff and calling 108 ambulance.' },
  { lang: 'ಕನ್ನಡ',   text: 'ಪೂಲ್ ಡೆಕ್‌ನಲ್ಲಿ ಒಬ್ಬರು ಬಿದ್ದಿದ್ದಾರೆ',        ai: 'FALL DETECTED — Pool Deck L5. Severity: High. Medical team dispatched. Area being cleared.' },
];

export function VoiceAssistant() {
  const { pushNotification } = useCrisis();
  const [listening, setListening]         = useState(false);
  const [transcript, setTranscript]       = useState('');
  const [aiResponse, setAiResponse]       = useState('');
  const [selectedLang, setSelectedLang]   = useState('English');
  const [processing, setProcessing]       = useState(false);
  const [waveform, setWaveform]           = useState(Array(20).fill(4));
  const [history, setHistory]             = useState([]);

  // Animate waveform when listening
  useEffect(() => {
    if (!listening) return;
    const interval = setInterval(() => {
      setWaveform(Array(20).fill(0).map(() => Math.random() * 32 + 4));
    }, 100);
    return () => clearInterval(interval);
  }, [listening]);

  const toggleListen = () => {
    if (listening) {
      setListening(false);
      setProcessing(true);
      const demo = DEMO_TRANSCRIPTS[Math.floor(Math.random() * DEMO_TRANSCRIPTS.length)];
      setTimeout(() => {
        setTranscript(demo.text);
        setProcessing(false);
        setTimeout(() => {
          setAiResponse(demo.ai);
          pushNotification('🎤 Voice report processed — AI classified incident', 'warning');
          setHistory(prev => [{ text: demo.text, response: demo.ai, time: new Date(), lang: demo.lang }, ...prev.slice(0, 4)]);
        }, 800);
      }, 1500);
    } else {
      setTranscript('');
      setAiResponse('');
      setListening(true);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-crisis-bg p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Volume2 size={20} className="text-crisis-cyan" />
          <h1 className="font-display font-bold text-white text-lg tracking-widest">VOICE AI EMERGENCY ASSISTANT</h1>
        </div>

        {/* Language Selector */}
        <div className="mb-6">
          <p className="text-crisis-muted text-[10px] font-mono tracking-widest mb-2 flex items-center gap-1">
            <Globe size={11} /> SELECT LANGUAGE
          </p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                  ${selectedLang === lang ? 'bg-crisis-cyan/20 border-crisis-cyan/50 text-crisis-cyan' : 'bg-crisis-card border-crisis-border text-crisis-muted hover:border-crisis-muted'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Interface */}
        <div className="bg-crisis-surface border border-crisis-border rounded-2xl p-8 text-center">
          {/* Waveform */}
          <div className="flex items-center justify-center gap-1 h-16 mb-8">
            {waveform.map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: h }}
                transition={{ duration: 0.05 }}
                className={`w-1.5 rounded-full transition-colors ${listening ? 'bg-crisis-red' : 'bg-crisis-muted/40'}`}
                style={{ minHeight: 4 }}
              />
            ))}
          </div>

          {/* Mic Button */}
          <button
            onClick={toggleListen}
            className={`
              relative w-24 h-24 rounded-full border-2 mx-auto flex items-center justify-center transition-all duration-300 mb-4
              ${listening
                ? 'bg-crisis-red border-crisis-red shadow-[0_0_40px_rgba(255,26,26,0.6)] animate-pulse-red'
                : 'bg-crisis-card border-crisis-border hover:border-crisis-cyan/50 hover:shadow-[0_0_20px_rgba(0,245,255,0.2)]'
              }
            `}
          >
            {listening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-crisis-cyan" />}
            {listening && <div className="absolute inset-0 rounded-full border-2 border-crisis-red/50 animate-ping" />}
          </button>

          <p className="font-display font-bold text-sm text-crisis-text tracking-widest mb-1">
            {processing ? 'PROCESSING…' : listening ? 'RECORDING — TAP TO STOP' : 'TAP TO REPORT EMERGENCY'}
          </p>
          <p className="text-crisis-muted text-xs font-mono">Language: {selectedLang} · AI-powered · Auto-translate</p>

          {/* Processing indicator */}
          {processing && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-crisis-cyan border-t-transparent rounded-full animate-spin" />
              <span className="text-crisis-cyan text-xs font-mono">AI classifying incident…</span>
            </div>
          )}
        </div>

        {/* Transcript + AI Response */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-3"
            >
              <div className="bg-crisis-surface border border-crisis-border rounded-xl p-4">
                <p className="text-crisis-muted text-[10px] font-mono tracking-widest mb-1">TRANSCRIPT</p>
                <p className="text-crisis-text text-sm">"{transcript}"</p>
              </div>
              {aiResponse && (
                <div className="bg-crisis-red/10 border border-crisis-red/40 rounded-xl p-4">
                  <p className="text-crisis-red text-[10px] font-mono tracking-widest mb-1">AI CLASSIFICATION & ACTION</p>
                  <p className="text-crisis-text text-sm">{aiResponse}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-6">
            <p className="text-crisis-muted text-[10px] font-mono tracking-widest mb-3">RECENT VOICE REPORTS</p>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="bg-crisis-surface border border-crisis-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono text-crisis-cyan">{h.lang}</span>
                    <span className="text-[9px] font-mono text-crisis-muted">{h.time.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-crisis-text text-xs">"{h.text}"</p>
                  <p className="text-crisis-muted text-[10px] mt-1">→ {h.response}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
