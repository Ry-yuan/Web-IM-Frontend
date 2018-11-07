// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入muse-Ui
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
Vue.use(MuseUI)
import Loading from 'muse-ui-loading';
import 'muse-ui-loading/dist/muse-ui-loading.css'; // load css
import Toast from "muse-ui-toast";
Vue.use(Toast);
Vue.use(Loading);
// 引入axios
import axios from 'axios';
Vue.prototype.$http = axios;

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
});