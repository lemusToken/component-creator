import Base from '../libs/base'

/**
 * 普通存储
 * @extends {Base}
 */
export default class WinLocal extends Base {
  /**
   * 初始化普通对象
   */
  constructor () {
    super()
    /**
     * 存储对象
     * @type {{}}
     */
    this.engine = {}
  }

  /**
   * 检查存储对象是否可用
   * @access public
   * @returns {boolean}
   */
  check () {
    return true
  }

  /**
   * 设置数据
   * @access public
   * @param {string} key
   * @param {*} val 任意数据
   */
  set (key, val) {
    this.setItem(key, val)
  }

  /**
   * 获取数据
   * @access public
   * @param {string} key
   * @returns {*}
   */
  get (key) {
    return this.getItem(key)
  }

  /**
   * 删除数据
   * @param {string} key
   */
  remove (key) {
    this.engine[key] = null
  }

  /**
   * 设置数据处理
   * @access protected
   * @param {string} key
   * @param {*} val
   */
  setItem (key, val) {
    this.engine[key] = val
  }

  /**
   * 获取数据处理
   * @access protected
   * @param {string} key
   * @return {*}
   */
  getItem (key) {
    return this.engine[key]
  }
}