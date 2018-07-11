const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const common = require('./webpack.common.js')
const paths = require('../utils/paths')

module.exports = merge(common, {
  //  生产环境
  mode: 'production',
  devtool: false,
  plugins: [
    new CleanWebpackPlugin(['dist/*.*'], {
      root: paths.root
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    //  用hash命名modelid
    new webpack.HashedModuleIdsPlugin(),
    //  稳定chunkid从而稳定chunkhash，用于持久化缓存
    new webpack.NamedChunksPlugin(chunk => {
      if (chunk.name) {
        return chunk.name
      }
      return Array.from(chunk.modulesIterable, m => m.id).join('_')
    })
  ],
  optimization: {
    minimize: true
    // runtimeChunk: true
    // splitChunks: {
    //   automaticNameDelimiter: '_',
    //   cacheGroups: {
    //     vendor: {
    //       name: "babel",
    //       chunks: "initial",
    //       minChunks: 2
    //     }
    //   }
    // }
  }
})