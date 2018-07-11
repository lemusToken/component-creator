const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const preProcessing = require('./libs/component.pre.processing')
let config = require('../config/webpack.dev')

process.env.NODE_ENV = 'development'
//
module.exports = {
  run (args) {
    const name = args.name
    const g = args.g
    config = preProcessing(name, config, {
      exportVar: !!g
    })
    // config.devServer.quiet = true
    config.entry = {
      [name]: [
        // 热更新
        'webpack-dev-server/client?http://localhost:' + config.devServer.port,
        'webpack/hot/dev-server',
        `./${name}/demo/index.js`
      ]
    }
    const compiler = webpack(config)
    const server = new WebpackDevServer(compiler, config.devServer)
    server.listen(config.devServer.port)
  }
}