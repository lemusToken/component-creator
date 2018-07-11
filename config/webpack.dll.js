const path = require('path')
const webpack = require('webpack')
const paths = require('../utils/paths')

module.exports = {
  mode: 'production',
  context: paths.src,
  entry: {
    es6: ['babel-polyfill']
  },
  output: {
    path: paths.create('dlls'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      context: paths.src,
      path: paths.create('manifest', '[name]-dll-manifest.json'),
      name: '[name]_library'
    })
  ]
}