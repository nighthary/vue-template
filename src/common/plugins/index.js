/**
 * 动态注入plugins
 * 规范：模块名字必须为文件夹名，然后每个模块入口必须定义为index.js(根目录下其他js不做自动注入处理，请全部创建文件夹写入js)
 * [moduleName]/index.js
 * test/index.js
 */
import Vue from 'vue'

const ctx = require.context('.', true, /index\.js$/)

ctx
  .keys()
  .filter(key => key !== './index.js' && key.indexOf('index.js') !== -1)
  .forEach(path => {
    const module = ctx(path)
    const component = module.default || module
    Vue.use(component)
  })
