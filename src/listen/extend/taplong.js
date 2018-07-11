import Tap from './tap'

/**
 * 长点触事件
 */
export default class TapLong extends Tap {
  /**
   * 初始化
   * @param Event
   */
  constructor (Event) {
    super(Event)
    /**
     * 实际触发的事件类型
     * @type {string}
     */
    this.type = 'touchend.taplong'
    /**
     * 点触开始到点触结束需要持续的时间
     * @type {number}
     */
    this.durationTime = 500
  }

  /**
   * 运行条件
   * @param e
   * @returns {boolean}
   */
  run (e) {
    return !this.data.isMove && Date.now() - this.data.startTime >= this.durationTime
  }
}