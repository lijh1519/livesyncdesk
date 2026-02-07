/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#136dec',
        'primary-hover': '#115bbd',
        'bg-light': '#f6f7f8',
        surface: 'rgba(255, 255, 255, 0.75)',
        'surface-hover': 'rgba(255, 255, 255, 0.9)',
        'surface-dark': 'rgba(16, 24, 34, 0.85)',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'float': '0 8px 32px -4px rgba(0, 0, 0, 0.1), 0 4px 16px -2px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'xs': '2px',
        'md': '12px',
      }
    }
  },
  plugins: [],
}
