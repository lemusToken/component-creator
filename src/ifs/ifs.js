/**
 * 数值类型判断
 * @author xule
 */
export default {
  /**
   * 判断是否是null
   * @param {*} val
   * @returns {boolean}
   */
  isNull (val) {
    return val === null
  },
  /**
   * 数据类型验证
   * @param {string} type Object,Boolean,Number,String,Function,Array,Date,RegExp,Object,NodeList,HTMLCollection,Map,WeakMap,Set,WeakSet等等
   * @param {*} val 待验证的值
   * @returns {boolean}
   */
  is (type, val) {
    return Object.prototype.toString.call(val) === `[object ${type}]`
  },
  /**
   * 判断是否是DOM的列表对象
   * @param {*} val
   * @returns {boolean}
   */
  isNodeList (val) {
    return this.is('NodeList', val) || this.is('HTMLCollection', val)
  },
  /**
   * 判断是否是DOM HTML对象
   * @param {*} val
   * @returns {boolean}
   */
  isNode (val) {
    return Object.prototype.toString.call(val).indexOf('[object HTML') > -1
  },
  /**
   * 判断是否有原型链
   * @param {*} val
   * @returns {boolean}
   */
  isPlainObj (val) {
    return val && (val.constructor === Object || val.constructor === undefined)
  },
  /**
   * 判断可能是数组类型
   * @param {*} val
   * @returns {boolean}
   */
  maybeArray (val) {
    return this.is('Array', val) || this.isNodeList(val)
  },
  /**
   * 判断空，空值、{}、[]、null、undefined、0、''均为空
   * @param {*} val
   * @returns {boolean}
   */
  realEmpty (val) {
    if (!val) return true
    if (this.is('Number', val)) {
      return val === 0
    }
    else if (this.maybeArray(val)) {
      return val.length === 0
    }
    else if (this.is('Object', val)) {
      let flag = true
      for (let i in val) {
        if (val.hasOwnProperty(i)) {
          flag = false
          break
        }
      }
      return flag
    }
    else {
      return val.length === 0
    }
  }
}