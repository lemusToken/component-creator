/**
 * 数据观察者
 * @author xule
 */
class Ob {
  /**
   * 成员初始化
   */
  constructor () {
    /**
     * 添加数据描述符的对象，数据读取
     * @type {{}}
     */
    this.data = {}
    /**
     * 连续调用setData，保证只在第一次添加数据描述符（defineProperty）
     * @access private
     * @type {{}}
     */
    this.qFlagSet = {}
    /**
     * 连续调用watch，保证只执行一次
     * @access private
     * @type {{}}
     */
    this.qFlagWatch = {}
    /**
     * 实际数据
     * @access private
     * @type {{}}
     */
    this.qVal = {}
    /**
     * watch队列
     * @access private
     * @type {{}}
     */
    this.qWatch = {}
  }

  /**
   * 监听数据变化
   * @param {string} name 数据名称
   * @param {function} fn 数据变更后的回调函数
   * @param {string} onceFlag 只添加一次的标识，如果标识相同将不会添加
   * @return Ob
   */
  watch (name, fn, onceFlag = '') {
    if (onceFlag) {
      if (this.qFlagWatch[name + '-' + onceFlag]) return
      this.qFlagWatch[name + '-' + onceFlag] = true
    }
    this.qWatch[name] = this.qWatch[name] || []
    this.qWatch[name].push(fn)
    return this
  }

  /**
   * 移除数据监听
   * @param {string} name 数据名
   */
  removeWatch (name) {
    if (this.qWatch[name]) {
      this.qWatch[name] = null
      this.qFlagSet[name] = null
    }
  }

  /**
   * 设置观察者以及设置值
   * @param {string} name 数据名
   * @param {*} val 数据值
   * @returns {Ob}
   */
  setData (name, val) {
    //  只执行一次
    if (!this.qFlagSet[name]) {
      Object.defineProperty(this.data, name, {
        get: () => {
          return this.qVal[name]
        },
        set: (val) => {
          if (Array.isArray(this.qWatch[name])) {
            for (let v of this.qWatch[name]) {
              try {
                v(val, name)
              }
              catch (e) {

              }
            }
          }
          this.qVal[name] = val
        }
      })
      this.qFlagSet[name] = true
    }
    this.data[name] = val
    return this
  }
}

/**
 * @type {Ob}
 */
export default new Ob() 