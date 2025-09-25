/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'cuesonic-dark': '#1C2039',
        'cuesonic-purple': '#4F46E5', // Using indigo-600 as a replacement for now
        'cuesonic-light-text': '#A9B2CC',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

