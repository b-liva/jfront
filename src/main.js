import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/router';
import { store} from "./store/store";
import {apolloProvider} from "./index";

Vue.config.productionTip = false
new Vue({
  router,
  vuetify,
  store,
  apolloProvider: apolloProvider,
  render: h => h(App)
}).$mount('#app')
