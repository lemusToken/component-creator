import Base from '../libs/base'

/**
 * localStorage存储
 * @extends {Base}
 */
export default class WinLocal extends Base {
  /**
   * 初始化localStorage对象
   */
  constructor () {
    super()
    /**
     * 存储对象
     * @type {localStorage}
     */
    this.engine = this.check() ? window.localStorage : false
  }

  /**
   * 检查存储对象是否可用
   * @access public
   * @returns {boolean}
   */
  check () {
    return this.isWindow() && !!window.localStorage
  }

  /**
   * 设置localStorage数据
   * @access public
   * @param {string} key 键名
   * @param {string|object|boolean|number} val 数据
   * @param {number} [timeout=0] 超时时间，单位ms
   */
  set (key, val, timeout = 0) {
    if (timeout > 0) {
      this.setWithTime(key, timeout)
    }
    this.setItem(key, val)
  }

  /**
   * 获取localStorage数据
   * @access public
   * @param {string} key 键名
   * @returns {*}
   */
  get (key) {
    if (!this.getWithTime(key)) {
      return null
    }
    return this.getItem(key)
  }

  /**
   * 删除localStorage数据
   * @access public
   * @param {string} key 键名
   */
  remove (key) {
    this.engine.removeItem(key)
  }

  /**
   * 设置localStorage数据时的处理
   * @access protected
   * @param {string} key 键名
   * @param {string|object|boolean|number} val 数据
   */
  setItem (key, val) {
    this.engine.setItem(key, this.input(val))
  }

  /**
   * 获取localStorage数据时的处理
   * @access protected
   * @param {string} key 键名
   * @return {*}
   */
  getItem (key) {
    return this.output(this.engine.getItem(key))
  }
}