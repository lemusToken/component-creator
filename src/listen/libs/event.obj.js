//  事件的对象处理
/**
 * 事件冒泡控制
 * @type {Symbol}
 */
const BUBBLE = Symbol('listenBubble')
/**
 * 是否是程序触发
 * @type {Symbol}
 */
const TRIGGER = Symbol('listenTrigger')
/**
 * 事件的完整类型（包括命名空间）
 * @type {Symbol}
 */
const TYPE = Symbol('listenType')

export default {
  /**
   * 初始化事件对象
   * @param {Event} e 事件对象
   * @param {boolean} [bubble=true] 是否允许冒泡
   * @param {boolean} [trigger=false] 是否是程序触发
   * @returns {Event}
   */
  init (e, bubble = true, trigger = false) {
    e[BUBBLE] = bubble
    e[TRIGGER] = trigger
    return e
  },
  /**
   * 循序冒泡
   * @param {Event} e 事件对象
   */
  enableBubble (e) {
    e[BUBBLE] = true
  },
  /**
   * 禁止冒泡
   * @param {Event} e 事件对象
   */
  disableBubble (e) {
    e[BUBBLE] = false
  },
  /**
   * 设置为程序触发
   * @param {Event} e 事件对象
   */
  enableTrigger (e) {
    e[TRIGGER] = true
  },
  /**
   * 设置为非程序触发
   * @param {Event} e 事件对象
   */
  disableTrigger (e) {
    e[TRIGGER] = false
  },
  /**
   * 设置完整事件类型
   * @param {Event} e 事件对象
   * @param {string} type
   */
  setType (e, type) {
    e[TYPE] = type
  },
  /**
   * 获取完整事件类型
   * @param {Event} e 事件对象
   * @returns {string}
   */
  getType (e) {
    return e[TYPE]
  },
  /**
   * 判断类型是否相等
   * @param {Event} e 事件对象
   * @param {string} type
   * @returns {boolean}
   */
  isType (e, type) {
    return e[TYPE] === type
  },
  /**
   * 是否禁止了冒泡
   * @param {Event} e 事件对象
   * @returns {boolean}
   */
  isCancelBubble (e) {
    return e[BUBBLE] === false
  },
  /**
   * 是否是程序触发
   * @param {Event} e 事件对象
   * @returns {boolean}
   */
  isTrigger (e) {
    return e[TRIGGER] === true
  },
  /**
   * 重置事件对象
   * @param {Event} e 事件对象
   * @returns {Event}
   */
  reset (e) {
    return this.init(e)
  }
}