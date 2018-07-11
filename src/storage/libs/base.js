import Ifs from '../../ifs'

/**
 * 数据存储类
 * window.localStorage;window.sessionStorage;cookie;{}
 * @returns
 * @author xule
 */
export default class Base {
  /**
   * 初始化
   */
  constructor () {
    /**
     * 常量
     * @type {{常量名: '常量值'}}
     */
    this.key = {
      timeout: '_TIMEOUT_'
    }
    /**
     * 实际使用的存储对象
     * @type {boolean|object}
     */
    this.engine = false
  }

  /**
   * 判断是否是浏览器环境
   * @access public
   * @returns {boolean}
   */
  isWindow () {
    return typeof window !== 'undefined'
  }

  /**
   * 判断是否是文档环境
   * @access public
   * @returns {boolean}
   */
  isDocument () {
    return typeof document !== 'undefined'
  }

  /**
   * 判断是否是微信小程序
   * @access public
   * @returns {boolean}
   */
  isWxMini () {
    return typeof wx !== 'undefined' && typeof getApp === 'function'
  }

  /**
   * @abstract
   */
  check () {}

  /**
   * @abstract
   */
  set () {}

  /**
   * @abstract
   */
  get () {}

  /**
   * @abstract
   */
  remove () {}

  /**
   * @abstract
   * @access protected
   */
  setItem () {}

  /**
   * @abstract
   * @access protected
   */
  getItem () {}

  /**
   * 输入数据处理
   * @access protected
   * @param {*} val
   * @returns {*}
   */
  input (val) {
    return val ? JSON.stringify(val) : val
  }

  /**
   * 输出数据处理
   * @access protected
   * @param {*} val
   * @returns {*}
   */
  output (val) {
    return Ifs.realEmpty(val) ? val : JSON.parse(val)
  }

  /**
   * 键名称处理，添加常量
   * @access protected
   * @param {string} type 常量名
   * @param {string} str 输入的字符串
   * @returns {string}
   */
  keyed (type, str) {
    return this.key[type] ? str + this.key[type] : str
  }

  /**
   * 有超时时间时的数据设置
   * @access protected
   * @param {string} key 键名
   * @param {number} time 超时时间，单位ms
   */
  setWithTime (key, time) {
    let keyTime = this.keyed('timeout', key)
    let now = new Date().getTime()
    let storedTime = this.getItem(keyTime)
    if (!storedTime) {
      this.setItem(keyTime, now + time)
    }
  }

  /**
   * 有超时时间时的数据获取
   * @access protected
   * @param {string} key 键名
   */
  getWithTime (key) {
    let now = new Date().getTime()
    let keyTime = this.keyed('timeout', key)
    let storedTime = this.getItem(keyTime)
    //  超时
    if (storedTime && now > storedTime) {
      this.remove(key)
      this.remove(keyTime)
      //  已过期
      return false
    }
    //  未过期
    return true
  }
}