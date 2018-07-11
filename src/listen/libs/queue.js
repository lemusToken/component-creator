import Namespace from './namespace'

/**
 * 事件队列
 */
class Queue {
  /**
   * 初始化
   */
  constructor () {
    /**
     * 事件队列
     * @access private
     * @type {object}
     */
    this.queue = {}
  }

  /**
   * 添加队列
   * - 队列以主类型（去掉命名空间的事件类型）为键
   * - 键值为对应主类型的事件数组
   * @param {string} type 事件类型
   * @param {object} data 事件数据
   * @param {object} data.options 注册事件时添加的options
   * @returns {number} 队列id
   */
  add (type, data = {}) {
    const typeClean = Namespace.clean(type)
    this.queue[typeClean] = this.queue[typeClean] || []
    const id = this.queue[typeClean].length + 1
    data.type = type
    data.id = id
    data.options = data.options || {}
    this.queue[typeClean].push(data)
    return id
  }

  /**
   * 删除队列项
   * @param {string} type 事件类型
   * @param {Function} fn 如果函数存在，则返回true才能成功删除
   * @returns {object} 删除后的队列
   */
  remove (type, fn) {
    const typeClean = Namespace.clean(type)
    let q = this.getByType(type)
    const len = q.length
    let count = 0
    for (let i = 0; i < len; i++) {
      if (!q[i] || q[i].type === type) {
        let flag = true
        if (q[i] && typeof fn === 'function') {
          flag = fn(q[i])
        }
        if (flag) {
          q[i] = null
          count += 1
        }
      }
    }
    if (count === len) {
      this.queue[typeClean] = []
    }
    return this.queue[typeClean]
  }

  /**
   * 获取对应类型的队列数据
   * @param {string} type
   * @returns {Array}
   */
  getByType (type) {
    return this.queue[Namespace.clean(type)]
  }

  /**
   * 获取所有队列数据
   * @returns {object}
   */
  getAll () {
    return this.queue
  }
}

export default Queue