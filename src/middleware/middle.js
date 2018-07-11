/**
 * 中间件处理
 * @author xule
 */
const NEXT = 'next'

export default class MiddleWare {
  /**
   * 初始化，首次运行next
   * @param {function} fn 回调
   * @param {string} actName next函数的名称
   */
  constructor (fn, actName = NEXT) {
    /**
     * 中间件处理回调函数的队列
     * @type {Array}
     */
    this.queue = []
    //  初始化直接执行输入的函数
    this.use(fn, actName)
    setTimeout(() => {
      this.next({})
    }, 0)
  }

  /**
   * 添加中间价
   * @param {object|function} fn 回调
   * @param {string} actName next函数的名称
   * @return {MiddleWare}
   */
  use (fn, actName = NEXT) {
    fn = MiddleWare.parseWare(fn, actName)
    if (typeof fn !== 'function') return this
    this.queue.push(fn)
    return this
  }

  /**
   * 执行下一步
   * @access private
   * @param {object} context 上下文
   */
  next (context = {}) {
    if (this.queue && this.queue.length > 0) {
      let m = this.queue.shift()
      m(context, this.next.bind(this))
    }
  }

  /**
   * 解析中间件
   * - 中间件可以直接时函数
   * - 也可以是某个对象中的某个方法
   * @access private
   * @param {object|function} ware 中间件方法
   * @param {string} actName next的函数名称
   * @return {function}
   */
  static parseWare (ware, actName = NEXT) {
    if (!ware) return
    if (typeof ware[actName] === 'function') {
      return ware[actName].bind(ware)
    }
    if (typeof ware === 'function') {
      return ware
    }
  }
}