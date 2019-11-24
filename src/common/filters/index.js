import Vue from 'vue'

const ctx = require.context('.', true, /\.js$/)

ctx
  .keys()
  .filter(key => key !== './index.js')
  .forEach(path => {
    const module = ctx(path)
    /**
     * 兼容 import export 和 require module.export 两种规范
     */
    const component = module.default || module
    Object.keys(component).forEach(key => {
      Vue.filter(key, component[key])
    })
  })
