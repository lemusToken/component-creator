import EventObj from '../libs/event.obj'

export default class Base {
  /**
   * 公用数据仓库，this.data的引用
   * @type {{}}
   */
  static commonData = {}

  /**
   * 初始化
   * @param Event
   */
  constructor (Event) {
    this.type = ''
    /**
     * 全局变量
     * @type {{}}
     */
    this.data = {}
    /**
     * 当前全局变量命名空间
     * @type {string}
     */
    this.commonNamespace = ''
    /**
     * libs下的Event对象
     * @type {Event}
     */
    this.Event = Event
  }

  /**
   * 初始化
   * @override
   */
  init () {}

  /**
   * 运行条件
   * @override
   */
  run () {
    return true
  }

  /**
   * 设置this.data的引用
   * @param namespace
   */
  setCommonNameSpace (namespace) {
    if (namespace) {
      this.commonNamespace = this.commonNamespace || namespace
      Base.commonData[namespace] = Base.commonData[namespace] || {}
      //  引用
      this.data = Base.commonData[namespace]
    }
  }

  /**
   * 生成唯一的命名空间
   * @param {string} ext 后缀字符串
   * @returns {string}
   */
  createCommonSpace (ext = '') {
    return Date.now() + '' + Math.random() * 1000000 | 0 + ext
  }

  setCommonData (key, val) {
    if (typeof key === 'object') {
      if (this.commonNamespace) {
        Base.commonData[this.commonNamespace] = {...Base.commonData[this.commonNamespace], ...key}
      }
      else {
        Base.commonData = {...Base.commonData, ...key}
      }
    }
    else {
      if (this.commonNamespace) {
        Base.commonData[this.commonNamespace][key] = val
      }
      else {
        Base.commonData[key] = val
      }
    }
  }

  getCommonData (key) {
    if (this.commonNamespace) {
      return key ? Base.commonData[this.commonNamespace][key] : Base.commonData[this.commonNamespace]
    }
    else {
      return key ? Base.commonData[key] : Base.commonData
    }
  }

  getType () {
    return this.type
  }

  isTrigger (e) {
    return EventObj.isTrigger(e)
  }
}