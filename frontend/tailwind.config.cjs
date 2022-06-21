/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['Inter', 'sans-serif'],
      'mono': ['IBM Plex Mono', 'monospace']
    }
  },
  plugins: [],
}
