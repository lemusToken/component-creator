import {Store} from '../index'

//  创建modules
//  实际使用，建议将不同module用不同文件分开
const box = {
  // 初始化状态
  state: {
    open: false
  },
  // 与页面数据进行绑定
  getters: {
    getBoxState (state) {
      return state.open
    }
  },
  // 变更状态
  commits: {
    setOpen (state, payload) {
      console.log('commit setOpen')
      state.open = payload.open
    }
  },
  // 页面发起动作
  actions: {
    open ({commit}) {
      console.log('action open')
      commit('setOpen', {open: true})
    },
    close ({commit}) {
      console.log('action close')
      commit('setOpen', {open: false})
    }
  }
}
const modules = {
  box
}
//  创建store
const store = Store({
  modules
})
//  绑定getters
//  当前业务场景下的getter只需要绑定一次，如果避免不了多次绑定的情况，可以使用bindGetters第三个参数进行标识
let data = {
  boxState: ''
}
const getters = {
  'box/getBoxState': 'boxState'
}
store.bindGetters((name, val) => {
  data[name] = val
}, getters)

//  发起状态变更的动作
store.dispatch('box/open')
console.log(data.boxState)
//  store一次初始化后就是单例
Store().dispatch('box/close')
console.log(data.boxState)