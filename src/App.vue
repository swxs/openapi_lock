<template>
  <div id="app">
    <!--所有的页面都将加载到此处,app.vue只提供一个容器-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {}
}
</script>

<style lang="less">
@import './common/style/base.less';
@import './common/style/common.less';
@import './common/fonts/iconfont.less';
</style>
