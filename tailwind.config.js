/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors from .windsurfrules
        'brand-dark': '#141413',
        'brand-light': '#faf9f5',
        'brand-mid': '#b0aea5',
        'brand-light-gray': '#e8e6dc',
        'brand-primary': '#d97757',
        'brand-secondary': '#6a9bcc',
        'brand-tertiary': '#788c5d',
        // Semantic aliases
        primary: '#d97757',
        secondary: '#6a9bcc',
        tertiary: '#788c5d',
        dark: '#141413',
        light: '#faf9f5',
      },
      fontFamily: {
        heading: ['Poppins_700Bold', 'Poppins_400Regular'],
        body: ['Lora_400Regular'],
      },
    },
  },
  plugins: [],
};

