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
          />
        </span>
        <span class="content_block WD_w7 MB_w4">
          <input
            type="text"
            name="website"
            class="input_text"
            id="website"
            placeholder="输入网址"
            v-model="website"
          />
        </span>
        <span class="content_block WD_w1 MB_w2 tc">
          <i
            class="iconfont iconbi util_add"
            title="点击添加记录"
            @click="add_lock"
          ></i>
        </span>
      </li>
      <template v-for="(lock, index) in locks">
        <li class="item_item page_color_yellow" :data-id="lock.id">
          <span class="content_block WD_w2 MB_w4">{{ lock.name }}</span>
          <span class="content_block WD_w6 MB_w2">
            <a class="link" :href="lock.website" target="_blank">
              <span class="MB_hide">{{ lock.website }}</span>
              <i class="iconfont iconlianjie WD_hide" :title="lock.website"></i>
            </a>
          </span>
          <span class="content_block WD_w1 MB_w2 tc">
            <i
              class="iconfont iconfuzhi util_get"
              title="点击复制密码"
              @click="copy(lock.id, lock.password, lock.used)"
            ></i>
          </span>
          <span class="content_block WD_w1 MB_w2 tc">
            <i
              class="iconfont iconcuowu util_delete"
              title="点击删除记录"
              @click="delete_lock(lock.id)"
            ></i>
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
  updatePasswordLock,
  deletePasswordLock,
} from '../api/PasswordLock.js'
import { PASSWORD_LOCK_TTYPE_DICT } from '../enum/PasswordLock.js'

export default {
  name: 'home',
  data() {
    return {
      name: null,
      website: null,
      locks: [],
    }
  },
  computed: {},
  components: {},
  created() {},
  async mounted() {
    let result = await searchPasswordLock({ use_pager: 0, orderby: '-used' })
    this.locks = result.data.data
  },
  methods: {
    async copy(lockId, value, used) {
      let data = {
        used: used + 1,
      }
      await updatePasswordLock(lockId, data)
      this.$copyText(value)
    },
    async add_lock() {
      if (this.name === '' || this.name === null) {
        return false
      }
      let data = {
        name: this.name,
        key: this.name,
        website: this.website,
      }
      const passwordLock = await createPasswordLock(data)
      const result = await selectPasswordLock(passwordLock.data.id)
      this.locks.splice(0, 0, result.data.data)
      this.name = ''
      this.website = ''
    },
    async delete_lock(lockId) {
      const h = this.$createElement
      this.$msgbox({
        title: '确认删除？',
        message: h('div', null, []),
        showClose: false,
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '删除',
      })
        .then(async (action) => {
          const result = await deletePasswordLock(lockId)
          this.locks.splice(
            this.locks.findIndex((item) => item.id === lockId),
            1
          )
        })
        .catch(async (action) => {})
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@media (min-width: 500px) {
  #main {
    padding: 40px 100px;
  }
}
.content_block {
  text-align: left;
}
.for_copy {
  position: absolute;
  left: -9999px;
}
</style>
