import Base from '../utils/base'

/**
 * 移除文档对象
 */
class DOMRemove {
  /**
   * 删除被选元素
   * @param selector
   */
  remove (selector = this._context) {
    Base.loop(selector, v => v && v.parentNode && v.parentNode.removeChild(v))
  }

  /**
   * 清空被选元素
   * @param selector
   * @return {*}
   */
  empty (selector = this._context) {
    Base.loop(selector, v => { v.innerHTML = '' })
    return this
  }
}

export default DOMRemove