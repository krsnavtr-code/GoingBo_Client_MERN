/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand colors
        'logo-bg': 'var(--logo-bg-color)',
        'logo-bg-light': 'var(--logo-bg-color-light)',
        'logo-text': 'var(--logo-color)',
        // Container colors
        container: 'var(--container-color)',
        'container-in': 'var(--container-color-in)',
        // Text colors
        text: 'var(--text-color)',
      },
      backgroundColor: {
        primary: 'var(--container-color)',
        secondary: 'var(--container-color-in)',
        logo: 'var(--logo-bg-color)',
      },
      textColor: {
        primary: 'var(--text-color)',
        logo: 'var(--logo-color)',
      },
      borderColor: {
        primary: 'var(--logo-bg-color)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
}
