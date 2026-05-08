import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F6F5F1',
        'bg-soft': '#EFEDE7',
        ink: '#1F1E1B',
        'ink-soft': '#3A3934',
        stone: '#7B7A75',
        hairline: '#D8D5CD',
      },
      fontFamily: {
        display: ['"TilburgsAns"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['"Inter"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
