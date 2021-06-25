<template>
  <div class="update-name">
    <van-nav-bar
      right-text="完成"
      @click-right="onUpdateName"
      left-text="取消"
      @click-left="$emit('close')"
      title="编辑昵称"
    ></van-nav-bar>

    <div class="field-wrap">
      <!-- 输入框 -->
      <van-field
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      message: this.value
    }
  },
  methods: {
    async onUpdateName () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0
      })
      try {
        const localName = this.message
        if (!localName.length) {
          this.$toast('昵称不能为空')
          return
        }
        await updateUserProfile({ name: localName })
        this.$emit('input', localName)
        this.$emit('close')
        this.$toast.success('更新昵称成功')
      } catch (error) {
        this.$toast('更新用户昵称失败')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.field-wrap {
  padding: 10px;
}
</style>
