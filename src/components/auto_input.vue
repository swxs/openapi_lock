<template>
  <div class="auto-input">
    <a
      href="javascript: void(0)"
      v-show="isNotEdit"
      :class="['show-name', {'default': isDefault}]"
      @click.stop="startEditName">
      {{currentValue}}
    </a>
    <el-input
      :ref="'q'"
      class="edit-name"
      type="text"
      v-model="currentValue"
      v-if="!isNotEdit"
      :placeholder="currentPlaceholder"
      @blur.stop="editNameBlur"
      @keypress.enter.stop.native="stopEditName">
    </el-input>
  </div>
</template>

<script>
  export default {
    name: 'autoInput',
    props: ['value', 'placeholder'],
    data () {
      return {
        isNotEdit: true,
        currentPlaceholder: this.placeholder
      }
    },
    computed: {
      currentValue: {
        get: function () {
          if (this.value === '' & this.isNotEdit) {
            return this.currentPlaceholder
          } else {
            return this.value
          }
        },
        set: function (value) {
          this.$emit('input', value)
        }
      },
      isDefault: {
        get: function () {
          return this.currentValue === this.currentPlaceholder
        }
      }
    },
    methods: {
      startEditName: function () {
        this.isNotEdit = false
        this.$nextTick(() => {
          this.$refs.q.$refs.input.select()
        })
      },
      editNameBlur: function () {
        this.isNotEdit = true
      },
      stopEditName: function () {
        this.isNotEdit = true
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .auto-input {
    width: 100%;
    height: 40px;
    color: #333333;
    cursor: default;
    text-decoration: none;
    display: inline-block;
  }
  .show-name {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding: 0 15px;

  }
  .default {
    color: #ccc;
  }
</style>
