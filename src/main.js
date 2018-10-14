/* eslint-disable no-new */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router' // 这里引入的是router目录 ， 会默认识别里面的index.js文件
import bus from './common/js/bus'
import utils from './common/js/utils'
import data from './common/js/data'

Vue.prototype.$bus = bus
Vue.prototype.$utils = utils
Vue.prototype.$datamode = data

import axios from 'axios'
Vue.prototype.$http = axios

axios.interceptors.response.use(function (response) {
  const data = response.data
  // 未登录跳转到登录页面
  if (data.errcode === 3) {
    console.log('Not imp')
    return data
  }
  if (data.errcode === 1) {
    console.log(data.errmsg)
    return data
    // document.vue.$Message.warning(data.errmsg)
  }
  if (typeof (data) === 'string') {
    return response
  }
  response.errcode = data.errcode
  response.errmsg = data.errmsg || ''
  response.data = data.data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

// 请求拦截
axios.interceptors.request.use(function (config) {
  const tem = (config.url.indexOf('?') !== -1) ? '&' : '?'
  config.headers['access_token'] = 'eyJhbGciOiJIUzI1NiIsImlhdCI6MTUzOTUyNDAwMCwiZXhwIjoxNzY4NDg0MDAwfQ.eyJpZCI6IjViYzM0NDVmZWRlMjRjNzI4MTQyOWE4OCIsImlhdCI6MTUzOTUyNDAwMC4yMjcyOTQ3fQ.XcZCe_Cyl6qxlvkTyDIFc0TuPI2yXvnfn9dh1ObtmoA'
  if (config.method === 'get') {
    config.url += tem + 'time_stamp=' + new Date().getTime()
  }
  return config
}, function (err) {
  return Promise.reject(err)
})

Vue.prototype.httpErrorHandler = function (error, a, b) {
  if (error.response !== undefined) {
    var status = error.response.status
    if (status === 403) {
      document.vue.$Message.warning('服务器开小差啦！')
    } else if (status === 500) {
      document.vue.$Message.warning('服务器开小差啦！')
    } else if (status === 504) {
      document.vue.$Message.warning('服务器端无法连接，请稍候再试！')
    }
  } else {

  }
}

// eslint-disable-next-line indent
new Vue({
  el: '#app',
  router,
  template: '<App />',
  components: {App}
})
