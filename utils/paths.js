const path = require('path')
const root = process.cwd()

const create = (root, ...p) => {
  return path.join(root, ...p)
}

module.exports = {
  root,
  create (type, ...p) {
    return create(this[type] || '', ...p)
  },
  dist: create(root, 'dist'),
  dlls: create(root, 'dist', 'dlls'),
  config: create(root, 'config'),
  src: create(root, 'src'),
  manifest: create(root, 'manifest'),
  utils: create(root, 'utils')
}