
import Vue from 'vue'

let eventBus = new Vue()
// 非父子组件传值bus，绑定接收：this.bus.$on('handleMsg', function (data) {
//   console.log(data)
// })

// 触发、传值 this.bus.$emit('handleMsg', '我是b传给a的值')
Vue.prototype.bus = eventBus

export default eventBus
