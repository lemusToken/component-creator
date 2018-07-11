# 校验

1.  数据验证

    ```js
    import {Validate} from './index.js'
    
    //  是否为空，或者是空字符
    Validate.check('empty', str)
    //  有符号整数
    Validate.check('integerExt', str)
    //  正整数
    Validate.check('integer', str)
    //  有符号浮点数
    Validate.check('floatExt', str)
    //  正浮点数
    Validate.check('float', str)
    //  字母
    Validate.check('letter', str)
    //  中文字符
    Validate.check('chinese', str)
    //  手机号
    Validate.check('mobile', str)
    //  邮箱
    Validate.check('email', str)
    //  无特殊符号
    Validate.check('noSpecial', str)
    //  自定义正则
    Validate.check(/\w/, str)
    ```

1.  规则校验

    ```js
    import {ValidateRule, Validate} from './index.js'
    
    const conifg = {
      rule: {
        empty (allow, deny) {
          if (!this.$val()) {
            deny(this.name + '不能为空!')
          }
          else {
            allow()
          }
        },
        num (allow, deny) {
          if (Validate.check('integer', this.$val())) {
            allow()
          }
          else {
            deny(this.name + '只能是数字')
          }
        },
        greater (allow, deny) {
          this.$run('num').then((res) => {
            if (res.status === false) {
              return
            }
            if (this.$val() > 10) {
              allow()
            }
            else {
              deny(this.name + '数字并且需要大于10')
            }
          })
        }
      }
    }
    const validate = new ValidateRule(conifg)
    //  单项数据校验
    validate.validateOne('greater', '100', {
      before: () => {
        console.log('验证开始前')
      },
      allowed: (res) => {
        console.log('验证通过', res)
      },
      denied: (res) => {
        console.log('验证失败', res)
      },
      checked: () => {
        console.log('验证结束')
      }
    }, {
      //  上下文对象，用于定义规则函数中的this
      name: 'a'
    })
    
    //  数据集校验
    const data = [
      {
        rule: 'empty',
        value: '1',
        context: {
          name: 'a'
        }
      },
      {
        rule: 'num',
        value: '132',
        context: {
          name: 'b'
        }
      },
      {
        rule: 'greater',
        value: '100',
        context: {
          name: 'c'
        }
      }
    ]
    
    validate.validate(data, (v) => {
      return validate.validateOne(v.rule, v.value, {
        before: () => {
          console.log('验证开始前')
        },
        allowed: (res) => {
          console.log('验证通过', res)
        },
        denied: (res) => {
          console.log('验证失败', res)
        },
        checked: () => {
          console.log('验证结束')
        }
      }, v.context)
    }, {
      before: () => {
        console.log('规则检测开始')
      },
      allowed: () => {
        console.log('规则检测全部通过')
      },
      deny: (res) => {
        console.log('规则检测错误', res)
      },
      checked: () => {
        console.log('规则检测全部结束')
      }
    })
    ```

1.  表单校验

  ```html
  <div id="form">
      <lable>a</lable>
      <input name="a"  rule="empty" id="in">
      <label>b</label>
      <input name="b"  rule="num">
      <label>c</label>
      <input name="c"  rule="greater">
      <select name="d" rule="empty">
          <option value=""></option>
          <option value="1">a</option>
      </select>
      <a id="submit">提交</a>
  </div>
  ```

  ```js
  //  表单的id
  const form = new Form('form', {
    //  一般为input表单项name：中文表述
    //  此处数据可以在deny的参数中使用
    //  {{a}} 解析后为 表单项A
    label: {
      a: '表单项A',
      b: '表单项B',
      c: '表单项C',
      d: '表单项D'
    },
    //  表单项中设置规则的名称，默认rule
    ruleName: 'rule',
    rule: {
      empty (allow, deny) {
        if (!this.$val()) {
          //  {{$name}}表示当前检测表单项的name所对应的label值
          deny('{{$name}}不能为空!')
        }
        else {
          allow()
        }
      },
      num (allow, deny) {
        if (Validate.check('integer', this.$val())) {
          allow()
        }
        else {
          deny('{{$name}}必须是数字')
        }
      },
      greater (allow, deny) {
        this.$run('num').then((res) => {
          if (res.status === false) {
            deny(res.error)
            return
          }
          if (this.$val() > 10) {
            allow()
          }
          else {
            deny('{{$name}}是数字并且需要大于10')
          }
        })
      }
    }
  })
  //  所有事件只会注册一次，且保留最后一次
  //  单个表单项校验开始
  form.on('rule-check-before', function () {
    console.log(this, 'rule-check-before')
  })
  //  单个表单项校验通过
  form.on('rule-allowed', function () {
    console.log(this, 'rule-allowed')
  })
  //  单个表单项校验失败
  form.on('rule-denied', function (res) {
    console.log(this, 'rule-denied', res)
  })
  //  单个表单项校验结束
  form.on('rule-checked', function () {
    console.log(this, 'rule-checked')
  })
  //  所有表单项校验通过，可以提交数据
  form.on('confirm', function (data) {
    console.log(this, 'confirm', data)
  })
  //  表单项未校验结束的等待状态
  form.on('waiting', function () {
    console.log(this, 'waiting')
  })
  //  所有表单项校验结束
  form.on('rule-all-checked', function () {
    console.log(this, 'rule-all-checked')
  })
  //  所有表单项校验通过
  form.on('rule-all-allowed', function () {
    console.log(this, 'rule-all-allowed')
  })
  //  表单提交
  document.getElementById('submit').addEventListener('click', function () {
    //  触发所有校验
    form.submit()
  })
  //  表单值改变时进行校验
  document.getElementById('in').addEventListener('change', function () {
    form.check(this)
  })
  ```