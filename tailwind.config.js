import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#00DFC0',
      },
      fontFamily: {
        'sans': ['Montserrat', 'Poppins', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

