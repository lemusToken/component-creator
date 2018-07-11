import Base from '../utils/base'

/**
 * 添加文档对象
 * @author
 */
class DOMAdd {
  /**
   * 在selector的子级末尾添加
   * @param html
   * @param selector
   * @return {*}
   */
  append (html, selector = this._context) {
    Base.loop(selector, (v) => {
      return this.appendOne(v, html)
    })
    return this
  }

  /**
   * 在selector的子级首位添加
   * @param html
   * @param selector
   * @return {*}
   */
  prepend (html, selector = this._context) {
    Base.loop(selector, (v) => {
      return this.prependOne(v, html)
    })
    return this
  }

  /**
   * 在selector前添加
   * @param html
   * @param selector
   * @return {*}
   */
  before (html, selector = this._context) {
    Base.loop(selector, (v) => {
      return this.beforeOne(v, html)
    })
    return this
  }

  /**
   * 在selector后添加
   * @param html
   * @param selector
   * @return {*}
   */
  after (html, selector = this._context) {
    Base.loop(selector, (v) => {
      return this.afterOne(v, html)
    })
    return this
  }

  /**
   * selector包含在输入的元素中
   * @param html
   * @param selector
   */
  wrap (html, selector = this._context) {
    Base.loop(selector, (v) => {
      let node = Base.nodePretreatment(html)
      const parent = v.parentNode
      //  查找元素后面是否有同级元素
      const next = v.nextSibling
      node.firstChild.appendChild(v)
      if (next) {
        //  在该元素前插入node
        parent.insertBefore(node, next)
      }
      else {
        //  在父级中插入
        parent.appendChild(node)
      }
    })
    return this
  }

  /**
   * 在elem的子级末尾添加
   * @access private
   * @param elem
   * @param html
   * @returns {*}
   */
  appendOne (elem, html) {
    let node = html
    node = Base.nodePretreatment(node)
    // 如果上下文是文档碎片
    if (elem.nodeType === 11) {
      elem = elem.firstChild
    }
    Base.loop(node, v => elem.appendChild(v))
  }

  /**
   * 在elem的子级首位添加
   * @access private
   * @param elem
   * @param html
   * @returns {*}
   */
  prependOne (elem, html) {
    let firstChild = elem.nodeType === 11 ? elem.firstChild.firstChild : elem.firstChild
    //  如果存在子级，则在首个子集之前添加
    if (firstChild) {
      this.beforeOne(firstChild, html)
    }
    //  否则，直接添加
    else {
      this.appendOne(elem, html)
    }
  }

  /**
   * 在elem前添加
   * @access private
   * @param elem
   * @param html
   */
  beforeOne (elem, html) {
    let node = html
    let parent = elem.parentNode
    node = Base.nodePretreatment(node)
    if (elem.nodeType === 11) {
      elem.insertBefore(node, elem.firstChild)
    }
    else if (parent) {
      Base.loop(node, v => {
        parent.insertBefore(v, elem)
      })
    }
  }

  /**
   * 在elem后添加
   * @access private
   * @param elem
   * @param html
   */
  afterOne (elem, html) {
    let node = html
    let parent = elem.parentNode
    let siblingNext = elem.nextSibling
    node = Base.nodePretreatment(node)
    if (elem.nodeType === 11) {
      elem.appendChild(node)
    }
    else if (parent) {
      Base.loop(node, (v) => {
        if (siblingNext) {
          parent.insertBefore(v, siblingNext)
        }
        else {
          parent.appendChild(v)
        }
      })
    }
  }
}

export default DOMAdd