<template>
  <div id="main">
    <ul class="item_block">
      <li class="item_item page_color_yellow">
        <span class="content_block WD_w2 MB_w4">
          <input type="text" name="name" class="input_text" id="name" placeholder="输入名称">
        </span>
        <span class="content_block WD_w7 MB_w4">
          <input type="text" name="website" class="input_text" id="website" placeholder="输入网址">
        </span>
        <span class="content_block WD_w1 MB_w2 tc">
          <i class="iconfont icon-xiugai util_add" title="点击添加记录"></i>
        </span>
      </li>
      <template v-for="(lock, index) in locks">
        <li class="item_item page_color_yellow" :data-id="lock.id">
          <span class="content_block" style="width: 0%;padding: 0px;">
            <input type="text" class="for_copy" :value="lock.password">
          </span>
          <span class="content_block WD_w2 MB_w4">{{lock.name}}</span>
          <span class="content_block WD_w6 MB_w2">
            <a class="link" :href="lock.website" target="_blank">
              <span class="MB_hide">{{lock.website}}</span>
              <i class="iconfont icon-tiaozhuan WD_hide" :title="lock.website"></i>
            </a>
          </span>
          <span class="content_block WD_w1 MB_w2 tc">
            <i class="iconfont icon-yaochi util_get" title="点击复制密码"></i>
          </span>
          <span class="content_block WD_w1 MB_w2 tc">
            <i class="iconfont icon-cuowu util_delete" title="点击删除记录"></i>
          </span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data () {
      return {
        locks: []
      }
    },
    computed: {},
    components: {},
    created () {
      console.log('here')
    },
    mounted () {
      this.$http.get('/api/password_lock/').then((response) => {
        if (response.ajax_code !== 0) {
          console.log('not implement')
        } else {
          console.log(response)
          this.locks = response.data
        }
      })
    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .for_copy {
      position: absolute;
      left: -9999px;
  }
</style>
