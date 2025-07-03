/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Required for dark mode toggle
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        calm: {
          lightBg: '#f4f7fa', // very light blue-gray
          lightSurface: '#e9eef3', // light surface
          lightText: '#1a202c', // calm dark text
          darkBg: '#1a222c', // deep blue-gray
          darkSurface: '#232b36', // slightly lighter than bg
          darkAccent: '#6ee7b7', // soft teal accent
          darkText: '#e0e7ef', // calm light text
        },
      },
    },
  },
  plugins: [],
};
