/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Maxim Brand Colors
        maxim: {
          yellow: '#FEEC00',
          black: '#121212',
          card: '#1E1E1E',
          text: '#FFFFFF',
          muted: '#A1A1AA'
        },
        // Backward compatibility aliases
        brand: {
          yellow: '#FEEC00',
          black: '#121212',
          gray: '#2A2A2A',
          surface: '#1E1E1E'
        }
      }
    }
  },
  plugins: [],
}
