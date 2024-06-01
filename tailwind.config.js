/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Inter', 'sans-serif']
      },
      transitionDuration: {
        DEFAULT: 250
      },
      transitionProperty: {
        width: 'width min-width max-width',
        height: 'height min-height max-height'
      }
    }
  },
  plugins: []
}
