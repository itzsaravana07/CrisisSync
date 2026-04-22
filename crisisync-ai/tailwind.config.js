/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crisis: {
          red:     '#FF1A1A',
          orange:  '#FF6B1A',
          yellow:  '#FFD700',
          cyan:    '#00F5FF',
          green:   '#00FF88',
          bg:      '#040810',
          surface: '#070D1A',
          card:    '#0A1428',
          border:  '#1A2E4A',
          muted:   '#2A3F5F',
          text:    '#B0C4DE',
        },
      },
      fontFamily: {
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
        body:    ['"Exo 2"', 'sans-serif'],
      },
      animation: {
        'pulse-red':   'pulseRed 1.5s ease-in-out infinite',
        'scan-line':   'scanLine 3s linear infinite',
        'flicker':     'flicker 0.15s infinite',
        'slide-in':    'slideIn 0.4s cubic-bezier(0.16,1,0.3,1)',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'radar-spin':  'radarSpin 4s linear infinite',
        'blink':       'blink 1s step-end infinite',
      },
      keyframes: {
        pulseRed: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,26,26,0.7)' },
          '50%':     { boxShadow: '0 0 0 12px rgba(255,26,26,0)' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.85' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%,100%': { filter: 'drop-shadow(0 0 4px #00F5FF)' },
          '50%':     { filter: 'drop-shadow(0 0 12px #00F5FF)' },
        },
        radarSpin: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)`,
        'crisis-gradient': 'linear-gradient(135deg, #040810 0%, #070D1A 50%, #040810 100%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
