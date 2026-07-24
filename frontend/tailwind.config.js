/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // controlado manualmente vía AccessibilityContext (tema oscuro / alto contraste)
  theme: {
    extend: {
      colors: {
        // Paleta basada en la Clave Fitzgerald (ver src/utils/fitzgeraldColors.js)
        fitz: {
          subject: '#FDE047', // Amarillo - Sujetos/Pronombres
          action: '#4ADE80', // Verde - Acciones/Verbos
          object: '#FB923C', // Naranja - Objetos/Cosas
          urgent: '#F87171', // Rojo/Rosa - Urgencias/Respuestas rápidas
          feeling: '#C084FC', // Morado - Emociones
          place: '#38BDF8', // Azul cielo - Lugares
        },
      },
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
