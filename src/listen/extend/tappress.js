import Tap from './tap'

/**
 * 长按压事件
 * @ignore
 */
export default class TapPress extends Tap {
  constructor (Event) {
    super(Event)
    /**
     * 实际触发的事件类型
     * @type {string}
     */
    this.type = 'touchstart.tappress'

    this.timer = null
    this.durationTime = 1000
  }

  init () {
    super.init()
    this.Event.register(document.body, 'touchend', (e) => {
      clearInterval(this.timer)
    })
  }

  /**
   * 运行条件
   * @param e
   * @returns {boolean}
   */
  run (e) {
    if (this.data.isMove && this.timer) return
    return this.waiting(100, this.durationTime)
  }

  waiting (ms = 100, total = 500) {
    clearInterval(this.timer)
    return new Promise((resolve) => {
      let count = 0
      this.timer = setInterval(() => {
        count += ms
        if (count >= total) {
          clearInterval(this.timer)
          resolve()
        }
      }, ms)
    })
  }
}