/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      colors: {
        brand: {
          black:   '#121212',
          surface: '#1E1E1E',
          gray:    '#3A3A3A', // Darker for better contrast
          yellow:  '#FFCC00', // Slightly desaturated for a modern feel
          
          // Semantic colors
          background: '#121212',
          foreground: '#FFFFFF',
          card:       '#1E1E1E',
          primary:    '#FFCC00',
          secondary:  '#3A3A3A',
          accent:     '#007AFF', // Example accent color
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
