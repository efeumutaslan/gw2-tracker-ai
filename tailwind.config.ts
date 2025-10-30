import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // GW2 Rarity Colors
        legendary: '#d4af37',
        exotic: '#ffa500',
        ascended: '#fb3e8d',
        rare: '#ffd700',
        masterwork: '#1a9306',
        fine: '#62a4da',

        // GW2 Profession Colors
        gw2: {
          gold: '#C9B037',
          silver: '#A8A8A8',
          copper: '#CD7F32',
          guardian: '#72C1D9',
          warrior: '#FFD166',
          engineer: '#D09C59',
          ranger: '#8CDC82',
          thief: '#C08F95',
          elementalist: '#F68A87',
          mesmer: '#B679D5',
          necromancer: '#52A76F',
          revenant: '#D16E5A',
        },

        // Theme Colors
        primary: {
          50: '#fef3e7',
          100: '#fce4c3',
          200: '#f9cf9b',
          300: '#f6ba73',
          400: '#f4aa55',
          500: '#f29a37',
          600: '#e88e2f',
          700: '#dc7f26',
          800: '#d0701d',
          900: '#be540a',
        },

        // Background
        background: {
          DEFAULT: '#0a0e14',
          darker: '#050810',
          paper: '#1a1f2e',
        },

        // Dark theme shades
        dark: {
          50: '#e8e9ec',
          100: '#c6c8ce',
          200: '#a0a4ae',
          300: '#7a808d',
          400: '#5e6474',
          500: '#41485b',
          600: '#3b4153',
          700: '#323849',
          800: '#2a2f40',
          900: '#1c1f2e',
        },
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gw2-pattern': 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(242, 154, 55, 0.05) 100%)',
      },

      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flame': 'flame 1.5s ease-in-out infinite',
        'urgent': 'urgent 0.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },

      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(242, 154, 55, 0.5), 0 0 10px rgba(242, 154, 55, 0.3)',
            filter: 'brightness(1)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(242, 154, 55, 0.8), 0 0 30px rgba(242, 154, 55, 0.4)',
            filter: 'brightness(1.2)',
          },
        },
        flame: {
          '0%, 100%': {
            transform: 'translateY(0) scaleY(1)',
            opacity: '1',
          },
          '25%': {
            transform: 'translateY(-2px) scaleY(1.1)',
            opacity: '0.9',
          },
          '50%': {
            transform: 'translateY(-4px) scaleY(1.15)',
            opacity: '0.95',
          },
          '75%': {
            transform: 'translateY(-2px) scaleY(1.1)',
            opacity: '0.9',
          },
        },
        urgent: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 10px rgba(230, 0, 0, 0.5)',
          },
          '50%': {
            transform: 'scale(1.03)',
            boxShadow: '0 0 25px rgba(230, 0, 0, 0.8)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },

      boxShadow: {
        'glow': '0 0 20px rgba(242, 154, 55, 0.4)',
        'glow-lg': '0 0 30px rgba(242, 154, 55, 0.6)',
        'legendary': '0 0 30px rgba(212, 175, 55, 0.8)',
        'exotic': '0 0 25px rgba(255, 165, 0, 0.6)',
        'ascended': '0 0 25px rgba(251, 62, 141, 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
