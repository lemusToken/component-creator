import Storage from '../index'

/**
 * 本地存储localStorage
 */
const local = Storage('WinLocal')
//  名称、值、过期时间
local.set('booleanVal', true)
local.set('stringVal', 'something')
local.set('objVal', {somthing: 1})
local.set('numVal', 231)
local.set('timeoutVal', '5秒后过期', 5000)
console.log('booleanVal', local.get('booleanVal'))
console.log('stringVal', local.get('stringVal'))
console.log('objVal', local.get('objVal'))
console.log('timeoutVal', local.get('timeoutVal'))
console.log('numVal', local.get('numVal'))
console.log('----------')

/**
 * 本地存储sessionStorage
 */
const session = Storage('WinSession')
session.set('booleanVal', true)
session.set('stringVal', 'something')
session.set('objVal', {somthing: 1})
session.set('timeoutVal', '8秒后过期', 8000)
console.log('booleanVal', session.get('booleanVal'))
console.log('stringVal', session.get('stringVal'))
console.log('objVal', session.get('objVal'))
console.log('timeoutVal', session.get('timeoutVal'))
console.log('----------')

/**
 * cookie
 */
const cookie = Storage('WinCookie')
//  名称、值、过期时间、路径、域名
cookie.set('objVal', {somthing: 1})
console.log(cookie.get('objVal'))
console.log('----------')

/**
 * 普通对象，同上，但是无超时控制，值可以是任意类型
 */
const normal = Storage()
normal.set('fnVal', () => {
  return 'fn'
})
console.log(normal.get('fnVal')())