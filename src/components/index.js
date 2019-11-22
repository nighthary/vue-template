/**
 * 全局组件
 * 部分组件不需要挂在到Vue全局对象中，因此此处需要手动引入需要挂在全局的组件
 */
import Vue from 'vue'
import bottomNav from './bottomNav/index.vue'

const Components = {
  bottomNav
}

// 全局注册组件
Object.keys(Components).forEach(key => {
  Vue.component(key, Components[key])
})

export default Components
