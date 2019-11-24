import router from './router'
import store from './store'
import entryFactory from '@/main'

// 全局变量，使用this.gv.变量名,ex:this.gv.globalAA
// 页面 title
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

entryFactory(store, router)
