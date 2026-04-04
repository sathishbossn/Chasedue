/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ED13C4',
        'primary-light': '#FDF0FB',
        'primary-border': 'rgba(237,19,196,0.2)',
        navy: '#111827',
        text: '#374151',
        'text-mid': '#6B7280',
        'text-light': '#9CA3AF',
        border: '#E5E7EB',
        'border-mid': '#D1D5DB',
        bg: '#FFFFFF',
        'bg-cream': '#FAF9F5',
        'bg-warm': '#F7F4EE',
        'bg-section': '#F4F2EC',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'lora': ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
}
