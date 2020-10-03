'use strict'

import Vue from 'vue'
import axios from 'axios'
import { getToken, setToken, removeToken } from '../utils/auth'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}

const service = axios.create(config)

service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (config.method === 'get') {
      config.params = config.params || {}
      config.params._ = new Date().getTime()
    }

    const token = getToken()
    if (token) {
      config.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      // todo 没有token时暂存请求， 等待响应后调用
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor
service.interceptors.response.use(
  (response) => {
    if (response.config.responseType == 'blob') {
      return Promise.resolve(response)
    } else {
      let data = response.data
      if (data.code === 0) {
        return Promise.resolve(data)
      } else if (data.code === 101) {
        removeToken()
        return Promise.resolve(data)
      } else if (data.code === 113) {
        removeToken()
        return Promise.resolve(data)
      } else {
        return Promise.resolve(data)
      }
    }
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

Plugin.install = function(Vue, options) {
  Vue.axios = service
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return service
      },
    },
    $axios: {
      get() {
        return service
      },
    },
  })
}

Vue.use(Plugin)

export default Plugin
