import Vue from 'vue'
import App from '@/App.vue'

import '@/common'

Vue.config.productionTip = false

export default function (store, router, template) {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store,
    // template: template || '<app/>',
    // components: { App },
    render: render => render(App)
  })
}
