//  所有的事件扩展
import * as EventTypeExtend from '../extend'
//  命名空间字符串处理
import Namespace from './namespace'

/**
 * 扩展
 * @author xule
 */
export default class Extend {
  /**
   * 初始化
   */
  constructor () {
    /**
     * 扩展类的实例队列
     * @type {{}}
     */
    this.extendLists = {}
  }

  /**
   * 生成扩展类（单例）
   * @param {string} type 事件类型
   * @param {*} params 其余依赖
   * @param {Event} params.Event libs中的Event类
   * @returns {{extend: object, realType: string, cleanType: string, fullType: string}}
   */
  create (type, {Event}) {
    let cleanType = Namespace.clean(type)
    if (!this.extendLists[cleanType]) {
      const E = Extend.getType(cleanType)
      if (E) {
        this.extendLists[cleanType] = new E(Event)
        this.extendLists[cleanType].init()
      }
    }
    //  实际触发的事件类型（type是扩展事件时需要替换为真实触发事件类型）
    let realType = this.extendLists[cleanType] ? Namespace.clean(this.extendLists[cleanType].type) : cleanType
    return {
      //  扩展事件对象
      extend: this.extendLists[cleanType],
      //  真实触发的对象
      realType,
      //  去掉命名空间后的类型
      cleanType,
      //  完整的类型
      fullType: type
    }
  }

  /**
   * 取得扩展事件类
   * @param type
   */
  static getType (type) {
    return EventTypeExtend[Namespace.clean(type).toLowerCase()]
  }
}