/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // Glide brand palette.
        brand: {
          // dark purple/blue gradient stops
          900: '#0b0a1f',
          800: '#151235',
          700: '#1e1a4d',
          600: '#2a2270',
          500: '#3b2fa0',
          accent: '#01F59D', // green — accent ONLY, never large fills
        },
      },
      fontFamily: {
        // Poppins for UI text; Space Grotesk for large numerals.
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        // Headings cap at 600 by house style.
        heading: '600',
      },
      backgroundImage: {
        'brand-gradient':
          'radial-gradient(1200px 600px at 20% -10%, #2a2270 0%, transparent 60%), radial-gradient(1000px 500px at 90% 0%, #1e1a4d 0%, transparent 55%), linear-gradient(180deg, #0b0a1f 0%, #151235 100%)',
      },
    },
  },
  plugins: [],
};
