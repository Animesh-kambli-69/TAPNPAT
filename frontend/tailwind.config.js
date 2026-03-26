/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'cyber-navy': '#0F1419',
        'cyber-navy-light': '#1A1F2A',
        'cyber-orange': '#FF6B35',
        'cyber-blue': '#00D4FF',
        'cyber-gray-light': '#E8E8E8',
        'cyber-gray-dark': '#6B7280',
      },
    },
  },
  plugins: [],
};
