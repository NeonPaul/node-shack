module.exports = {
  swExclude: /service-worker\/index\.js/,
  serviceWorker: {
    test: /service-worker\/index\.js/,
    use: [{
      loader: 'service-worker-loader',
      options: {
        filename: 'sw.js'
      }
    }]
  }
}