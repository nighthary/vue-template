/**
 * 全局指令
 *
 * */

import Vue from 'vue'

// 防止按钮连续点击重复提交，使用button标签添加v-preventDack或者v-preventDack='3000'，数字为自定义时间，默认1500
Vue.directive('preventDack', {
  inserted (el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 1500)
      }
    })
  }
})

// 得到焦点
Vue.directive('focus', {
  inserted (el) {
    el.focus()
  }
})
