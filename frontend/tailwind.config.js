/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5c6bc0',
          50: '#f4f5fb',
          100: '#e8ebf7',
          200: '#d1d7ed',
          300: '#adb7e1',
          400: '#8493d3',
          500: '#6674c8',
          600: '#5c6bc0',
          700: '#4050b5',
          800: '#374196',
          900: '#2e377b',
          950: '#1c2048'
        },
        accent: {
          DEFAULT: '#ff4081',
          50: '#fff1f6',
          100: '#ffe4ee',
          200: '#ffcadd',
          300: '#ffa0c2',
          400: '#ff79b0',
          500: '#ff4081',
          600: '#ff1a63',
          700: '#ff0055',
          800: '#d30045',
          900: '#a9003b',
          950: '#5e0020'
        },
        success: {
          DEFAULT: '#4caf50',
          light: '#a5d6a7',
          dark: '#388e3c'
        },
        warning: {
          DEFAULT: '#ff9800',
          light: '#ffcc80',
          dark: '#f57c00'
        },
        error: {
          DEFAULT: '#f44336',
          light: '#ef9a9a',
          dark: '#d32f2f'
        }
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        input: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'input-focus': '0 0 0 3px rgba(92, 107, 192, 0.2)'
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif']
      },
      borderRadius: {
        'card': '0.75rem',
        'button': '0.5rem',
        'input': '0.5rem'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionDuration: {
        '250': '250ms',
      }
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.btn': {
          padding: '.5rem 1rem',
          borderRadius: '0.5rem',
          fontWeight: '500',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms ease-in-out',
          cursor: 'pointer',
          '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(92, 107, 192, 0.4)'
          }
        },
        '.glass-card': {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }
      })
    }
  ],
};
