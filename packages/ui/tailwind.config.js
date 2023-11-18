/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-dark': '#1E1E1F',
        'custom-darker': '#1B1B1C',
        'custom-lighter': '#232324',
      },
      backgroundImage: {
        'subtle-gradient': 'linear-gradient(to bottom, #232324, #1E1E1F, #1B1B1C)',
      }
    }
  },
  plugins: [],
}

