import Tap from './tap'

/**
 * 滑动事件
 */
export default class Pan extends Tap {
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
    this.type = 'touchend.pan'
    /**
     * 滑动的最短距离
     * @type {number}
     */
    this.data.distance = 30
  }

  /**
   * 运行条件
   * @param e
   * @returns {boolean}
   */
  run (e) {
    const r = Math.abs(this.data.moveX) >= this.data.distance || Math.abs(this.data.moveY) >= this.data.distance
    if (r) {
      //  防止点透
      e.preventDefault()
      e.panMoveX = this.data.moveX
      e.panMoveY = this.data.moveY
      //  弧度
      e.panAngle = this.data.moveY / this.data.moveX
      //  相对x轴的角度（极坐标）
      e.panDegree = Math.atan2(e.panMoveY, e.panMoveX) * 180 / Math.PI
      e.panDirection = []
      if (this.data.moveX > 0) {
        e.panDirection.push('right')
      }
      else {
        e.panDirection.push('left')
      }
      if (this.data.moveY > 0) {
        e.panDirection.push('bottom')
      }
      else {
        e.panDirection.push('up')
      }
    }
    return r
  }
}