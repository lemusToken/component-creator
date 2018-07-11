import Base from './base'

/**
 * 短点触事件
 */
export default class Tap extends Base {
  static once = false
  /**
   * 全局变量命名空间
    * @type {string}
   */
  static namespace = ''

  /**
   * 初始化
   * @param Event
   */
  constructor (Event) {
    super(Event)
    //  设置全局变量空间并缓存
    Tap.namespace = Tap.namespace || this.createCommonSpace()
    //  即便是被继承了，命名空间也不变
    this.setCommonNameSpace(Tap.namespace)
    /**
     * 桌面和手机的对应事件类型映射
     * @type {{touchstart: string, touchmove: string, touchend: string}}
     */
    this.map = {
      touchstart: 'mousedown',
      touchmove: 'mousemove',
      touchend: 'mouseup'
    }
    //  实际触发回调的事件类型
    //  系统中自带的事件
    this.setType('touchend.tap')
    this.data.delayTime = 200
    this.data.deltaX = 20
    this.data.deltaY = 20
    this.data.state = ''
  }

  /**
   * 初始化方法（只会初始化一次）
   */
  init () {
    //  事件是通用的，只注册一次
    if (Tap.once) return
    Tap.once = true
    const {start, move, end} = this.getType()
    this.Event.register(document.body, start, (e) => {
      const {x, y} = Tap.getOffset(e)
      this.data.startTime = Date.now()
      this.data.initX = x
      this.data.initY = y
      this.data.state = 'start'
    })
    this.Event.register(document.body, move, (e) => {
      if (this.data.state === 'start' || this.data.state === 'moving') {
        const {x, y} = Tap.getOffset(e)
        this.data.moveX = x - this.data.initX
        this.data.moveY = y - this.data.initY
        this.data.isMove = Math.abs(this.data.moveX) >= this.data.deltaX || Math.abs(this.data.moveY) >= this.data.deltaY
        this.data.state = 'moving'
      }
    })
    this.Event.register(document.body, end, (e) => {
      setTimeout(() => {
        this.data.state = 'end'
        this.data.isMove = false
        this.data.moveX = 0
        this.data.moveY = 0
        this.data.initX = 0
        this.data.initY = 0
      }, 0)
    })
  }

  /**
   * 运行判断方法（返回true时才会运行注册的回调函数）
   * @param e
   * @returns {boolean}
   */
  run (e) {
    return this.isTrigger(e) || (!this.data.isMove && Date.now() - this.data.startTime <= this.data.delayTime)
  }

  /**
   * 设置系统实际触发的事件类型
   * @param {string} type 事件类型
   */
  setType (type) {
    const ary = type.split('.', 2)
    ary[0] = this.map[ary[0]] ? this.map[ary[0]] : ary[0]
    this.type = ary.join('.')
  }

  /**
   * 获取类型
   * - 会根据客户端环境获得不同类型
   * @returns {{start: string, move: string, end: string}}
   */
  getType () {
    const keys = Object.keys(this.map)
    return Tap.isMobile() ? {
      start: keys[0],
      move: keys[1],
      end: keys[2]
    } : {
      start: this.map[keys[0]],
      move: this.map[keys[1]],
      end: this.map[keys[2]]
    }
  }

  /**
   * 获取坐标值
   * @param e
   * @returns {{x: Number, y: Number}}
   */
  static getOffset (e) {
    return e.targetTouches && e.targetTouches[0] ? {x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY} : {x: e.pageX, y: e.pageY}
  }

  /**
   * 判断是否是移动设备
   * @returns {boolean}
   */
  static isMobile () {
    const userAgent = navigator.userAgent.toLowerCase()
    return /Android/.test(userAgent) || /iPhone/.test(userAgent) || /iPad/.test(userAgent)
  }
}