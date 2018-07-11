const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.common.js')
const paths = require('../utils/paths')

module.exports = merge(common, {
  //  开发模式
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    //  指定服务器资源的根目录，contentBase默认是项目的目录
    contentBase: [paths.dist],
    publicPath: '/',
    port: '5080',
    host: '0.0.0.0',
    inline: true,
    historyApiFallback: true,
    stats: {
      colors: true
    },
    hot: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin() // HMR shows correct file names in console on update.
  ]
})