// gulp核心模块
const gulp = require('gulp')
// 文件模块
const fs = require('fs')
const minimist = require('minimist')

//  命令行参数
const options = minimist(process.argv.slice(2), {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' }
})

//  常量
const LIBS = 'libs'
const TASK = 'tasks'

// 查找文件夹下所有的文件
const listFiles = function (code, path = TASK) {
  let fileList = {}

  return (function _list (path) {
    fs.readdirSync(path).forEach(function (f) {
      if (fs.statSync(path + '/' + f).isDirectory()) {
        fileList[f] = fileList[f] || []
        _list(path + '/' + f)
      }
      else {
        let i = path.indexOf('/') > -1 ? path.split('/').pop() : '_root_'
        fileList[i] = fileList[i] || []
        fileList[i].push(f)
        typeof code === 'function' && code(f, path, i)
      }
    })
    return fileList
  })(path)
}

// 自动载入并注册所有的task
listFiles(function (file, path, i) {
  // 任务文件夹下的lib目录跳过
  if (path.indexOf('/' + LIBS) > -1) {
    return
  }
  const tk = require('./' + path + '/' + file)
  const name = file
  if (typeof tk.run === 'function') {
    gulp.task(name, function () {
      tk.run(options)// 运行
    })
  }
  if (typeof tk.watch === 'function') {
    gulp.task(name + ':watch', function () {
      tk.watch([name])// 监听
    })
  }
})

// 默认工作流
gulp.task('default', [], function () {
  console.log('hello!')
})