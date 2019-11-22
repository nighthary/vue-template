/**
 * 最好使用export default
 * export const 会导致映射不正确(比如 this.$utils.browser.browser才可以访问)
 */
import Vue from 'vue'

const ctx = require.context('.', true, /\.js$/)

let utils = {}
ctx
  .keys()
  .filter(key => key !== './index.js')
  .forEach(path => {
    const module = ctx(path)
    const fileNames = path.split('/')
    const fileName = fileNames[fileNames.length - 1].split('.')[0]
    /**
     * 兼容 import export 和 require module.export 两种规范
     */
    const component = module.default || module
    utils[fileName] = component
  })

Vue.prototype.$utils = utils
