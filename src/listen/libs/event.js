/**
 * DOM事件
 * @author xule
 */
class Event {
  /**
   * 注册事件
   * @param {HTMLElement} elem DOM对象
   * @param {string} type 事件类型
   * @param {function} fn 回调函数
   * @param {object} options 配置
   */
  static register (elem, type, fn, options = {}) {
    if (elem.addEventListener) {
      elem.addEventListener(type, fn, options)
    }
    else if (elem.attachEvent) {
      elem.attachEvent('on' + type, fn)
    }
  }

  /**
   * 注销事件
   * @param {node} elem DOM对象
   * @param {string} type 事件类型
   * @param {function} fn 回调函数
   */
  static unregister (elem, type, fn) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, fn, false)
    }
    else if (elem.detachEvent) {
      elem.detachEvent('on' + type, fn)
    }
  }

  /**
   * 生成模拟事件
   * @param {string} type 事件类型，DOM中的事件
   * @param {object} config 配置，主要是事件对象中的一些值，例如clientX，clientY等
   * @returns {UIEvent|CustomEvent}
   */
  static createEvent (type, config = {}) {
    let event
    try {
      const mouseList = ['auxclick', 'click', 'dbclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove',
        'mouseout', 'mouseover', 'mouseup']
      const keyList = ['keydown', 'keyup', 'keypress']
      if (mouseList.indexOf(type) > -1) {
        event = Event.createMouseEvent(type, config)
      }
      else if (keyList.indexOf(type) > -1) {
        event = Event.createKeyboardEvent(type, config)
      }
      else {
        event = Event.createCustomEvent(type, config)
      }
      return event
    }
    catch (e) {
      if (document.createEventObject) {
        event = document.createEventObject()
        Object.assign(event, config)
      }
      return event
    }
  }

  /**
   * 生成鼠标模拟事件
   * @param {string} type 事件类型，DOM中的鼠标事件
   * @param {object} [config={screenX:number,screenY:number,clientX:number,clientY:number}]
   * @returns {MouseEvent}
   */
  static createMouseEvent (type, config = {}) {
    let evt
    try {
      evt = new MouseEvent(type, {
        bubbles: true,
        view: document.defaultView,
        cancelable: true,
        screenX: config.screenX || 0,
        screenY: config.screenY || 0,
        clientX: config.clientX || 0,
        clientY: config.clientY || 0
      })
      return evt
    }
    catch (e) {
      evt = document.createEvent('MouseEvent')
      evt.initMouseEvent(type, true, true, document.defaultView, 0, config.screenX, config.screenY, config.clientX, config.clientY, false, false, false, false, 0, null)
      return evt
    }
  }

  /**
   * 生成键盘模拟事件
   * @param {string} type 事件类型，DOM中的鼠标事件
   * @param {object} [config={altKey:boolean,ctrlKey:boolean,shiftKey:boolean,keyCode:string}]
   * @returns {KeyboardEvent}
   */
  static createKeyboardEvent (type, config = {}) {
    let evt
    try {
      evt = new KeyboardEvent(type, {
        bubbles: true,
        view: document.defaultView,
        altKey: config.altKey,
        ctrlKey: config.ctrlKey,
        shiftKey: config.shiftKey
      })
      Object.defineProperty(evt, 'keyCode', {
        get: function () { return config.keyCode }
      })
      Object.defineProperty(evt, 'which', {
        get: function () { return config.keyCode }
      })
      Object.defineProperty(evt, 'charCode', {
        get: function () { return config.keyCode }
      })
      return evt
    }
    catch (e) {
      let modifiers = []
      if (config.altKey) {
        modifiers.push('alt')
      }
      if (config.ctrlKey) {
        modifiers.push('ctrl')
      }
      if (config.shiftKey) {
        modifiers.push('shift')
      }
      evt = document.createEvent('KeyboardEvent')
      evt.initKeyboardEvent(type, true, true, document.defaultView, String.fromCharCode(config.keyCode), 0, modifiers.join(' '))
      return evt
    }
  }

  /**
   * 生成自定义模拟事件
   * @param {string} type 事件类型
   * @param {object} [config={cancelable:boolean,altKey:boolean,ctrlKey:boolean,shiftKey:boolean,screenX:number,screenY:number,clientX:number,clientY:number}]
   * @returns {*}
   */
  static createCustomEvent (type, config = {}) {
    let evt
    try {
      evt = new CustomEvent(type, {
        bubbles: true,
        view: document.defaultView,
        cancelable: config.cancelable || true,
        altKey: config.altKey,
        ctrlKey: config.ctrlKey,
        shiftKey: config.shiftKey,
        screenX: config.screenX || 0,
        screenY: config.screenY || 0,
        clientX: config.clientX || 0,
        clientY: config.clientY || 0
      })
      return evt
    }
    catch (e) {
      evt = document.createEvent('HTMLEvents')
      //  initEvent接受3个参数：
      //  事件类型，是否冒泡，是否阻止浏览器的默认行为
      evt.initEvent(type, true, false)
      return evt
    }
  }
}

export default Event