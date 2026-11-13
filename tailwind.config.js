/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#641B2E', dark: '#4A1222' },
        terracotta: '#A64B2A',
        gold: { DEFAULT: '#C49A36', light: '#E3C777' },
        peacock: '#174C3C',
        ivory: { DEFAULT: '#F4E7D0', dark: '#E9D6B4' },
        indigo: { DEFAULT: '#263B50' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(18px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: { fadeUp: 'fadeUp .7s ease both' },
    },
  },
  plugins: [],
}
