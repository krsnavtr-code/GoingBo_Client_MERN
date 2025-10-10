// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
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
        'container': 'var(--container-color)',
        'container-in': 'var(--container-color-in)',
        // Text colors
        'text': 'var(--text-color)',
        'text-light': 'var(--text-color-light)',
      },
    },
  },
  plugins: [],
}