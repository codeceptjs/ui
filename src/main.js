import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import VueSocketIO from 'vue-socket.io';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

Vue.use(Vuex)
Vue.use(Buefy)
Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3000'
}))
Vue.config.productionTip = false

const store = require('./store').default;

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
