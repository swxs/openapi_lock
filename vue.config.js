// vue.config.js
module.exports = {
  devServer: {
    port: 8082, // 指定启动端口为 8082
    proxy: {
      '/api': {
        target: 'http://localhost:8090/api/',
        changeOrigin: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
