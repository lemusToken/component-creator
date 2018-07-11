const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const paths = require('../../utils/paths')

//  打包前配置的前置处理
module.exports = (name, config, op = {}) => {
  //  覆盖HtmlWebpackPlugin
  //  当组件根目录下存在demo/index.html，使用该文件，否则使用项目目录下的index.html
  let htmlPath = paths.create('src', name, 'demo', 'index.html')
  if (fs.existsSync(htmlPath)) {
    for (let i = 0; i < config.plugins.length; i++) {
      if (config.plugins[i] instanceof HtmlWebpackPlugin) {
        config.plugins[i] = new HtmlWebpackPlugin({
          title: name,
          template: htmlPath,
          filename: 'index.html',
          inject: true
        })
      }
    }
  }
  //  导出输出到全局变量
  if (op.exportVar) {
    config.module.rules.push({
      test: require.resolve(`../src/${name}/index.js`),
      loader: 'expose-loader?EFX'
    })
  }
  return config
}