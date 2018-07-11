import Clone from '../index'

const target = {
  a: 1,
  b: {
    a: 2,
    c: 2
  },
  d: [1, 2, 'a'],
  e: {
    f: {
      g: 4
    }
  }
}
const target1 = JSON.parse(JSON.stringify(target))
const target2 = JSON.parse(JSON.stringify(target))
let clone = Clone(target)
//  浅拷贝，直接对结果赋值，如果是引用类型会改变原先的对象
const shallow = clone.clone()
shallow.e.f = 1
console.log(target, shallow)
console.log('------------')
clone = Clone(target1)
//  深拷贝，直接对结果赋值，不会改变原先的对象
const deep = clone.cloneDeep()
deep.e.f.g = 1
console.log(target1, deep)
console.log('------------')
//  逐项合并，深拷贝
clone = Clone(target2)
clone.merge({
  d: [2],
  e: {
    f: {
      g: 10
    }
  }
})
console.log(target2, clone.get())