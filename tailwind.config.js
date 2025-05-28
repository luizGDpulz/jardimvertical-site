/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{php,html,js}",
  ],
  theme: {
    extend: {
      colors: {
        'verde-musgo': '#2E4A33',
        'verde-claro': '#7BB661',
        'marrom-terra': '#5D4037',
        'cinza-pedra': '#9E9E9E',
        'branco-natural': '#F5F5F5',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
