import Event from '../observer/event'
import ValidateRule from './validate.rule'

/**
 * 表单验证
 * @author xule
 */
export default class Form {
  /**
   * 初始化
   * @param {string} formid 表单id
   * @param {object} config 配置
   */
  constructor (formid, config) {
    /**
     * 表单文档对象
     * @type {Element}
     */
    this.form = document.getElementById(formid)
    /**
     * 配置
     * @type {object}
     */
    this.config = config
    /**
     * 规则属性的名称
     * @type {string}
     */
    this.ruleName = this.config.ruleName || 'rule'
    /**
     * 检测配置
     * @type {Array}
     */
    this.validateConfig = []
    /**
     * event实例
     * @type {Event}
     */
    this.event = new Event()
    /**
     * 数据校验
     * @type {ValidateData}
     */
    this.validateRule = new ValidateRule(config)
    /**
     * 还在检测中
     * @type {boolean}
     */
    this.formWaiting = false
    //  更新所有的表单项对象
    this.update()
  }

  /**
   * 表单数据提交
   */
  submit () {
    if (this.formWaiting) return
    let result = {}
    for (let v in this.allElems) {
      if (!this.allElems.hasOwnProperty(v)) continue
      result[v] = this.getValByName(v)
    }
    this.validate(this.validateConfig, {
      $form: this.form
    }).then((res) => {
      if (res.status === true) {
        this.event.emitWith(this.form, 'confirm', {
          data: result
        })
      }
      return res
    })
  }

  /**
   * 事件注册
   * - rule-check-before： 单项规则校验开始前
   * - rule-allowed：单项规则通过
   * - rule-denied：单项规则未通过
   * - rule-checked：单项规则校验结束
   * - confirm：所有规则通过后，可提交数据
   * - waiting：规则还在校验中
   * - rule-all-checked：所有规则校验结束
   * - rule-all-allowed：所有规则校验均通过
   * @param {string} type 事件名
   * @param {function} fn 回调
   */
  on (type, fn) {
    this.event.one(type, fn)
  }

  /**
   * 重新更新表单数据，当表单结构有更新后调用
   * ** 对象初始化后，直接在表单页面上变更会失效，需要重新更新 **
   */
  update () {
    /**
     * 表单数据
     * @type {{}}
     */
    this.allElems = this.parseAllInput()
  }

  /**
   * 解析所有表单项数据，以及规则
   * @returns {{}}
   */
  parseAllInput () {
    const elems = [
      this.form.getElementsByTagName('input'),
      this.form.getElementsByTagName('select'),
      this.form.getElementsByTagName('textarea')
    ]
    const result = {}
    for (let v of elems) {
      for (let i = 0; i < v.length; i++) {
        let elem = v[i]
        let attrs = Form.parseInput(elem, [this.ruleName])
        if (!attrs.name || attrs.type === 'button' || attrs.type === 'submit') continue
        //  name去掉[]
        if (attrs.name.indexOf('[') > -1) {
          attrs.name = attrs.name.replace('[]')
          attrs.isMulti = true
        }
        result[attrs.name] = result[attrs.name] || []
        result[attrs.name].push(attrs)
        if (attrs[this.ruleName]) {
          const context = {
            $elem: attrs.elem
          }
          this.validateConfig.push({
            rule: attrs[this.ruleName],
            value: () => attrs.elem.value,
            context
          })
        }
      }
    }
    return result
  }

  /**
   * 数据验证
   * @param {object} data 数据
   * @param {object} context 上下文数据
   * @returns {Promise}
   */
  validate (data, context = {}) {
    return this.validateRule.validate(data, (v) => {
      return this.validateOne(v[this.ruleName], v.value, v.context)
    }, {
      before: () => {
        this.event.emitWith(context.$form, 'waiting')
        this.formWaiting = true
      },
      allowed: () => {
        this.event.emitWith(context.$form, 'rule-all-allowed')
      },
      checked: () => {
        this.event.emitWith(context.$form, 'rule-all-checked')
        this.formWaiting = false
      }
    }, context)
  }

  /**
   * 单项数据验证
   * @param {string} rule 规则名
   * @param {*} value 数据值
   * @param {object} context 上下文数据
   * @returns {Promise}
   */
  validateOne (rule, value, context = {}) {
    return this.validateRule.validateOne(rule, value, {
      before: () => {
        this.event.emitWith(context.$elem, 'rule-check-before')
      },
      allowed: () => {
        this.event.emitWith(context.$elem, 'rule-allowed')
      },
      denied: (res) => {
        let label = {
          ...this.config.label || {},
          ...{
            $name: this.config.label[context.$elem.getAttribute('name')]
          }
        }
        this.event.emitWith(context.$elem, 'rule-denied', {
          error: Form.parseStr(res.error, label)
        })
      },
      checked: () => {
        this.event.emitWith(context.$elem, 'rule-checked')
      }
    }, context)
  }

  /**
   * 表单项验证
   * @param {Element} elem 表单项文档对象
   * @returns {Promise}
   */
  check (elem) {
    return this.validateOne(elem.getAttribute(this.ruleName), elem.value, {
      $elem: elem
    })
  }

  /**
   * 销毁对象
   */
  destroy () {
    this.form = null
    this.config = null
    this.event = null
    this.allElems = null
    this.validateConfig = null
    this.validateRule = null
  }

  /**
   * 通过名称获取表单项数据
   * @param {string} name 表单项name属性值
   * @returns {*}
   */
  getElemsByName (name) {
    return this.allElems[name]
  }

  /**
   * 通过名称获取表单项值
   * @param {string} name 表单项name属性值
   * @returns {*}
   */
  getValByName (name) {
    const elems = this.getElemsByName(name)
    let result
    for (let el of elems) {
      if (el.type === 'radio') {
        if (el.elem.checked) {
          result = el.elem.value
        }
      }
      else if (el.type === 'checkbox') {
        result = result || []
        if (el.elem.checked) {
          result.push(el.elem.value)
        }
      }
      else if (el.type === 'select-multiple') {
        result = result || []
        for (let op of el.elem.options) {
          if (op.selected) {
            result.push(op.value)
          }
        }
      }
      else if (el.isMulti) {
        result.push(el.elem.value)
      }
      else {
        result = el.elem.value
      }
    }
    return result
  }

  /**
   * 解析占位符字符串
   * @param {string} str
   * @param {object} map
   * @returns {*}
   */
  static parseStr (str, map) {
    if (typeof str !== 'string') return str
    return str.replace(/{{(.+?)}}/g, (w, m) => {
      return map[m] || w
    })
  }

  /**
   * 解析表单项各项数据以及属性
   * @param elem
   * @param attrList
   * @returns {{elem: Element, tag: string, name, type, checked: boolean}}
   */
  static parseInput (elem, attrList) {
    const r = {
      elem: elem,
      tag: elem.nodeName,
      name: elem.name,
      type: elem.type,
      checked: elem.checked
    }
    if (attrList) {
      for (let v of attrList) {
        r[v] = elem.getAttribute(v)
      }
    }
    return r
  }
}