const autoprefixer = require('autoprefixer')

module.exports = [
  require('postcss-simple-vars')({
    variables: {
      dark: '#4f3130',
      bold: '#753742',
      main: '#aa5042',
      highlight: '#d8bd8a',
      light: '#d8d78f'
    }
  }),
  require('postcss-flexbugs-fixes'),
  autoprefixer({
    browsers: [
      '>1%',
      'last 4 versions',
      'Firefox ESR',
      'not ie < 9' // React doesn't support IE8 anyway
    ],
    flexbox: 'no-2009'
  })
]
