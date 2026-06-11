import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#26D9A8',
          500: '#1DB88F',
          600: '#0D9373',
          700: '#065F46',
          800: '#064E3B',
          900: '#022C22',
        },
        dark: {
          50:  '#E8F5F2',
          100: '#C5E8DF',
          200: '#9BCFC2',
          300: '#7BB5A8',
          400: '#5A9089',
          500: '#3D6660',
          600: '#2A4744',
          700: '#1A2E2C',
          800: '#0D1A1A',
          900: '#080F0F',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'system-ui',
          'sans-serif'
        ]
      },
      animation: {
        'fade-up':    'fadeUp 0.7s ease forwards',
        'fade-in':    'fadeIn 0.6s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float':      'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    }
  },
  plugins: []
};

export default config;
