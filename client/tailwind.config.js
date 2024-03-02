const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      transitionTimingFunction: {
        DEFAULT: 'ease-in-out',
      },
      transitionDuration: {
        DEFAULT: '400ms',
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: 1,
          },
          to: {
            opacity: 1,
          },
        },
      },
      animation: {
        fade: 'fadeIn .5s ease-in-out',
      },
      zIndex: {
        1: '1',
        2: '2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(({ addComponents, theme, addUtilities }) => {
      addComponents({
        '.btn': {
          backgroundColor: theme('colors.slate.500'),
          padding: '5px 0',
          display: 'block',
          width: '100%',
          fontSize: 18,
          fontWeight: 'bold',

          '&:hover': {
            backgroundColor: theme('colors.slate.600'),
          },
        },
      }),
        addUtilities({
          '.text-shadow': {
            textShadow: '1px 1px rgba(0, 0, 0, 0.1)',
          },
        })
    }),
  ],
}
