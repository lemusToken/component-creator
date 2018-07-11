const webpack = require('webpack')
const preProcessing = require('./libs/component.pre.processing')
let config = require('../config/webpack.prod')

process.env.NODE_ENV = 'production'
module.exports = {
  run (args) {
    const name = args.name
    const g = args.g
    config = preProcessing(name, config, {
      exportVar: !!g
    })
    config.entry = {
      [name]: [`./${name}/index.js`]
    }
    const compiler = webpack(config, (err, stats) => {
      if (err) {
        console.log(err)
      }
      //  显示结果
      console.log(stats.toString({
        colors: true
      }))
    })
  }
}