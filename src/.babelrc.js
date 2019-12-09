/**
 * babel7 配置文件说明
 * 区分全局配置和局部配置
 * 全局配置：babel.config.js
 * 局部配置：具体目录下的.babelrc或者.babelrc.js
 * 
 * 本文件只对src目录下的内容生效
 */
module.exports = {
  presets: [
    [
      '@vue/app',
      {
        debug: true,
        polyfills: [
          'es6.promise',
          'es6.array.find-index',
          'es7.array.includes',
          'es6.string.includes'
        ]
      }
    ]
  ]
}
