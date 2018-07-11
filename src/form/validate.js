/**
 * 内置规则
 * - empty: 判断空字符
 * - integerExt: 有符号整数
 * - integer: 正整数
 * - floatExt: 有符号浮点数
 * - float: 正浮点数
 * - letter: 字母
 * - chinese: 中文字符
 * - mobile: 手机号
 * - noSpecial: 无特殊符号
 * @type {{规则名: RegExp}}
 * @author xule
 */
const regular = {
  //  是否为空，空字符
  empty: /^(?:\s*)$/,
  //  有符号整数
  integerExt: /^(?:[+-]?\d+)$/,
  //  正整数
  integer: /^(?:\d+)$/,
  //  有符号浮点数
  floatExt: /^(?:[+-]?[\d.]+)$/,
  // 正浮点
  float: /^(?:[\d.]+)$/,
  //  字母
  letter: /(?:^[a-zA-Z]+)$/,
  //  中文字符
  chinese: /^(?:[\u4e00-\u9fa5]+)$/,
  //  手机号
  mobile: /^(?:1[345789]\d{9})$/,
  //  邮箱，支持二级域名
  email: /^(?:[\w._]+@\w+(?:.\w+){1,2})$/,
  //  无特殊符号
  noSpecial: /^(?:[\w\u4e00-\u9fa5]+)$/
}

export default {
  /**
   * 数据校验
   * @param {string|RegExp} type 规则名
   * @param {*} val
   * @returns {boolean}
   */
  check (type, val) {
    let result
    if (regular[type]) {
      result = regular[type].test(val)
    }
    else if (type instanceof RegExp) {
      result = type.test(val)
    }
    return result
  }
}