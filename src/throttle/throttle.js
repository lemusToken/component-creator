/**
 * - 节流函数，一般用于将连续动作合并为有限的几次
 * - throttle:当调用动作的时刻大于等于一个执行周期则执行该动作（一个周期执行一次）
 * - debounce:当前一个动作调用后的等待时间大于一个执行周期，则执行该动作，否则不执行动作继续等待（一个周期不一定执行）
 * @param {function} callback 需要节流的回调函数
 * @param {number} delay 间隔时间
 * @param {boolean} [trailing=true] 最后一次是否触发，debounce模式trailing必须为true，throttle模式下即便没有达到一个周期也会触发
 * @param {boolean} [debounce=false] debounce模式
 * @returns {Function}
 * @author xule
 */
function throttle (callback, delay, trailing = true, debounce = false) {
  let lastExecTime = 0
  let timer
  return function () {
    const elapsed = Date.now() - lastExecTime
    const args = arguments

    function exec () {
      lastExecTime = Date.now()
      callback.apply(this, args)
    }

    function clear () {
      timer = null
    }

    //  debounce模式下第一次必然执行
    if (debounce && !timer) {
      exec()
    }

    //  间隔时间内的连续调用不会触发回调函数
    timer && clearTimeout(timer)

    //  throttle模式下时间到后必然会执行回调方法
    //  第一次必然执行
    if (!debounce && elapsed > delay) {
      exec()
    }
    else if (trailing) {
      //  debounce模式下本次时间到后，只清空timer变量，下一次执行才可以触发回调事件
      //  throttle模式下如果间隔时间未到，则延迟到剩余时间后执行
      timer = setTimeout(debounce ? clear : exec, debounce ? delay : delay - elapsed)
    }
  }
}

/**
 * debounce，防抖动模式
 * @param {function} callback 回调函数
 * @param {number} delay 间隔时间，ms
 * @returns {throttle}
 */
function debounce (callback, delay) {
  return throttle(callback, delay, true, true)
}

export {
  throttle, debounce
}