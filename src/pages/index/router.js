import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '',
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('./views/index')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('./views/test')
    }
  ]
})
