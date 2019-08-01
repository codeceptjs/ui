import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueSocketIO from 'vue-socket.io';
import io from 'socket.io-client';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import routes from './routes';

const socket = io();

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Buefy)
Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3000'
}))
Vue.config.productionTip = false

const router = new VueRouter({
  routes
});

import createStore from './store';

new Vue({
  router,
  render: h => h(App),
  store: createStore(socket),
}).$mount('#app')
