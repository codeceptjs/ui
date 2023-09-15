import '@/assets/tailwind.css';
import axios from 'axios';
import Buefy from 'buefy';
import Vue from 'vue';
import VueHighlightJS from 'vue-highlightjs';
import VueRouter from 'vue-router';
import VueSocketIO from 'vue-socket.io';
import Vuex from 'vuex';
import App from './App.vue';


import routes from './routes';


Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Buefy);
Vue.use(VueHighlightJS);

const store = require('./store').default;


(async () => {
  const response = await axios.get(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/ports`);
  const data = await response.data;
  Vue.use(new VueSocketIO({
    debug: true,
    connection: `${window.location.protocol}//${window.location.hostname}:${data.wsPort}`,
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    },
  }));
})();
Vue.config.productionTip = false;

const router = new VueRouter({
  mode: 'hash',
  routes
});

new Vue({
  router,
  render: h => h(App),
  store,
}).$mount('#app');
