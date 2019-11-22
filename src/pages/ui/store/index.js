import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import store from '@/store'

store.registerModule('ui', {
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
})

export default store
