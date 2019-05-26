import axios from 'axios'

console.log(process.env.DEV, process.env.BASE_API)

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTg1OTY2MjcsImlhdCI6MTU1ODU4OTQyNywiaXNzIjoiSURZOk1YIiwibmJmIjoxNTU4NTg5NDI3LCJvcmdfY29kZSI6ImlkeSIsIm9yZ19uYW1lIjoiXHU4MmNmXHU1ZGRlXHU0ZjE3XHU4YTAwXHU3ZjUxXHU3ZWRjXHU3OWQxXHU2MjgwXHU4MGExXHU0ZWZkXHU2NzA5XHU5NjUwXHU1MTZjXHU1M2Y4IiwidWlkIjoiNWNlMzZjZTZhNmM0OTBmY2UzMDA4MDc3IiwidW5hbWUiOiJcdThkODVcdTdlYTdcdTdiYTFcdTc0MDZcdTU0NTgiLCJhdmF0YXIiOm51bGwsInN1cGVyIjoxfQ.z6ikNmH8U3TB5XFNLtJxWo0l79_JnA-jctdabd6GsPE'
window.token = token
// create an axios instance
const service = axios.create({
  withCredentials: true, // with cookies
  timeout: 10000, // request timeout
  headers: { Authorization: 'Bearer ' + token }
})

service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    const tem = config.url.indexOf('?') !== -1 ? '&' : '?'

    if (token) {
      config.headers = {
        Authorization: 'Bearer ' + token
      }
    }

    if (config.method === 'get') {
      config.url += tem + 'time_stamp=' + new Date().getTime()
    }

    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  (data) => {
    if (data.data.errcode === 0) {
      return data.data.data
    } else {
      return Promise.reject(data.data.errcode)
    }
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)
export default service
