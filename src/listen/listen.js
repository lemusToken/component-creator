import {DOM} from '../dom/index'
import Queue from './libs/queue'
import Event from './libs/event'
import EventObj from './libs/event.obj'
import Namespace from './libs/namespace'
import {throttle, debounce, frame} from '../throttle/index'
import Extend from './libs/extend'

/**
 * 事件管理，在任何情况下都能够保证正确的冒泡顺序
 * - 事件的注册、注销
 * - 自定义冒泡
 * - 节流控制
 * @author xule
 */
class Listen {
  /**
   * 初始化依赖
   */
  constructor () {
    /**
     * 扩展事件对象
     * @access private
     * @type {Extend}
     */
    this.extend = new Extend()
    /**
     * 实际注册到元素上的事件队列，用于命名空间匹配，注销事件
     * @access private
     * @type {Queue}
     */
    this.registerList = new Queue()
    /**
     * 等待运行的事件回调队列，事件触发后回调函数不会立即执行，而是先进入队列（不能冒泡的事件例如scroll除外，立即执行）
     * @access private
     * @type {Array}
     */
    this.runList = []
    /**
     * 等待队列是否正在运行，保证runList队列只执行一次
     * @access private
     * @type {boolean}
     */
    this.running = false
    /**
     * 已经运行过的对象事件的target，target为实际对象
     * @access private
     * @type {Array}
     */
    this.hasRunTargets = []
    /**
     * 最终执行的回调函数队列，队列项都是实际回调函数处理后的高阶函数
     * @access private
     * @type {Array}
     */
    this.callbacksQueue = []
  }

  /**
   * 设置冒泡
   * @param {Event} e 事件对象
   */
  static enableBubble (e) {
    EventObj.enableBubble(e)
  }

  /**
   * 设置禁止冒泡
   * @param {Event} e 事件对象
   */
  static cancelBubble (e) {
    EventObj.disableBubble(e)
  }

  /**
   * 注册事件
   * - 当selector是函数时，默认将事件注册到body上
   * - 当type用空格隔开，会对以空格作为分隔符的所有项进行注册
   * - 如果是程序触发时，触发的事件类型必须和注册时的完整类型一致
   * @param {string} type 事件类型，与原生事件相同，可像jQuery一样添加命名空间[类型.空间名]
   * @param {string|DOM|HTMLElement} selector 可以是css查询表达式、DOM()对象、文档对象
   * @param {function} fn 方法
   * @param {object} options 配置
   * @param {string} options.container 实际注册事件的元素
   * @param {boolean} options.preventDefault 禁止默认事件
   * @param {boolean} options.frame 开启节流，见throttle模块
   * @param {number} options.throttle 开启节流，见throttle模块，单位ms
   * @param {number} options.debounce 开启节流，见throttle模块，单位ms
   * @param {boolean} options.passive passive为true，则preventDefault()无效，可用于优化滚轮事件
   */
  on (type, selector, fn, options = {}) {
    const self = this
    if (type.indexOf(' ') > -1) {
      this.onMulti(type.split(' '), selector, fn, options)
      return
    }
    //  可变参数解析
    if (typeof selector === 'function') {
      fn = selector
      selector = document.body
    }
    //  获取扩展类实例（例如处理tap等事件的类）
    const {realType, extend, fullType, cleanType} = this.extend.create(type, {Event})
    //  需要注册事件的文档对象
    let container = options.container ? DOM(options.container).get() : DOM(selector).get()
    //  实际执行的回调方法
    const realCall = function (e) {
      //  获取正确的触发对象
      let target = self._getTargetTriggerElem(this, e, options.container, selector)
      if (!target) return
      //  如果是程序触发，type类型要与完整类型(带命名空间)一致
      if (EventObj.isTrigger(e) && !EventObj.isType(e, type)) return
      //  延迟触发
      self._delayCallbacks(extend, e, {
        fn,
        options,
        target,
        type: fullType,
        cleanType,
        selector
      })
    }
    //  实际注册的方法
    let realRegister = null
    //  节流
    for (let v of container) {
      if (options.frame) {
        realRegister = frame(realCall)
      }
      else if (options.throttle) {
        realRegister = throttle(realCall, options.throttle)
      }
      else if (options.debounce) {
        realRegister = debounce(realCall, options.debounce)
      }
      else {
        realRegister = realCall
      }
      //  实际注册的事件类型与回调队列中的对应成员绑定
      this.registerList.add(realType, {
        fullType,
        registeredElem: v,
        selector,
        fn: realRegister,
        options
      })
      //  注册事件
      Event.register(v, realType, realRegister, options)
    }
  }

  /**
   * 注销事件
   * @param {string} type 事件类型
   * @param {string|DOM|HTMLElement} selector 可以是css查询表达式、DOM()对象、文档对象
   */
  off (type, selector) {
    if (type.indexOf(' ') > -1) {
      this.offMulti(type.split(' '), selector)
      return
    }
    const {realType} = this.extend.create(type, {Event})

    //  删除事件
    const $elem = DOM(selector)
    const elems = $elem.get()
    const registered = this.registerList.getByType(realType)
    for (let v of elems) {
      for (let i = 0; i < registered.length; i++) {
        let vv = registered[i]
        if (!vv || vv.fullType !== type) continue
        if (vv.registeredElem === v) {
          //  删除注册的事件
          Event.unregister(v, vv.type, vv.fn)
          registered[i] = null
        }
        else if (vv.options.container && $elem.hasParent(vv.registeredElem)) {
          //  删除注册的事件
          Event.unregister(vv.registeredElem, vv.type, vv.fn)
          registered[i] = null
        }
      }
    }
  }

