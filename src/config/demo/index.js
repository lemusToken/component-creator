import Config from '../index'

//  生成配置
const a = Config('a').add({
  name: 'a',
  title: 'a',
  params: {
    a: 1,
    b: 2
  }
}).add({
  params: {
    c: 3
  }
})
console.log(a.get())
console.log('--------')
//  合并配置
const b = Config('b').add(a).add({
  name: 'b',
  title: 'b',
  some: 'abc'
})
console.log(b.get())
console.log('--------')