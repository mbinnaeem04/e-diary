/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FDFBF7',    // page background (warm cream)
        paper: '#FFFFFF',     // notebook / card base
        primary: '#FFE878',   // sticky-note yellow
        secondary: '#FF8FA3', // pastel pink
        tertiary: '#B7E4C7',  // sage green
        ink: '#2B2D42',       // text, borders, shadows
        rule: '#E5E5E5',      // notebook ruled lines
        tape: '#EADFC0',      // masking tape (search bar, binder rings)
      },
      fontFamily: {
        heading: ['Caveat', 'Kalam', 'cursive'],
        body: ['Fredoka', 'Outfit', 'system-ui', 'sans-serif'],
      },
      // Neobrutalism: flat, hard, zero-blur shadows only
      boxShadow: {
        'hard-sm': '2px 2px 0px #2B2D42',
        hard: '4px 4px 0px #2B2D42',
        'hard-lg': '6px 6px 0px #2B2D42',
        'hard-xl': '8px 8px 0px #2B2D42',
      },
    },
  },
  plugins: [],
};
