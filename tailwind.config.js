/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        'jambox-dark': '#1C2039',
        'jambox-purple': '#4F46E5', // Using indigo-600 as a replacement for now
        'jambox-light-text': '#A9B2CC',
        'jambox-dark-light': '#3E446A',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

