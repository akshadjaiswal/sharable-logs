/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        foreground: '#1A1A1A',
        muted: '#F5F3F0',
        'muted-foreground': '#6B6B6B',
        accent: '#B8860B',
        'accent-secondary': '#D4A84B',
        'accent-foreground': '#FFFFFF',
        border: '#E8E4DF',
        card: '#FFFFFF',
        ring: '#B8860B',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        label: '0.15em',
      },
    },
  },
  plugins: [],
}
