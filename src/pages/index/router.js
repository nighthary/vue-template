import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const projectName = process.env.PROJECT_NAME
export default new Router({
  mode: 'history',
  base: `/${projectName}`,
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
