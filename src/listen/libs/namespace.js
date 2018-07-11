/**
 * 命名空间类
 */
class Namespace {
  /**
   * 添加命名空间（type+'.'+namespace）
   * @param {string} name 类型名
   * @param {string} space 命名空间名
   * @returns {string}
   */
  static create (name, space) {
    return name + '.' + space
  }

  /**
   * 类型字符串中清空命名空间字段
   * @param {string} name 类型名
   * @returns {*}
   */
  static clean (name) {
    return name ? (name.indexOf('.') > -1 ? name.replace(/\..+/, '') : name) : ''
  }
}

export default Namespace