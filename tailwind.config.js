/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#121212',
          elevated: '#161616',
          card: '#1a1a1a',
          muted: '#1e1e1e',
        },
        /** ChaseDue app shell (slate-900) */
        shell: {
          canvas: '#0F172A',
          sidebar: '#0c1424',
        },
        // Brand orange — primary accent (#F97316)
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#F97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Soft slate — secondary text / UI chrome
        'slate-soft': '#94A3B8',
        primary: '#F97316',
        'primary-light': '#ffedd5',
        'primary-dark': '#c2410c',
        muted: '#94A3B8',
        subtle: '#161616',
        border: 'rgba(255, 255, 255, 0.08)',
        'border-strong': 'rgba(255, 255, 255, 0.12)',
        accent: {
          DEFAULT: '#fb923c',
          light: 'rgba(251, 146, 60, 0.15)',
          dark: '#ea580c',
          foreground: '#fff7ed',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        lead: ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '8px',
        md: '10px',
        lg: '12px',
        xl: '12px',
        '2xl': '12px',
        '3xl': '14px',
      },
      boxShadow: {
        border: '0 0 0 1px rgba(255, 255, 255, 0.06)',
        soft: '0 1px 2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        card: '0 8px 32px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'card-hover':
          '0 12px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(249, 115, 22, 0.2)',
        glow: '0 0 0 1px rgba(249, 115, 22, 0.25), 0 8px 40px rgba(249, 115, 22, 0.2)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 24px rgba(249, 115, 22, 0.35)' },
          '50%': { boxShadow: '0 0 48px rgba(249, 115, 22, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