  /**
   * 触发事件
   * @param {string} type 事件类型
   * @param {string|DOM|HTMLElement} elem 可以是css查询表达式、DOM()对象、文档对象
   * @param {object} params 事件注册时回调函数需要的参数
   */
  trigger (type, elem, params) {
    this.eventTrigger(elem, type, params)
  }

  /**
   * 触发后立即注销事件，参数与on等同
   * @param type
   * @param selector
   * @param fn
   * @param options
   */
  once (type, selector, fn, options = {}) {
    options.once = true
    this.on(type, selector, fn, options)
  }

  /**
   * @access private
   */
  onMulti (types, selector, fn, options) {
    for (let v of types) {
      if (!v) continue
      this.on(v, selector, fn, options)
    }
  }

  /**
   * @access private
   */
  offMulti (types, selector) {
    for (let v of types) {
      if (!v) continue
      this.off(v, selector)
    }
  }

  /**
   * @access private
   */
  eventTrigger (elem, type, params) {
    if (typeof elem === 'string') {
      elem = DOM(elem).get(0)
    }
    if (!elem) return
    const {realType, fullType} = this.extend.create(type, {Event})
    let event = Event.createEvent(realType, params)
    event = EventObj.init(event, true, true)
    EventObj.setType(event, fullType)
    elem.dispatchEvent(event)
  }

  /**
   * 核心方法，事件触发后不会立即执行回调函数，而是先加入到运行队列中
   * @access private
   * @param {object} inst 对应类型的扩展事件实例
   * @param e
   * @param {object} data 事件数据
   */
  _delayCallbacks (inst, e, data) {
    const instRun = inst && inst.run ? inst.run(e) : null
    const fn = () => {
      EventObj.setType(e, data.type)
      this.runList.push({
        fn: () => {
          data.fn.call(data.target, e)
        },
        elem: data.target,
        options: data.options,
        e
      })
    }
    if (instRun instanceof Promise) {
      instRun.then(fn)
    }
    else if (instRun === true || !inst) {
      fn()
    }
    //  运行队列
    this._runCallbacksQueue(e, data)
  }

  /**
   * 核心方法，运行延时队列
   * - 有些事件例如scroll没有冒泡则不需要延时
   * @access private
   * @param e
   * @param data
   * @param {Array} [exceptDelay=['scroll']] 不需要延迟执行
   */
  _runCallbacksQueue (e, data, exceptDelay = ['scroll']) {
    const options = data.options
    //  e.preventDefault()在异步处理时会失效
    if (options.preventDefault) {
      e.preventDefault()
    }
    //  不需要延时
    const noNeedDelay = exceptDelay.indexOf(data.cleanType) > -1
    const delay = (fn) => {
      return noNeedDelay ? fn() : setTimeout(fn, 0)
    }
    this.callbacksQueue.push(() => {
      //  已经触发过则直接跳过
      if (this.hasRunTargets.indexOf(e.target) > -1) return
      let elems = []
      const r = 'fn-' + (Math.random() * 100000 | 0) + '-'
      let parents
      //  window已经是顶级，没有父级
      if (DOM.isWindow(data.selector)) {
        parents = [window]
      }
      //  查找所有父级
      else {
        parents = e.path ? e.path : DOM(e.target).parentsAll().get()
        parents.unshift(e.target)
      }
      //  elems从子级到父级排序
      //  为了保证冒泡的正确顺序
      for (let v of this.runList) {
        v.elem[r] = v.elem[r] || []
        //  回调函数与元素绑定
        v.elem[r].push(v.fn)
        if (elems.indexOf(v.elem) < 0 && parents.indexOf(v.elem) > -1) {
          elems[parents.indexOf(v.elem)] = v.elem
        }
      }
      //  运行回调函数
      for (let v of elems) {
        if (!v || EventObj.isCancelBubble(e)) continue
        const fn = v[r]
        for (let vv of fn) {
          vv()
        }
        v[r] = null
      }
      elems = null
      parents = null
      //  保存已经运行过的触发对象
      this.hasRunTargets.push(e.target)
      if (options.once) {
        this.off(EventObj.getType(e), options.selector)
      }
    })
    if (!this.running) {
      this.running = true
      delay(() => {
        for (let v of this.callbacksQueue) {
          v()
        }
        this.callbacksQueue = []
        this.running = false
        this.runList = []
        this.hasRunTargets = []
      })
    }
  }

  /**
   * 获取正确触发的对象
   * - 不存在options.container的情况下，触发的对象就是触发对象本身
   * - 存在options.container的情况下，触发的对象是与选择器匹配的对象
   * @access private
   * @param {HTMLDocument} current 当前触发的DOM对象
   * @param {Event} e 事件对象
   * @param {string} container 注册事件的载体对象
   * @param {string} selector 选择器
   * @returns {HTMLDocument}
   */
  _getTargetTriggerElem (current, e, container, selector) {
    let target
    if (container) {
      //  判断当前选择器与事件触发的对象是否匹配
      if (DOM.matches(e.target, selector)) {
        target = e.target
      }
      //  判断事件触发对象的父级中是否存在与当前选择器匹配的对象
      else {
        let parents = e.path ? e.path : DOM(e.target).parentsAll().get()
        parents.forEach(function (val) {
          if (DOM.matches(val, selector)) {
            target = val
            return false
          }
        })
        parents = null
      }
    }
    else {
      target = current
    }
    return target
  }
}

export default Listen