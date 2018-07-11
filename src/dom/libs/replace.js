import Base from '../utils/base'

/**
 * 替换文档对象
 */
class DOMReplace {
  /**
   * 替换被选元素
   * @param html
   * @param selector
   */
  replaceWith (html, selector = this._context) {
    Base.loop(selector, (v) => {
      let node = html
      if (!v || !node) return false
      if (typeof node === 'function') {
        node = this.replaceWith(v, node())
      }
      else {
        node = Base.nodePretreatment(node)
      }
      //  将要替换成的元素转化成一个碎片文档对象
      //  防止此类场景信息丢失：用自身一部分替换自身
      v.parentNode.replaceChild(Base.contextToNode(node), v)
    })
  }
}

export default DOMReplace