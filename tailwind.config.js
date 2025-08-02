/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sunshine: '#FFD700',
        coral: '#FF7F7F',
        sky: '#87CEEB',
        mint: '#98FB98',
        peach: '#FFCBA4',
        lavender: '#E6E6FA',
        cream: '#FFFDD0',
        linen: '#FAF0E6',
        brown: '#8B4513',
        softgray: '#D3D3D3',
      },
      fontFamily: {
        handwritten: ['Kalam', 'cursive'],
        cursive: ['Caveat', 'cursive'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'twinkle': 'twinkle 1.5s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}