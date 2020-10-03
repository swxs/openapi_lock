<template>
  <div id="app">
    <el-container v-show="!login" class="login-block">
      <el-aside class="login-img img-block">
        <img src="./static/login.png" />
      </el-aside>
      <el-main class="login-iframe">
        <iframe
          :src="src"
          ref="iframe"
          class="login"
          frameborder="0"
          scrolling="no"
        ></iframe>
      </el-main>
    </el-container>
    <router-view v-if="login"></router-view>
    <!--所有的页面都将加载到此处,app.vue只提供一个容器-->
  </div>
</template>

<script>
import { getToken, setToken } from './utils/auth'

export default {
  name: 'App',
  components: {},
  data() {
    return {
      img_src: '',
      src: 'http://localhost:8081/home#/',
      login: false,
      iframeWin: {},
    }
  },
  computed: {},
  watch: {},
  methods: {
    getLogin() {
      let token = getToken()
      return Boolean(token)
    },
    sendMessage() {
      // 外部vue向iframe内部传数据
      this.iframeWin.postMessage(
        {
          cmd: 'getToken',
          params: {},
        },
        '*'
      )
    },
    async handleMessage(event) {
      // 根据上面制定的结构来解析iframe内部发回来的数据
      const data = event.data
      console.log(`parent get [${data.cmd}]: ${data.params}`, data)
      switch (data.cmd) {
        case 'returnToken':
          // 业务逻辑
          setToken(data.params.token)
          this.login = this.getLogin()
      }
    },
  },
  created() {},
  mounted() {
    // 在外部vue的window上添加postMessage的监听，并且绑定处理函数handleMessage
    window.addEventListener('message', this.handleMessage)
    this.iframeWin = this.$refs.iframe.contentWindow
    this.login = this.getLogin()
  },
}
</script>

<style lang="less">
@import './assets/style/base.less';
@import './assets/style/common.less';
@import './assets/fonts/iconfont.less';

.login-block {
  width: 20%;
  min-width: 800px;
  margin:100px auto 0;

  .login-img {
    width: 40%;
    img {
      width: 100%;
    }
  }
  .login-iframe {
    overflow: hidden;
    .login {
      width: 100%;
      height: 100%;
      border: 0px;
    }
  }
}

.img-block {
  overflow: hidden;
}
</style>
