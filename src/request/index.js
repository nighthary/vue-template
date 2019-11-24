import Vue from 'vue'
import axios from 'axios'

// axios配置
const service = axios.create({
  baseURL: process.env.VUE_APP_API, // axios 基础地址
  withCredentials: true
})

// request 拦截器-------------------------------------------------------------
service.interceptors.request.use(
  config => {
    // ajax请求添加loading
    if (typeof config.loading === 'string') {
      config.loadingIndex = Vue.prototype.$loading(config.loading)
    } else if (config.loading !== false) {
      config.loadingIndex = Vue.prototype.$loading()
    }

    let token = JSON.parse(sessionStorage.getItem('token'))
    if (token) {
      // 这里写所有请求之前都要执行的操作
      config.headers.token = token || ''
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// response 拦截器------------------------------------------------------------
service.interceptors.response.use(
  response => {
    Vue.prototype.$closeLoading(response.config.loadingIndex)
    if(response.status === 200) {
      // 这里写所有请求完成后都要执行的操作
      if (+response.data.code === 40000) {
        Vue.prototype.$toast('登录过期请重新登录', { delay: 100000000 })
        return Promise.reject(response)
      }
      return response.data
    } else {

    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          error.message = '未授权，请登录'
          break
        case 403:
          error.message = '拒绝访问'
          break
        case 404:
          error.message = `请求地址出错:地址${error.config.url}`
          break
        case 405:
          error.message = `不允许的请求方法`
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
        default:
          break
      }
    }
    Vue.prototype.$closeLoading(error.config.loadingIndex)
    Vue.prototype.$toast(`服务器响应失败,错误信息: ${error.message}`)
    return Promise.reject(error)
  }
)

// 挂载到vue全局对象(this.$axios)
Vue.prototype.$axios = service
// ---------------------------------------------------------------------------
export default service
