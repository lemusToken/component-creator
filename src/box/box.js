/**
 * 浮动层
 * @author xule
 */
export default class Box {
  /**
   * 初始化配置
   */
  constructor (config) {
    this.init(config)
  }

  init (config) {
    if (this.boxContainer) return
    /**
     * 配置
     * @access private
     * @type {object}
     */
    this.config = Box._initConfig(config)
    /**
     * box的最外层文档对象
     * @type {Element}
     */
    this.boxContainer = null
    this.setTemplate()
    this.setStyle()
    this.setPosition()
    this.close()
  }

  /**
   * 查询box中首个data-box=type的文档对象
   * @param {string} type 名称
   * @return {Element}
   */
  find (type) {
    return this.boxContainer.querySelector('[data-box=' + type + ']')
  }

  /**
   * 查询box中所有data-box=type的文档对象
   * @param {string} type 名称
   * @return {NodeList}
   */
  findAll (type) {
    return this.boxContainer.querySelectorAll('[data-box=' + type + ']')
  }

  /**
   * 打开box
   * @return Box
   */
  open () {
    this.setBoxShow()
    return this
  }

  /**
   * 关闭box
   * @return Box
   */
  close () {
    this.setBoxHidden()
    return this
  }

  /**
   * 重建box
   */
  create () {
    this.init(this.config)
    return this
  }

  /**
   * 销毁box
   */
  destroy () {
    if (!this.boxContainer) return
    this.boxContainer.parentNode.removeChild(this.boxContainer)
    this.boxContainer = null
    return this
  }

  /**
   * 获取box最外层文档对象
   * @return {Element}
   */
  getContainer () {
    return this.boxContainer
  }

  /**
   * 设置box垂直居中
   * @param {boolean} [isFixed=false] 默认absolute定位，isFixed=true为fix定位
   * @return Box
   */
  setCenter (isFixed = false) {
    this.boxContainer.style.position = isFixed ? 'fixed' : 'absolute'
    this.boxContainer.style.left = '50%'
    this.boxContainer.style.top = '50%'
    this.boxContainer.style.webkitTransform = 'translate(-50%, -50%)'
    this.boxContainer.style.transform = 'translate(-50%, -50%)'
    return this
  }

  clone (config = {}) {
    return new Box({
      ...this.config,
      ...config
    })
  }

  /**
   * 初始化默认配置
   * @access private
   * @param {object} config 配置
   * @return {object}
   */
  static _initConfig (config) {
    config.container = config.container || document.body
    config.position = config.position || []
    config.style = config.style || {}
    return {
      ...{
        container: document.body,
        position: [],
        style: null,
        template: ''
      },
      ...config
    }
  }

  /**
   * 设置模板
   * @return {Element}
   */
  setTemplate () {
    if (this.boxContainer) {
      this.boxContainer.outerHTML = this.config.template
    }
    let html = document.createElement('div')
    html.innerHTML = this.config.template
    this.boxContainer = this.config.container.appendChild(Box.getFirstChild(html))
    html = null
    return this.boxContainer
  }

  /**
   * 设置box样式
   * @access private
   */
  setStyle () {
    let style = ''
    if (this.config.style) {
      for (let i in this.config.style) {
        if (this.config.style.hasOwnProperty(i)) {
          style += i + ':' + this.config.style[i] + ';'
        }
      }
    }
    this.boxContainer.style = style
  }

  /**
   * 设置box位置transform
   * @access private
   */
  setPosition () {
    if (this.config.position[0] && this.config.position[1]) {
      this.boxContainer.style.webkitTransform = `translate(${this.config.position[0]}, ${this.config.position[1]})`
      this.boxContainer.style.transform = `translate(${this.config.position[0]}, ${this.config.position[1]})`
    }
  }

  /**
   * 设置box隐藏的方法，默认display:none，也可以在config.hidden中处理
   * @access private
   */
  setBoxHidden () {
    const box = this.boxContainer
    if (!box) return
    if (typeof this.config.hidden === 'function') {
      this.config.hidden(box)
    }
    else {
      box.style.display = 'none'
    }
  }

  /**
   * 设置box显示的方法，默认display:block，也可以在config.show中处理
   * @access private
   */
  setBoxShow () {
    const box = this.boxContainer
    if (!box) return
    if (typeof this.config.show === 'function') {
      this.config.show(box)
    }
    else {
      box.style.display = 'block'
    }
  }

  /**
   * 获取首个不是text的文档对象
   * @access private
   * @param {Element} elem 父级
   * @return {undefined|Element}
   */
  static getFirstChild (elem) {
    const childNode = elem.childNodes
    if (childNode.length === 0) return
    if (childNode.length === 1) return childNode[0]
    for (let v of childNode) {
      if (v.nodeType !== 3) {
        return v
      }
    }
  }
}