/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'world': '#3B82F6',
        'intent': '#10B981',
        'command': '#8B5CF6',
        'transform': '#F59E0B',
        'goal': '#FBBF24',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'blink': 'blink 1s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
}
