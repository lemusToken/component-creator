const paths = require('./paths')
//  单独提取css文件，注意webpack4+需要extract-text-webpack-plugin@next版本
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  babel () {
    return [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: paths.src
      }
    ]
  },
  url () {
    return [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  style () {
    return [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  }
}