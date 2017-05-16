source ssr/env-vars.sh
./node_modules/.bin/webpack --config=ssr/webpack.client.config.js
./node_modules/.bin/webpack --config=ssr/webpack.server.config.js
node ssr/server.js
