import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const projectName = process.env.PROJECT_NAME
export default new Router({
  mode: 'history',
  base: `/${projectName}/ui`,
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
