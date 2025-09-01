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
  let wsConnection;
  
  // Support reverse proxy configurations by checking for base URL
  const baseUrl = window.location.origin;
  const isReverseProxy = window.location.pathname !== '/';
  
  if (isReverseProxy) {
    // Use relative paths for reverse proxy setups
    wsConnection = baseUrl.replace('http', 'ws');
  } else {
    // Standard configuration - fetch port info
    try {
      const response = await axios.get('/api/ports');
      const data = await response.data;
      wsConnection = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:${data.wsPort}`;
    } catch (err) {
      // Fallback to same origin if port fetch fails
      wsConnection = baseUrl.replace('http', 'ws');
    }
  }

  Vue.use(new VueSocketIO({
    debug: true,
    connection: wsConnection,
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
