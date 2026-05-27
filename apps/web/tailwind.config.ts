import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        accent: 'var(--c-accent)',
        accentSoft: 'var(--c-accent-soft)',
        text: 'var(--c-text)',
        muted: 'var(--c-muted)',
        line: 'var(--c-line)',
      },
    },
  },
  plugins: [],
};
export default config;
