import {DOM} from '../index'

//  查
//  查找id，查询选择器与css的选择器相同
console.log(DOM('#a').get())
//  如果是数组，会合并为同一个对象
console.log(DOM(['#a', '.b']).get())
//  find查找首个符合选择器的集
console.log(DOM('#a').find('.b').get())
//  findAll查找所有集
console.log(DOM('#a').findAll('.b').get())
//  选择#a的第一个子元素的每个标签类型的第一个元素
console.log(DOM('#a :first-child').get())
//  查找#a的最近子级（第一级）
console.log(DOM('#a').child().get())
//  查找#a的所有子级
console.log(DOM('#a').children().get())
//  查找#a的同级（包括自身）
console.log(DOM('#a').siblings().get())
//  查找#a的同级（不包括自身）
console.log(DOM('#a').siblings().filter(':nth-child(n+2)').get())
//  查找#a的最近父级
console.log(DOM('#a').parent().get())
//  查找#a的所有父级
console.log(DOM('#a').parentsAll().get())
//  循环#a的所有父级
DOM('#a').parentsAll().each(function (index) {
  console.log(this, index)
})

//  增
//  在查找到的子级最后插入
DOM('#a').find('.b').append('<a>.b最后一项子级后面添加</a>')
//  所有的字符串都可以用DOM对象替代
DOM('#a').find('.b').append(DOM('i'))
//  在查找到的子级最后插入
DOM('#a').find('.b').prepend('<a>.b第一项子级前面添加</a>')
//  在查找到的元素前面插入
DOM('#a').find('.b').before('<a>.b前面添加</a>')
//  在查找到的元素后面插入
DOM('#a').find('.b').after('<a>.b后面添加</a>').after('<a>.b后面添加</a>')
//  将查询到的部分用输入部分包含
DOM('#a').findAll('.b').wrap('<h3></h3>')

//  改
//  将当前查询到的对象替换
DOM('#a').replaceWith('<div>123123</div>')
DOM('#a').replaceWith(DOM('.c'))

//  删
//  清空内容
DOM('.c').empty()
//  删除元素
DOM('.c').remove()