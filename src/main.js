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
    // Standard configuration - fetch port info with retry logic
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const response = await axios.get('/api/ports', { timeout: 5000 });
        const data = await response.data;
        wsConnection = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:${data.wsPort}`;
        console.log('✅ Successfully fetched WebSocket port info:', data);
        break;
      } catch (err) {
        retryCount++;
        console.warn(`⚠️ Failed to fetch port info (attempt ${retryCount}/${maxRetries}):`, err.message);
        
        if (retryCount >= maxRetries) {
          console.warn('🔄 Using fallback WebSocket connection to same origin');
          // Fallback to same origin if port fetch fails after retries
          wsConnection = baseUrl.replace('http', 'ws');
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
    }
  }

  console.log('🔌 Connecting to WebSocket:', wsConnection);

  Vue.use(new VueSocketIO({
    debug: true,
    connection: wsConnection,
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    },
    options: {
      // Add connection options for better reliability
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: false
    }
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
