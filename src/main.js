import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import Vuelidate from 'vuelidate'

import router from './router'
import store from './store'

Vue.use(Vuelidate)

axios.defaults.baseURL = 'https://vuejs-course-axios.firebaseio.com/'
axios.defaults.headers.common['Hello'] = 'World'
axios.defaults.headers.get['Accepts'] = 'application/json'

axios.interceptors.request.use(config => {
  console.log(config);
  return config;
});

axios.interceptors.response.use(res => {
  console.log(res);
  return res;
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
