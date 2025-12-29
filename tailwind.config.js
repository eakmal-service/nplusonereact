/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        'silver': "#C2C2C1",
        'black': "#000000",
        'custom-black': "#000000",
      }
    },
  },
  plugins: [],
} 