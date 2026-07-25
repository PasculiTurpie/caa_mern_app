/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // controlado manualmente vía AccessibilityContext (tema oscuro / alto contraste)
  theme: {
    extend: {
      fontSize: {
        'card-lg': ['1.5rem', { lineHeight: '2rem' }],
      },
      keyframes: {
        dwellProgress: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        dwell: 'dwellProgress linear forwards',
      },
    },
  },
  plugins: [],
};
