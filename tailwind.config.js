/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        textMain: 'var(--color-text-main)',
        textMuted: 'var(--color-text-muted)',
        borderMain: 'var(--color-border)',
        neonGreen: 'rgb(var(--color-neon-green) / <alpha-value>)',
        electricCyan: 'rgb(var(--color-electric-cyan) / <alpha-value>)',
        glassBg: 'var(--color-glass-bg)',
        glassBorder: 'var(--color-glass-border)',
        darkSurface: 'var(--color-surface)', // Backwards compatibility for now
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
