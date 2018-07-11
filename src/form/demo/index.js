import {Form, ValidateRule, Validate} from '../index'

const form = new Form('form', {
  //  input name:中文名称
  label: {
    a: '表单项A',
    b: '表单项B',
    c: '表单项C',
    d: '表单项D'
  },
  ruleName: 'rule',
  rule: {
    empty (allow, deny) {
      if (!this.$val()) {
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
form.on('rule-check-before', function () {
  console.log(this, 'rule-check-before')
})
form.on('rule-allowed', function () {
  console.log(this, 'rule-allowed')
})
form.on('rule-denied', function (res) {
  alert(res.error)
  console.log(this, 'rule-denied', res)
})
form.on('rule-checked', function (res) {
  console.log(this, 'rule-checked', res)
})
form.on('confirm', function (data) {
  alert('ok')
  console.log(this, 'confirm', data)
})
form.on('waiting', function () {
  console.log(this, 'waiting')
})
form.on('rule-all-checked', function () {
  console.log(this, 'rule-all-checked')
})
form.on('rule-all-allowed', function () {
  console.log(this, 'rule-all-allowed')
})
document.getElementById('submit').addEventListener('click', function () {
  form.submit()
})
document.getElementById('in').addEventListener('change', function () {
  form.check(this)
})