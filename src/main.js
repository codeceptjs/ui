import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueSocketIO from 'vue-socket.io';
import Buefy from 'buefy';
import VueHighlightJS from 'vue-highlightjs'

import routes from './routes';

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Buefy)
Vue.use(VueHighlightJS)

const store = require('./store').default;
Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3000',
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
}))
Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  router,
  render: h => h(App),
  store,
}).$mount('#app')
