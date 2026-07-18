/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fbf7ed',
          100: '#f5ecd0',
          200: '#ecd9a0',
          300: '#e0c06b',
          400: '#d4ab45',
          500: '#c5a55a',
          600: '#a8863a',
          700: '#856a2e',
          800: '#5e4b22',
          900: '#3a2e15',
        },
        navy: {
          50: '#f0f3f8',
          100: '#e0e6f0',
          200: '#c4d0e3',
          300: '#9aafcc',
          400: '#6a83ad',
          500: '#4a6593',
          600: '#3a517a',
          700: '#2e3f61',
          800: '#1f2b44',
          900: '#0f1a2e',
          950: '#070f1e',
        },
        cream: {
          50: '#fefdfb',
          100: '#faf6ef',
          200: '#f4ece0',
          300: '#ebdcc6',
          400: '#dcc4a3',
          500: '#c9a87e',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Noto Kufi Arabic"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.7s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c5a55a 0%, #e0c06b 50%, #a8863a 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #a8863a 0%, #e0c06b 25%, #c5a55a 50%, #e0c06b 75%, #a8863a 100%)',
      },
    },
  },
  plugins: [],
};
