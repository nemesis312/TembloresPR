import Vue from 'vue';
import App from './App.vue';
import Temblores from './components/Temblores.vue';
import VueRouter from 'vue-router';
import axios from 'axios'
import VueAxios from 'vue-axios'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { ClientTable } from 'vue-tables-2';
import underscore from 'vue-underscore';

Vue.config.productionTip = false
Vue.use(ClientTable);
Vue.use(underscore);
Vue.use(require('vue-moment'));
Vue.use(VueRouter,axios,VueAxios);


const routes = [
  {path: '/temblores', component: Temblores},
  {path: '/', redirect: 'temblores'}

];

const router = new VueRouter({routes});

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
