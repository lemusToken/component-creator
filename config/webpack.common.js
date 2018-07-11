const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const paths = require('../utils/paths')
const loaders = require('../utils/loaders')
const env = process.env.NODE_ENV
//  开发环境不能使用chunkhash
const hashName = env === 'production' ? '[chunkhash]' : '[hash]'

module.exports = {
  //  entry通过gulpjs生成
  entry: {
  },
  //  entry实际地址 = context + entry输入的地址
  context: paths.src,
  output: {
    filename: `[name].${hashName}.js`,
    //  编译输出的目录
    path: paths.create('dist'),
    //  静态资源最终访问路径 = output.publicPath + 资源loader或插件等配置路径
    publicPath: ''
  },
  module: {
    rules: [
      ...loaders.babel(),
      ...loaders.url(),
      ...loaders.style()
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: '[name].[hash].min.css'
    }),
    new webpack.DllReferencePlugin({
      context: paths.src,
      manifest: require(`${paths.create('manifest', 'es6-dll-manifest.json')}`)
    }),
    //  默认访问地址devServer.publicPath/index.html
    new HtmlWebpackPlugin({
      title: 'Production',
      template: 'index.html',
      filename: 'index.html',
      inject: true
    })
  ]
}