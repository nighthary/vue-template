const webpack = require('webpack')
const path = require('path')
const utils = require('./build/utils.js')
const packageInfo = require('./package.json')

const env = utils.getEnv()
const getConfig = require('./build/config').getConfig
let config

if (env === 'local') {
  config = getConfig(env)
} else if (env === 'dev') {
  config = getConfig(env)
} else {
  config = getConfig(env)
}

function resolve(dir) {
  return path.join(__dirname, dir)
}

function getIsReport() {
  var argv = process.argv.slice(-2)
  // 获取当前环境变量
  return argv.includes('--report')
}

// cdn预加载使用
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  'element-ui': 'ELEMENT',
  'js-cookie': 'Cookies',
  nprogress: 'NProgress'
}

const isCdn = false
const isProduction = process.env.NODE_ENV === 'production'

const cdn = {
  // 开发环境
  dev: {
    css: [
      // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
    ],
    js: []
  },
  // 生产环境
  build: {
    css: [
      // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
    ],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.0.1/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js'
    ]
  }
}

// 基础路径 发布之前要先修改这里
// const baseUrl = process.env.VUE_APP_BASEURL
module.exports = {
  publicPath: config.assetsPublicPath,
  assetsDir: config.assetsSubDirectory,
  outputDir: config.outputDir,
  // publicPath: baseUrl,
  // outputDir: process.env.outputDir,
  productionSourceMap: false,
  // TODO:是否开启待定
  // lintOnSave: process.env.NODE_ENV !== 'production',
  configureWebpack: config => {
    if (isProduction) {
      if(isCdn) {
        config.externals = externals
      }
      // 生产环境删除console.log
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
    }

    // TODO:打包时忽略moment.js中的语言包（如果需要使用moment.js最好启动此配置）
    // config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment/))
    config.plugins.push(new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'windows.jQuery': 'jquery'
    }))

    config.plugins.push(function () {
      // 数据处理 用于生成 webpackMap
      this.plugin('done', function (map) {
        var webpackMap = {}
        // 调用 webpack map toJson 生成 jsonMap
        map = map.toJson()

        const entrypoints = map.entrypoints
        Object.keys(map.entrypoints).forEach(pageName => {
          if(!entrypoints[pageName].chunks.length) return
          const pageInfo = entrypoints[pageName]
          webpackMap[pageName] = {}
          webpackMap[pageName].js = []
          webpackMap[pageName].css = []
          ;[].concat(pageInfo.assets.forEach(mapAsset))
          /**
           * 根据资源类型，将其映射(map)到对应的数组中
           * @param assetsPath  资源路径
           */
          function mapAsset (assetsPath) {
            if (path.extname(assetsPath) === '.js') {
              // 绝对路径 = publicPath +  assetsPath
              webpackMap[pageName].js.push(map.publicPath + assetsPath)
            } else if (path.extname(assetsPath) === '.css') {
              webpackMap[pageName].css.push(map.publicPath + assetsPath)
            }
          }
        })
        const jsonPath = path.resolve(__dirname, `./${packageInfo.buildPath}/ns-resource-map`)
        utils.mkdirsSync(jsonPath)
        require('fs').writeFileSync(path.resolve(jsonPath, 'resource-map.json'),
          JSON.stringify(webpackMap))
      })
    })
  },
  chainWebpack: config => {
    // 路径别名
    config.resolve.alias
      .set('@', resolve('src/'))
      .set('assets', resolve('src/assets'))
      .set('views', resolve('src/views'))
      .set('components', resolve('src/components'))
      .set('utils', resolve('src/utils'))

    // 打包文件大小分析
    if (getIsReport()) {
      // 访问地址：127.0.0.1:8888
      config
        .plugin('analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        .end()
    }

    if(isProduction && isCdn) {
      /**
       * 添加 CDN 参数到 htmlWebpackPlugin 配置中，详见 public/index.html 修改
       */
      config.plugin('html').tap(args => {
        if (process.env.NODE_ENV === 'production') {
          args[0].cdn = cdn.build
        }
        if (process.env.NODE_ENV === 'development') {
          args[0].cdn = cdn.dev
        }
        return args
      })
    }

    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    disableHostCheck: true,
    // host: true,
    port: 8080,
    proxy: {
      // 配置跨域
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        // 这个是加上自己的路径，
        // 注意：试过不能使用别名路径
        path.resolve(__dirname, './src/assets/css/entry.less')
      ]
    }
  },
  pages: {
    index: {
      entry: 'src/pages/index/index.js',
      filename: 'index.html',
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    ui: {
      entry: 'src/pages/ui/index.js',
      filename: 'ui.html',
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      chunks: ['chunk-vendors', 'chunk-common', 'ui']
    }
  }
}
