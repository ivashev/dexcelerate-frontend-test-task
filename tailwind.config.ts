/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        'dex-dark': '#0a0a0a',
        'dex-secondary': '#1a1a1a',
        'dex-border': '#2a2a2a',
        'dex-text': '#9ca3af',
        'dex-success': '#10b981',
        'dex-danger': '#ef4444',
        'dex-warning': '#f59e0b',
      },
    },
  },
  plugins: [],
}
