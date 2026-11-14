/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Garamond', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        pastel: {
          pink: '#ffd1dc',
          'pink-soft': '#fff0f3',
          'pink-hover': '#ffb6c1',
          rose: '#ff85a1',
          purple: '#e8dff5',
          'purple-dark': '#8a65c2',
          lavender: '#d8b4e2',
        }
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
