const globalMethod = {
  install (Vue, options) {
    Vue.prototype.$exMethod = function () {
      console.log('示例：我是全局方法')
    }
  }
}

export default globalMethod
