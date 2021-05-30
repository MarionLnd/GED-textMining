import Vue from 'vue'
import App from './App.vue';
import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import VueRouter from "vue-router"; 
import VueCookies from 'vue-cookies';

import Routes from "./Routes";
import { library } from '@fortawesome/fontawesome-svg-core'
import {

  faEdit,

  faTrashAlt
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueCookies)

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faTrashAlt)

library.add(faEdit)

const router = new VueRouter({
  routes: Routes,
  mode: 'history'
})

new Vue({
  router: router,
  render: h => h(App), 
}).$mount('#app')

