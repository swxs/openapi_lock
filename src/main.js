/* eslint-disable no-new */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router' // 这里引入的是router目录 ， 会默认识别里面的index.js文件
import bus from './common/js/bus'

Vue.prototype.$bus = bus

// eslint-disable-next-line indent
new Vue({
  el: '#app',
  router,
  template: '<App />',
  components: { App }
})
