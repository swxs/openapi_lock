// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.0.185:8090/api/',
        changeOrigin: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
