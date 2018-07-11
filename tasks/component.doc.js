const exec = require('child_process').exec
const path = require('path')
module.exports = {
  run () {
    const command = [path.normalize('./node_modules/.bin/esdoc')]
    const cl = exec(command.join(' '), (err, stdout, stderr) => {
      if (err) {
        console.log(err)
      }
    })
    cl.stdout.on('data', function (data) {
      console.log(data)
    })

    cl.on('exit', function (code) {
      console.log('child process exited with code ' + code)
    })
  }
}