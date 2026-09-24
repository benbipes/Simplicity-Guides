/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        simplicity: {
          navy: '#004372',
          royal: '#0076BD',
          dark: '#002c4c',
          light: '#eef6fb',
          accent: '#0284c7',
          gray10: '#E6E6E6', // 10% black background
        },
        brand: {
          50: '#f0f7fc',
          100: '#e0effa',
          200: '#bae0f6',
          500: '#0076BD', // Simplicity Royal Blue
          600: '#00629e',
          700: '#004372', // Simplicity Navy Blue
          800: '#00355a',
          900: '#002540',
        }
      },
      fontFamily: {
        sans: ['"Arial Nova"', 'Arial', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
