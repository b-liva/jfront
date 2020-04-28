import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/router';
import { store} from "./store/store";
import { createProvider } from './vue-apollo'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')
