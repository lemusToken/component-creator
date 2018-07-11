/**
 * @type {requestAnimationFrame}
 */
let requestAnimationFrame = window.requestAnimationFrame
/**
 * @type {cancelAnimationFrame}
 */
let cancelAnimationFrame = window.cancelAnimationFrame
/**
 * @type {number}
 */
let lastTime = 0
if (!requestAnimationFrame) {
  const vendors = ['ms', 'moz', 'webkit', 'o']
  for (let x = 0; x < vendors.length; ++x) {
    requestAnimationFrame = requestAnimationFrame || (window[vendors[x] + 'RequestAnimationFrame'])
    cancelAnimationFrame = cancelAnimationFrame || (window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'])
  }
  requestAnimationFrame = function (fn) {
    let currTime = new Date().getTime()
    let timeToCall = Math.max(0, 16 - (currTime - lastTime))
    let id = setTimeout(function () {
      fn(currTime + timeToCall)
    }, timeToCall)
    lastTime = currTime + timeToCall
    return id
  }
}
if (!cancelAnimationFrame) {
  cancelAnimationFrame = function (id) {
    clearTimeout(id)
  }
}
/**
 * 利用requestAnimationFrame实现的节流函数
 * @param {callback} fn 回调函数
 * @returns {Function}
 */
const frame = function (fn) {
  let ticking = false
  const run = (context, args) => {
    ticking = false
    fn && fn.apply(context, args)
  }
  return function (...args) {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(() => {
        run(this, args)
      })
    }
  }
}
export {
  requestAnimationFrame,
  cancelAnimationFrame,
  frame
}