<template>
  <div id="app">
    <!--所有的页面都将加载到此处-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  created() {
    document.title = "密码管理"
  },
}
</script>

<style lang="less">
@import './assets/fonts/iconfont.css';
@import './assets/style/reset.less';
@import './assets/style/common.less';

.login-block {
  width: 100%;
  min-width: 800px;
  margin: 100px auto 0;
  -ms-flex-direction: column;
  flex-direction: column;

  .login-img {
    width: 340px;
    padding: 0 20px;
    img {
      width: 100%;
    }
  }

  .img-block {
    overflow: hidden;
  }

  .login-iframe {
    overflow: hidden;
    height: 300px;
    width: 340px;
    margin-top: 40px;
    padding: 0 20px;

    .login {
      width: 100%;
      height: 100%;
      border: 0px;
    }
  }
}

@media (min-width: 500px) {
  .login-block {
    -ms-flex-direction: row;
    flex-direction: row;

    .login-iframe {
      margin-top: 0px;
    }
  }
}

</style>
