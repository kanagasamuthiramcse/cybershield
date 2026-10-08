/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#070b14',
          card: '#0d1527',
          border: '#1e293b',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
