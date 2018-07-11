import {Listen, Event} from '../index'

const listen = new Listen()

//  注册事件
listen.on('click', '.lv2', function () {
  console.log('click .lv2')
}, {
  a: 1
})
//  命名空间：类型.空间，命名空间只在用程序触发或者删除事件时才有效果
listen.on('click.auto', '.lv2', function () {
  console.log('click.auto .lv2')
}, {
  a: 2
})
//  只执行一次
listen.once('click', '.lv2.once', function () {
  console.log('once click .lv2.once')
}, {
  a: 3
})
//  禁止冒泡
listen.on('click', '.lv3', function (e) {
  Listen.cancelBubble(e)
  // e.cancelListenBubble = true
  console.log('click .lv3 禁止了冒泡')
}, {
  a: 4
})
//  禁止默认事件，e.preventDefault()无效
listen.on('click', 'a[p]', function (e) {
  Listen.cancelBubble(e)
  // e.cancelListenBubble = true
  console.log('click a 不会跳转')
}, {
  a: 5,
  preventDefault: true
})
//  利用节流函数
listen.on('scroll.frame', 'window', function () {
  console.log('scroll frame 节流')
}, {
  //  throttle:500, debounce: 500, frame: true
  //  ms，建议直接使用frame，利用requestAnimationFrame进行节流
  frame: true
})
listen.on('scroll', 'window', function () {
  console.log('scroll 无节流')
})
//  销毁事件
listen.on('click', '#destroy', function () {
  listen.off('scroll.frame', 'window')
})
//  触发事件
listen.on('click', '#trigger', function () {
  listen.trigger('click.auto', '.lv2')
})
// Event.register(document.getElementById('trigger'), 'click', function () {
//   listen.trigger('click.auto', '.lv2')
// })