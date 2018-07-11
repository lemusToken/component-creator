import Base from '../utils/base'

/**
 * 查询文档对象
 * @author xule
 */
class DOMSelect {
  /**
   * 单次查询模式
   * @type {string}
   * @const
   */
  static SINGLE = 'SINGLE'
  /**
   * 多次查询模式
   * @type {string}
   * @const
   */
  static MULTIPLY = 'MULTIPLY'

  /**
   * 单次查询
   * 首次调用查询父级是document，多次查询父级为上一次查询的文档对象
   * @param {string} condition 查询条件
   * @param {Array} [context=this._context] 上一次的查询结果
   * @return {DOMSelect}
   */
  find (condition, context = this._context) {
    if (context) {
      return this.findByContent(condition, context)
    }
    return this.chain(this.query(condition, DOMSelect.SINGLE, null))
  }

  /**
   * 单次查询，以上一次查询结果为父级进行查询
   * @param {string} condition 查询条件
   * @param {Array} [context=this._context] 上一次的查询结果
   * @return {DOMSelect}
   */
  findByContent (condition, context = this._context) {
    return this.chain(this.queryByContent(condition, context))
  }

  /**
   * 多次查询
   * 首次调用查询父级是document，多次查询父级为上一次查询的文档对象
   * @param {string} condition 查询条件
   * @param {Array} [context=this._context] 上一次的查询结果
   * @return {DOMSelect}
   */
  findAll (condition, context = this._context) {
    if (context) {
      return this.findAllByContent(condition, context)
    }
    return this.chain(this.query(condition, DOMSelect.MULTIPLY, null))
  }

  /**
   * 多次查询，以上一次查询结果为父级进行查询
   * @param {string} condition 查询条件
   * @param {Array} [context=this._context] 上一次的查询结果
   * @return {DOMSelect}
   */
  findAllByContent (condition, context = this._context) {
    return this.chain(this.queryByContent(condition, context, DOMSelect.MULTIPLY))
  }

  /**
   * 查找首个子集
   * @param {Array} [context=this._context] 上一次的查询结果
   * @return {DOMSelect}
   */
  child (context = this._context) {
    let result = []
    if (Base.maybeArray(context)) {
      for (let v of context) {
        if (!v.childNodes) continue
        result = result.concat([...v.childNodes])
      }
    }
    else if (context) {
      result = result.concat([...context.childNodes])
    }
    return this.chain(result.filter(el => el.nodeType !== 3))
  }

  /**
   * 查找所有子集
   * @param {Array} [context=this._context] 上一次的查询结果
   * @return {DOMSelect}
   */
  children (context = this._context) {
    function fn (context) {
      let result = this.child(context).context()
      for (let v of result) {
        result = result.concat(fn.call(this, v))
      }
      return result
    }
    return this.chain(fn.call(this, context))
  }

  /**
   * 查找首个父集
   * @param {Array} [context=this._context] 上一次的查询结果
   * @return {DOMSelect}
   */
  parent (context = this._context) {
    let result = new Set()
    if (Base.maybeArray(context)) {
      for (let v of context) {
        if (!v.parentNode || v.parentNode.nodeType === 9) continue
        result.add(v.parentNode)
      }
    }
    else if (context && context.parentNode) {
      result.add(context.parentNode)
    }
    return this.chain([...result])
  }

  /**
   * 查找所有父集
   * @param {Array} [context=this._context] 上一次的查询结果
   * @return {DOMSelect}
   */
  parentsAll (context = this._context) {
    function fn (context) {
      let result = this.parent(context).context()
      for (let v of result) {
        result = result.concat(fn.call(this, v))
      }
      return result
    }
    let vv = new Set(fn.call(this, context))
    return this.chain([...vv])
  }

  /**
   * 判断是否存在指定父级
   * @param parent
   * @param context
   * @return {boolean}
   */
  hasParent (parent, context = this._context) {
    let parents = this.parentsAll(context)
    let result = false
    if (!parents || !parents.context()) return result
    parents = parents.context()
    if (Base.maybeArray(parent)) {
      for (let v of parent) {
        if (parents.indexOf(v) > -1) return true
      }
    }
    else {
      return parents.indexOf(parent) > -1
    }
  }

  /**
   * 查找所有兄弟集合
   * @param {Array} [context=this._context] 上一次的查询结果
   * @return {DOMSelect}
   */
  siblings (context = this._context) {
    let result = []
    if (Base.maybeArray(context)) {
      for (let v of context) {
        result = result.concat(this.parent(v).child().context())
      }
    }
    else if (context) {
      result = this.parent(context).child().context()
    }
    let vv = new Set(result)
    return this.chain([...vv])
  }

  /**
   * 从document中查询文档对象
   * @param {string} build 选择器类型实例
   * @param {string} mode 查询模式
   * @param {object} parent 文档对象
   * @return {string|Array}
   */
  query (build, mode = DOMSelect.SINGLE, parent = document) {
    let result
    if (!build || !parent) return result
    if (Base.isNode(build)) {
      if (this.hasParent(parent, build)) {
        result = [build]
      }
      return result
    }
    // 去掉两边空格
    if (build.indexOf(' ') === 0 || build.lastIndexOf(' ') === build.length - 1) {
      build = build.replace(/^\s+|\s+$/g, '')
    }
    // 如果是id的表示式
    if (build.indexOf('#') === 0 && !build.match(/[\s>]/)) {
      mode = DOMSelect.SINGLE
    }
    if (mode === DOMSelect.SINGLE) {
      result = parent.querySelector(build)
    }
    else if (mode === DOMSelect.MULTIPLY) {
      result = parent.querySelectorAll(build)
    }
    return result
  }

  /**
   * 从上一次查询结果中查询文档对象
   * @param {string} build 选择器类型实例
   * @param {Array} [context=this._context] 上一次的查询结果
   * @param {string} mode 查询模式
   * @return {Array}
   */
  queryByContent (build, context = this._context, mode = DOMSelect.SINGLE) {
    let vv = null
    let result = []
    let ctx
    if (Base.hasContext(build)) {
      ctx = build.context()
    }
    else if (Base.maybeArray(build)) {
      ctx = build
    }
    else if (Base.isNode(build)) {
      ctx = [build]
    }
    if (ctx) {
      for (let v of ctx) {
        if (this.hasParent(context, v)) {
          result.push(v)
        }
      }
      return result
    }
    ctx = Base.maybeArray(context) ? context : [context]
    if (ctx) {
      for (let v of ctx) {
        vv = this.query(build, mode, v)
        if (Base.isEmpty(vv)) continue
        if (Base.maybeArray(vv)) {
          result = result.concat([...vv])
        }
        else {
          result.push(vv)
        }
      }
    }
    return result
  }

  /**
   * 从结果集中过滤数据
   * @param {string} condition 选择器
   * @param {Array} [context=this._context] 上一次的查询结果
   * @return {DOMSelect}
   */
  filter (condition, context = this._context) {
    this._context = context.filter(el => Base.matches(el, condition))
    return this
  }

  /**
   * 循环查询到的元素
   * @param fn
   * @param context
   */
  each (fn, context = this._context) {
    if (Base.isArray(context)) {
      for (let i = 0; i < context.length; i++) {
        const v = context[i]
        fn.call(v, i)
      }
    }
    else if (context) {
      fn.call(context, context)
    }
  }
}

export default DOMSelect