import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '*',
    name: '404',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404'
    }
  },
  {
    path: '/',
    component: () => import('@/views/index/index.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test.vue'),
    meta: {
      title: '首页'
    }
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [...routes]
})

// 页面 title
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
