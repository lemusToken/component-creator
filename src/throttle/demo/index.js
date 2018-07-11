import {throttle, debounce, frame} from '../index'

//  节流控制，一般用于将连续动作合并为有限的几次
//  throttle，节流，一个周期执行一次
//  debounce，防抖动，一个周期不一定执行，只有动作与动作之间的空闲时间达到一个周期才会执行
//  frame，周期由requestAnimationFrame控制，一般认为与屏幕刷新频率等同
/**
 * 秒数判断
 * @type {number}
 */
let secondTime = 0
/**
 * 秒数
 * @type {number}
 */
let timerIndex = 0
/**
 * 计时器
 * @type {null}
 */
let timer = null
/**
 * 计数
 * @type {{throttle: number, debounce: number, frame: number}}
 */
let runNum = {
  throttle: 0,
  debounce: 0,
  frame: 0
}
/**
 * throttle
 * @type {Function}
 */
const throttleFn = throttle(() => {
  runNum.throttle += 1
  console.log('throttle', runNum.throttle, Date.now())
}, 1000, true)
/**
 * debounce，1s内如果继续执行该动作，该动作不会触发而是继续等待
 * @type {throttle}
 */
const debounceFn = debounce(() => {
  runNum.debounce += 1
  console.log('debounce', runNum.debounce, Date.now())
}, 1000)
/**
 * frame
 * @type {Function}
 */
const frameFn = frame(() => {
  runNum.frame += 1
  console.log('frame', runNum.frame, Date.now())
}, 1000)
timer = setInterval(() => {
  secondTime += 10
  if (secondTime % 1000 === 0) {
    timerIndex += 1
    console.log(timerIndex + 's')
  }
  if (secondTime > 10000) {
    clearInterval(timer)
    return
  }
  throttleFn()
  debounceFn()
  frameFn()
}, 10)
