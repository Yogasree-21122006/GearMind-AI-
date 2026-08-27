/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        violet: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },
        navy: {
          800: '#0F172A',
          900: '#0B0F19',
          950: '#060911',
        },
        surface: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        }
      },
      boxShadow: {
        'card-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(249, 115, 22, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'orange-glow': '0 4px 20px -2px rgba(249, 115, 22, 0.25)',
        'yellow-glow': '0 4px 15px -2px rgba(234, 179, 8, 0.25)',
        'violet-glow': '0 4px 20px -2px rgba(124, 58, 237, 0.25)',
      }
    },
  },
  plugins: [],
}

