import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/ui',
  routes: [
    {
      path: '/',
      name: 'uiIndex',
      component: () => import('./views/index'),
      meta: {
        text: 'index view',
        to: '/testa'
      }
    },
    {
      path: '/testa',
      name: 'testa',
      component: () => import('./views/index'),
      meta: {
        text: 'testa view',
        to: '/'
      }
    }
  ]
})
