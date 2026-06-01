module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#7C3AED',
        accent: '#06B6D4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
        heading: ['Inter', 'system-ui'],
        mono: ['"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
};
