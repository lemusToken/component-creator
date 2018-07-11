import Base from '../libs/base'

/**
 * cookie存储
 * @extends {Base}
 */
export default class WinCookie extends Base {
  /**
   * 初始化cookie对象
   */
  constructor () {
    super()
    /**
     * 存储对象
     * @type {{}}
     */
    this.engine = this.check() ? document.cookie : false
  }

  /**
   * 检查存储对象是否可用
   * @access public
   * @returns {boolean}
   */
  check () {
    return this.isDocument() && !!document.cookie
  }

  /**
   * 设置cookie数据
   * @access public
   * @param {string} key 键名
   * @param {string|object|boolean|number} val 数据
   * @param {number} [timeout=0] 超时时间，单位ms
   * @param {string} [path='/'] 路径
   * @param {string} [domain=''] 域名
   */
  set (key, val, timeout = 0, path = '/', domain = '') {
    this.setItem(key, val, timeout, path, domain)
  }

  /**
   * 获取cookie数据
   * @access public
   * @param {string} key 键名
   * @returns {*}
   */
  get (key) {
    return this.getItem(key)
  }

  /**
   * 删除cookie数据
   * @access public
   * @param {string} key 键名
   */
  remove (key) {
    document.cookie = key + '=; expires=Fri, 31 Dec 1999 23:59:59 GMT;'
  }

  /**
   * 设置cookie数据时的处理
   * @access protected
   * @param {string} key 键名
   * @param {string|object|boolean|number} val 数据
   * @param {number} [timeout=0]
   * @param {string} [path='/']
   * @param {string} [domain='']
   */
  setItem (key, val, timeout = 0, path = '/', domain = '') {
    let sCookie = key + '=' + encodeURIComponent(this.input(val))
    let expires = timeout

    if (expires && typeof expires === 'number') {
      const e = new Date()
      e.setTime(e.getTime() + timeout)
      expires = e.toUTCString()
    }

    sCookie += '; expires=' + expires + '; path=' + path

    if (domain === '.') {
      let host = window.location.host.replace(/:.*$/, '')
      //  检测ip
      if (!/^(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(host)) {
        let domainData = host.split('.')
        domainData.shift()
        domain = '.' + domainData.join('.')
        sCookie += '; domain=' + domain
      }
    }
    document.cookie = sCookie
  }

  /**
   * 获取cookie数据时的处理
   * @access protected
   * @param {string} key 键名
   * @return {*}
   */
  getItem (key) {
    const aCookie = this.engine.split('; ')

    for (let i = 0; i < aCookie.length; i++) {
      const aCrumb = aCookie[i].split('=')
      if (key === aCrumb[0]) return this.output(decodeURIComponent(aCrumb[1]))
    }
    return ''
  }
}