
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'neon-blue': {
          500: '#00FFFF',
          600: '#00CCCC',
        },
        'purple': {
          400: '#A78BFA',
          500: '#8B5CF6',
        },
      },
    },
  },
  plugins: [],
};
