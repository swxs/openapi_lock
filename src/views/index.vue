<template>
  <div id="main">
    <ul
      class="infinite-list item_block"
      v-infinite-scroll="load"
      infinite-scroll-distance="20"
      :infinite-scroll-disabled="scroll"
      style="overflow:auto"
    >
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
        <span class="content_block WD_w7 MB_w4 delete_search_block">
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
            v-if="name"
            class="iconfont iconbi"
            title="点击添加记录"
            @click="add_lock"
          ></i>
          <i
            v-else-if="hasSearched"
            class="iconfont iconcuowu"
            title="点击删除搜素记录"
            @click="refresh_search_lock"
          ></i>
          <i
            v-else
            class="iconfont iconsousuo"
            title="点击搜索记录"
            @click="search_lock_name"
          ></i>
        </span>
      </li>
      <li
        class="infinite-list-item item_item page_color_yellow"
        v-for="lock in locks"
        :key="lock.id"
      >
        <span class="content_block WD_w2 MB_w4">{{ lock.name }}</span>
        <span class="content_block WD_w6 MB_w2">
          <a class="link" :href="lock.website" target="_blank">
            <span class="MB_hide">{{ lock.website }}</span>
            <i class="iconfont iconlianjie WD_hide" :title="lock.website"></i>
          </a>
        </span>
        <span class="content_block WD_w1 MB_w2 tc">
          <i
            class="iconfont iconfuzhi"
            title="点击复制密码"
            @click="copy(lock.id, lock.used)"
          ></i>
        </span>
        <span class="content_block WD_w1 MB_w2 tc">
          <i
            class="iconfont iconcuowu"
            title="点击删除记录"
            @click="show_dialog(lock)"
          ></i>
        </span>
      </li>
    </ul>

    <el-dialog title="确认删除？" :visible.sync="dialogVisible" width="100%">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="网址" :label-width="formLabelWidth">
          <el-input v-model="form.website" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="自定义?" :label-width="formLabelWidth">
          <el-switch
            v-model="form.ttype"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="2"
            :inactive-value="1"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input
            v-model="form.custom.password"
            autocomplete="off"
            :disabled="form.ttype === 1"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="update_lock()">更 新</el-button>
        <el-button type="danger" @click="delete_lock()">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchPasswordLock,
  selectPasswordLock,
  createPasswordLock,
  updatePasswordLock,
  deletePasswordLock,
  getPassword,
} from '../api/PasswordLock.js'
import { PASSWORD_LOCK_TTYPE_DICT } from '../enum/PasswordLock.js'
import { getTokenInfo } from '../utils/auth'

export default {
  name: 'home',
  data() {
    return {
      page: 1,
      count: 1,
      name: null,
      website: null,
      searched: null,
      dialogVisible: false,
      changing: null,
      formLabelWidth: '100px',
      loading: false,
      scroll: false,
      locks: [],
      form: {
        name: null,
        website: null,
        ttype: null,
        custom: {},
      },
    }
  },
  computed: {
    hasSearched() {
      return !!this.searched & (this.website == this.searched)
    },
  },
  components: {},
  created() {},
  async mounted() {
    await this.search_lock(this.page)
  },
  methods: {
    async copy(lockId, used) {
      const password = await getPassword(lockId)
      const lockIndex = this.locks.findIndex((item) => item.id === lockId)
      if (lockIndex !== -1) {
        this.locks[lockIndex].used = used + 1
      }
      this.$copyText(password.data.password)
    },
    async search_lock(page) {
      console.log(this.page, this.count)
      this.scroll = true
      let result = await searchPasswordLock({
        use_pager: 1,
        page: page,
        page_number: 20,
        order_by: ['-used', 'created'],
      })
      this.count = result.data.pagination.count
      this.locks = this.locks.concat(result.data.data)
      this.scroll = false
    },
    async refresh_search_lock() {
      this.page = 1
      this.count = 1
      this.website = null
      this.searched = null
      this.locks = []
      this.search_lock(this.page)
    },
    async search_lock_name(){
      if(!this.website) {
        this.refresh_search_lock()
      } else {

        let result = await searchPasswordLock({
          use_pager: 0,
          order_by: ['-used', 'created'],
          search: this.website,
        })
        this.searched = this.website
        this.locks = result.data.data
      }
    },
    async add_lock() {
      let token_info = getTokenInfo()
      if (this.name === '' || this.name === null) {
        return false
      }
      let data = {
        user_id: token_info.user_id,
        name: this.name,
        key: this.name,
        website: this.website,
      }
      const passwordLock = await createPasswordLock(data)
      this.locks.splice(0, 0, passwordLock.data.data)
      this.name = ''
      this.website = ''
    },
    async show_dialog(lock) {
      this.form.name = lock.name
      this.form.website = lock.website
      this.form.ttype = lock.ttype
      if (lock.custom) {
        this.form.custom = lock.custom
      } else {
        this.form.custom = {}
      }
      this.changing = lock
      this.dialogVisible = true
    },
    async update_lock() {
      let lockId = this.changing.id
      const result = await updatePasswordLock(lockId, this.form)
      this.locks.splice(
        this.locks.findIndex((item) => item.id === lockId),
        1,
        result.data.data
      )
      this.dialogVisible = false
      this.form = {
        name: null,
        website: null,
        ttype: null,
        custom: {},
      }
    },
    async delete_lock() {
      let lockId = this.changing.id
      const result = await deletePasswordLock(lockId)
      this.locks.splice(
        this.locks.findIndex((item) => item.id === lockId),
        1
      )
      this.dialogVisible = false
    },
    async load() {
      if (this.page < this.count) {
        this.page += 1
        this.search_lock(this.page)
      }
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

.delete_search_block {
  position: relative;

  .delete_search {
    position: absolute;
    right: 0;
  }

}

.infinite-list::-webkit-scrollbar {
  display: none;
}

.infinite-list {
  /* 兼容 Firefox */
  scrollbar-width: none;
}

.for_copy {
  position: absolute;
  left: -9999px;
}
.el-form-item {
  margin-bottom: 10px;
}
</style>
