// See the Tailwind configuration guide for advanced usage
// https://tailwindcss.com/docs/configuration
// prettier-ignore
module.exports = {
  content: [
    './js/**/*.js',
    './js/**/*.jsx',
    './js/**/*.tsx',
    '../lib/*_web.ex',
    '../lib/*_web/**/*.*ex',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
