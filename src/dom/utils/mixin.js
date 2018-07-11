/**
 * 属性拷贝
 * @param target
 * @param source
 */
function copyProperties (target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      //    获取指定对象的自身属性描述符(非从对象的原型继承)
      let desc
      try {
        desc = Object.getOwnPropertyDescriptor(source, key)
      }
      catch (e) {
        console.log(e)
      }
      //    定义属性
      Object.defineProperty(target, key, desc)
    }
  }
}

/**
 * 混合器，将所有类合并为同一类
 * @param mixins
 * @returns {Mix}
 */
export default function (mixins) {
  class Mix {
  }
  //    mixins的所有方法和访问器
  //    添加到Mix
  for (let mixin of Object.keys(mixins)) {
    copyProperties(Mix, mixins[mixin])
    copyProperties(Mix.prototype, mixins[mixin].prototype)
  }
  return Mix
}