<template>
  <div id="main">
    <ul class="item_block">
      <li class="item_item page_color_yellow">
        <span class="content_block WD_w2 MB_w4">
          <input
            type="text"
            name="name"
            class="input_text"
            id="name"
            placeholder="输入名称"
            v-model="name"
          >
        </span>
        <span class="content_block WD_w7 MB_w4">
          <input
            type="text"
            name="website"
            class="input_text"
            id="website"
            placeholder="输入网址"
            v-model="website"
          >
        </span>
        <span class="content_block WD_w1 MB_w2 tc">
          <i class="iconfont icon-xiugai util_add" title="点击添加记录" @click="add_lock"></i>
        </span>
      </li>
      <template v-for="(lock, index) in locks">
        <li class="item_item page_color_yellow" :data-id="lock.id">
          <span class="content_block" style="width: 0px;padding: 0px;">
            <input type="text" class="for_copy" :v-model="lock.password" :id="lock.id">
          </span>
          <span class="content_block WD_w2 MB_w4">{{lock.name}}</span>
          <span class="content_block WD_w6 MB_w2">
            <a class="link" :href="lock.website" target="_blank">
              <span class="MB_hide">{{lock.website}}</span>
              <i class="iconfont icon-tiaozhuan WD_hide" :title="lock.website"></i>
            </a>
          </span>
          <span class="content_block WD_w1 MB_w2 tc">
            <i
              class="iconfont icon-yaochi util_get"
              title="点击复制密码"
              @click="copy(lock.id, lock.password)"
            ></i>
          </span>
          <span class="content_block WD_w1 MB_w2 tc">
            <i class="iconfont icon-cuowu util_delete" title="点击删除记录" @click="delete_lock(lock.id)"></i>
          </span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import {
  searchPasswordLock,
  selectPasswordLock,
  createPasswordLock,
  deletePasswordLock
} from '../api/PasswordLock.js'

export default {
  name: 'home',
  data() {
    return {
      id: 'qwe',
      name: null,
      website: null,
      locks: []
    }
  },
  computed: {},
  components: {},
  created() {},
  async mounted() {
    this.locks = await searchPasswordLock()
  },
  methods: {
    copy(lockId, value) {
      let ele = document.getElementById(lockId)
      ele.value = value
      ele.focus()
      ele.select()
      document.execCommand('Copy')
    },
    async add_lock() {
      if (this.name === '' || this.name === null) {
        return false
      }
      let data = {
        name: this.name,
        key: this.name,
        website: this.website
      }
      const passwordLockId = await createPasswordLock(data)
      const result = await selectPasswordLock(passwordLockId)
      this.locks.splice(0, 0, result)
      this.name = ''
      this.website = ''
    },
    async delete_lock(lockId) {
      const result = await deletePasswordLock(lockId)
      this.locks.splice(this.locks.findIndex((item) => item.id === lockId), 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@media (min-width: 500px) {
  #main {
    padding: 40px 100px;
  }
}
.for_copy {
  position: absolute;
  left: -9999px;
}
</style>
