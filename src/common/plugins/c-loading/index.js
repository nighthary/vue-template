import Vue from 'vue'
import LoadingIndex from './index.vue'
const NoticeConstructor = Vue.extend(LoadingIndex) // 直接将Vue组件作为Vue.extend的参数

let nId = 1
let instances = {}

const Loading = (content) => {
  let id = 'loading-' + nId++

  let instance = new NoticeConstructor({
    data: {
      content: content
    }
  })// 实例化一个带有content内容的Loading

  instance.id = id
  instance.vm = instance.$mount() // 挂载但是并未插入dom，是一个完整的Vue实例
  instance.vm.visible = true
  instance.dom = instance.vm.$el
  document.body.appendChild(instance.dom) // 将dom插入body
  instance.dom.style.zIndex = nId + 1001 // 后插入的Notice组件z-index加一，保证能盖在之前的上面
  instances = {
    ...instances,
    [id]: instance
  }

  return id
}

export default {
  install: Vue => {
    Vue.prototype.$loading = Loading
    Vue.prototype.$closeLoading = (id) => {
      const deleteDom = id => {
        let instance = instances[id]
        if (instance) {
          document.body.removeChild(instance.dom) // 从DOM里将这个组件移除
          instance.vm.$destroy(true)
          instance.vm.visible = false
          delete instances[instance.id]
        }
      }

      if (id !== undefined) {
        deleteDom(id)
      } else {
        Object.keys(instances).forEach(id => {
          deleteDom(id)
        })
      }
    }
  }
}
