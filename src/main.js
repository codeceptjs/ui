import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueSocketIO from 'vue-socket.io';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import routes from './routes';

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

const store = require('./store').default;

new Vue({
  router,
  render: h => h(App),
  store,
}).$mount('#app')
