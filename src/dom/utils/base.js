/**
 * DOM基础类
 */
class Base {
  /**
   * 字符串转文档碎片
   * @param {string} html
   * @returns {DocumentFragment}
   */
  static toNode (html) {
    if (typeof html === 'object') return html
    let temp = document.createElement('div')
    temp.innerHTML = html
    // 碎片，防止频繁重排
    // 碎片在append到其它元素时，只会append子级
    const frag = document.createDocumentFragment()
    while (temp.firstChild) {
      frag.appendChild(temp.firstChild)
    }
    temp = null
    return frag
  }

  /**
   * 上下文转文档碎片
   * @param context
   * @returns {DocumentFragment}
   */
  static contextToNode (context) {
    let result = context
    if (Base.isArray(context)) {
      const frag = document.createDocumentFragment()
      for (let v of context) {
        frag.appendChild(v)
      }
      result = frag
    }
    return result
  }

  /**
   * 字符串或者文档碎片转真实文档节点对象（在文档树中的对象）
   * -  文档碎片添加到某个真实文档对象上后，无法直接获取
   * @param {Element} elem 父级文档对象
   * @param {string|DocumentFragment} html
   * @returns {Element}
   */
  static toRealNode (elem, html) {
    let result
    let node = html
    if (!elem || !html) return false
    if (Object.prototype.toString.call(html).indexOf('[object HTML') > -1) return html
    if (typeof node === 'string') {
      node = Base.toNode(node)
    }

    const timestamp = Date.parse(new Date())
    const n = '_data-' + timestamp + (Math.random() * 10000 | 0)
    let children = node.childNodes
    for (let i = 0; i < children.length; i++) {
      children[i].setAttribute(n, 1)
    }
    elem.appendChild(node)
    children = null
    let elemsReal = elem.querySelectorAll('[' + n + '="1"]')
    for (let i = 0; i < elemsReal.length; i++) {
      elemsReal[i].removeAttribute(n)
    }
    result = elemsReal.length === 1 ? elemsReal[0] : elemsReal
    elemsReal = null
    return result
  }

  /**
   * 节点预处理
   * @param node
   * @returns {*}
   */
  static nodePretreatment (node) {
    // 如果是字符串或者是文档碎片
    if (typeof node === 'string' || node.nodeType === 11) {
      node = Base.toNode(node)
    }
    // 如果是DOM对象实例
    else if (Base.hasContext(node)) {
      node = node.context()
    }
    return node
  }

  /**
   * 循环
   * @param selector
   * @param {function} fn 每一步循环的操作，返回true直接跳过，返回false直接跳出
   * @returns {Array}
   */
  static loop (selector, fn) {
    let r = []
    if (Base.maybeArray(selector)) {
      for (let v of selector) {
        let _r = fn(v)
        if (_r === false) break
        if (_r === true) continue
        _r && r.push(_r)
      }
    }
    else {
      r = fn(selector)
    }
    return r
  }

  /**
   * 判断是否含有上下文
   * @param selector
   * @returns {boolean}
   */
  static hasContext (selector) {
    return selector && typeof selector.context === 'function'
  }

  /**
   * 匹配选择器（Element.matches在各浏览器的兼容处理）
   * @param obj
   * @returns {function}
   */
  static matchSelector (obj) {
    return obj.matches || obj.webkitMatchesSelector || obj.mozMatchesSelector || obj.msMatchesSelector
  }

  /**
   * 文档对象匹配
   * @param obj
   * @param selector
   * @returns {boolean}
   */
  static matches (obj, selector) {
    let result = false
    let m
    if (!obj || !selector) return result
    //  如果obj具有上下文
    if (Base.hasContext(obj)) {
      const list = obj.context()
      let flag = false
      for (let v of list) {
        if (Base.matches(v, selector)) {
          flag = true
          break
        }
      }
      result = flag
    }
    //  如果selector具有上下文
    else if (Base.hasContext(selector)) {
      const list = selector.context()
      let flag = false
      for (let v of list) {
        if (Base.matches(v, obj)) {
          flag = true
          break
        }
      }
      result = flag
    }
    //  selector可能是通过document.getElement*获取的
    else if (typeof obj === 'object' && Base.maybeArray(selector)) {
      let flag = false
      for (let v of selector) {
        if (Base.matches(v, obj)) {
          flag = true
          break
        }
      }
      result = flag
    }
    else if (typeof obj === 'string' && typeof selector === 'object') {
      m = Base.matchSelector(selector)
      result = m && m.call(selector, obj)
    }
    else if (typeof obj === 'object' && typeof selector === 'object') {
      result = obj === selector
    }
    else {
      m = Base.matchSelector(obj)
      result = m && m.call(obj, selector)
    }
    return result
  }

  /**
   * 是否是节点列表
   * @param obj
   * @returns {boolean}
   */
  static isNodeList (obj) {
    return Object.prototype.toString.call(obj) === '[object NodeList]' || Object.prototype.toString.call(obj) === '[object HTMLCollection]'
  }

  /**
   * 是否是节点
   * @param obj
   * @returns {boolean}
   */
  static isNode (obj) {
    return Object.prototype.toString.call(obj).indexOf('[object HTML') > -1
  }

  /**
   * 可能是html字符串
   * @param obj
   * @returns {boolean}
   */
  static isLikeHtml (obj) {
    return typeof obj === 'string' && obj.match(/<.+>/)
  }

  /**
   * 是否是数组
   * @param obj
   * @returns {boolean}
   */
  static isArray (obj) {
    return (typeof Array.isArray === 'function' && Array.isArray(obj)) || Object.prototype.toString.call(obj) === '[object Array]'
  }

  /**
   * 是否类数组（数组以及节点数组）
   * @param obj
   * @returns {boolean}
   */
  static maybeArray (obj) {
    return Base.isArray(obj) || Base.isNodeList(obj)
  }

  /**
   * 是否是对象
   * @param obj
   * @returns {boolean}
   */
  static isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  /**
   * 是否是数字
   * @param obj
   * @returns {boolean}
   */
  static isNumber (obj) {
    return Object.prototype.toString.call(obj) === '[object Number]'
  }

  /**
   * 是否是Set对象
   * @param obj
   * @returns {boolean}
   */
  static isSet (obj) {
    return Object.prototype.toString.call(obj) === '[object Set]'
  }

  /**
   * 是否是空值
   * - Boolean转化为false
   * - 类数组或者数组，length为0
   * - 数字0
   * - 对象为{}
   * @param obj
   * @returns {boolean}
   */
  static isEmpty (obj) {
    if (!obj) return true
    if (this.isNumber(obj)) {
      return obj === 0
    }
    else if (this.isArray(obj) || this.isNodeList(obj)) {
      return obj.length === 0
    }
    else if (this.isObject(obj)) {
      let flag = true
      for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
          flag = false
          break
        }
      }
      return flag
    }
    else {
      return obj.length === 0
    }
  }
}

export default Base