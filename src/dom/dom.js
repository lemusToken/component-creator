import * as Modules from './libs'
import Mixin from './utils/mixin'
import Base from './utils/base'

/**
 * dom文档操作
 * ** Mixin混合模式 **
 * @author xule
 */
class DOMMain extends Mixin(Modules) {
  /**
   * 链式调用，核心方法（保证每次链式调用生成的都是新的对象，防止多次调用后改变之前的结果）
   * @param {Array} context 上一步的上下文
   * @returns {DOMMain}
   */
  chain (context) {
    /**
     * dom实例
     * @type {DOMMain}
     */
    const dom = new DOMMain()
    dom.setContext(context)
    return dom
  }

  /**
   * 设置上下文
   * @param {Array} context
   */
  setContext (context) {
    this._context = context
  }

  /**
   * 获取上下文
   * @returns {Array}
   */
  context () {
    return this._context
  }

  /**
   * 获取对应上下文
   * @param {number} index 序号，没有返回全部
   * @returns {*}
   */
  get (index) {
    return typeof index !== 'undefined' ? this._context[index] : this._context
  }

  length () {
    return this._context ? this._context.length : 0
  }
}

/**
 * DOM
 * @param {*} selector 选择器，可以是任意对象
 * @returns {DOMMain}
 * @constructor
 */
function DOM (selector) {
  let m = new DOMMain()
  let context = document
  // 不存在selector
  if (!selector) {
    m.setContext([document.body])
  }
  else if (selector === window || selector === 'window') {
    m.setContext([window])
  }
  //  html标签代码
  else if (typeof selector === 'string' && selector.indexOf('<') > -1 && selector.indexOf('>') > -1) {
    context = Base.toNode(selector)
    m.setContext([context])
  }
  //  字符串
  else if (typeof selector === 'string') {
    m = m.findAll(selector, [context])
  }
  //  判断是否拥有上下文(其实是DOMMain的实例)
  else if (Base.hasContext(selector)) {
    m = selector
  }
  //  如果是数组
  else if (Base.isArray(selector)) {
    m = DOM.merge.apply(null, selector)
  }
  //  剩余的可能是节点对象
  else {
    context = selector.length && selector.length > 0 ? [...selector] : [selector]
    m.setContext(context)
  }

  return m
}

/**
 * 文档准备好后的事件
 * @param fn
 */
DOM.ready = function (fn) {
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function callback () {
      document.removeEventListener('DOMContentLoaded', callback, false)
      fn()
    }, false)
  }
  //  兼容IE
  else if (document.attachEvent) {
    document.attachEvent('onreadytstatechange', function callback () {
      if (document.readyState === 'complete') {
        document.detachEvent('onreadystatechange', callback)
        fn()
      }
    })
  }
  else if (document.lastChild === document.body) {
    fn()
  }
}

/**
 * 匹配选择器
 * @type {function}
 */
DOM.matches = Base.matches

/**
 * 是否是window对象
 * @param selector
 * @returns {boolean}
 */
DOM.isWindow = function (selector) {
  return selector === window || DOM(selector).get(0) === window
}

/**
 * 合并上下文
 * @params {...*} 上下文
 * @returns {DOMMain}
 */
DOM.merge = function () {
  const args = arguments
  let context = []
  for (let v of args) {
    context = Base.hasContext(v) ? context.concat(v.context()) : context.concat(DOM(v).context())
  }
  let m = new DOMMain()
  m.setContext([...new Set(context)])
  return m
}

export {DOM, Base}