/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#10151B',
        navy: '#1E3A5F',
        navyDeep: '#122A45',
        gold: '#D4A24C',
        mist: '#F4F6F8',
        paper: '#FFFFFF',
        line: '#E3E7EC',
        slate: '#5B6672',
        success: '#2AA37A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      keyframes: {
        blink: {
          '0%, 80%, 100%': { opacity: '0.2' },
          '40%': { opacity: '1' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        talk: {
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '25%': { transform: 'scale(1.015) translateY(-0.5px)' },
          '50%': { transform: 'scale(0.99) translateY(0.5px)' },
          '75%': { transform: 'scale(1.02) translateY(-0.3px)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1.08) translate(0, 0)' },
          '100%': { transform: 'scale(1.18) translate(-1%, -1%)' },
        },
      },
      animation: {
        blink1: 'blink 1.2s infinite ease-in-out',
        blink2: 'blink 1.2s infinite ease-in-out 0.2s',
        blink3: 'blink 1.2s infinite ease-in-out 0.4s',
        rise: 'rise 0.25s ease-out',
        pulseRing: 'pulseRing 1.8s cubic-bezier(0.2,0.6,0.4,1) infinite',
        breathe: 'breathe 4.5s ease-in-out infinite',
        talk: 'talk 0.35s ease-in-out infinite',
        kenburns: 'kenburns 18s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};
