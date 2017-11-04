const build = require('./build')
const exec = require('child_process').exec
const path = require('path')

build.then(({ main }) => {
  process.env.ROOT_URL = 'http://localhost:3000'
  process.env.JWT_SECRET = 'jwt secret'
  process.env.CLIENT_MAIN = main
  process.env.FB_APP_ID = process.env.FB_APP_ID || '12345'
  process.env.SESSION_SECRET = 'very secret'
  process.env.REDIS_URL = 'redis://localhost:6379'
  console.log('Runing build...')
  const cp = exec('node server.js', {
    cwd: path.resolve(__dirname, '../build')
  }, (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      process.exit(1)
    }
  })
  cp.stdout.pipe(process.stdout)
  cp.stderr.pipe(process.stderr)
}).catch(e => console.log(e))
