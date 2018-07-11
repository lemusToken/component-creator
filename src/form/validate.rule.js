/**
 * 数据集合规则校验
 * @author xule
 */
export default class ValidateData {
  /**
   * 初始化配置
   * @param {object} config 验证配置
   */
  constructor (config) {
    /**
     * 规则配置
     * @type {Object}
     */
    this.config = config
  }
  /**
   * 通过规则对数据进行验证
   * @param data
   * @param {Promise} fn 单项数据验证函数
   * @param {object} callbacks 回调函数
   * @param {function} callbacks.before 验证前
   * @param {function} callbacks.allowed 验证通过
   * @param {function} callbacks.deny 验证未通过
   * @param {function} callbacks.checked 验证结束
   * @param {object} context 数据验证函数的上下文
   * @returns {Promise}
   */
  validate (data, fn, callbacks = {}, context = {}) {
    let result = []
    for (let v of data) {
      result.push(fn({
        rule: v.rule,
        value: v.value,
        context: v.context ? {...v.context, ...context} : context
      }))
    }
    typeof callbacks.before === 'function' && callbacks.before()
    return Promise.all(result).then((res) => {
      let flag = true
      for (let v of res) {
        if (v.status === false) {
          flag = v
          break
        }
      }
      if (flag === true) {
        typeof callbacks.allowed === 'function' && callbacks.allowed()
      }
      else {
        typeof callbacks.deny === 'function' && callbacks.deny(flag)
      }
      typeof callbacks.checked === 'function' && callbacks.checked()
      return flag === true ? {
        status: true
      } : flag
    })
  }

  /**
   * 验证单项规则
   * @param {string} rule 规则名
   * @param {*} value 值
   * @param {object} callbacks 回调函数
   * @param {function} callbacks.before 验证前
   * @param {function} callbacks.allowed 验证通过
   * @param {function} callbacks.denied 验证未通过
   * @param {function} callbacks.checked 验证结束
   * @param {object} context 上下文
   * @param {function} context.$val 获取数据值
   * @param {string} context.$rule 当前规则
   * @returns {Promise}
   */
  validateOne (rule, value, callbacks = {}, context = {}) {
    context.$val = typeof value === 'function' ? value : () => value
    context.$rule = context.$rule || rule
    context.$run = (ruleName) => {
      let fn = this.config.rule[ruleName]
      fn = fn.bind({
        ...context
      })
      return this.validateOne(fn, value, callbacks, context)
    }
    let fn = typeof rule === 'function' ? rule : this.config.rule[rule]
    let res = {
      rule
    }
    typeof callbacks.before === 'function' && callbacks.before(rule)
    if (!fn) {
      res.status = true
      typeof callbacks.allowed === 'function' && callbacks.allowed(res)
      typeof callbacks.checked === 'function' && callbacks.checked(res)
      return Promise.resolve(res)
    }
    fn = fn.bind(context)
    return new Promise(fn).then(() => {
      res.status = true
      typeof callbacks.allowed === 'function' && callbacks.allowed(res)
      typeof callbacks.checked === 'function' && callbacks.checked(res)
      return res
    }).catch((info) => {
      res.status = false
      res.error = info
      typeof callbacks.denied === 'function' && callbacks.denied(res)
      typeof callbacks.checked === 'function' && callbacks.checked(res)
      return res
    })
  }
}