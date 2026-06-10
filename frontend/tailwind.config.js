/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bodoni 72"', '"Didot"', 'Georgia', 'serif'],
        sans: ['"Avenir Next"', '"Gill Sans"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        vessel: '0 22px 55px color-mix(in oklch, var(--color-shadow), transparent 72%)'
      }
    }
  },
  plugins: []
};
