import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#6B0F1A',
          dark:    '#4A0A12',
          light:   '#8B1A28',
          pale:    '#F9ECED',
        },
        gold: {
          DEFAULT: '#B8922A',
          light:   '#D4A843',
          pale:    '#FBF4E3',
        },
        border:  '#DDD0D2',
        surface: '#F7F4F2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '10px',
      },
    },
  },
  plugins: [],
}

export default config
