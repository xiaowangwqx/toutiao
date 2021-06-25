<template>
  <div class="update-gender">
    <van-picker
      title="标题"
      show-toolbar
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      :default-index="value"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      require: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  methods: {
    onChange (picker, value, index) {
      this.localGender = index
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0
      })
      try {
        const localGender = this.localGender

        await updateUserProfile({ gender: localGender })
        this.$emit('input', localGender)
        this.$emit('close')
        this.$toast.success('更新性别成功')
      } catch (error) {
        this.$toast('更新用户性别失败')
      }
    }
  }
}
</script>

<style>
</style>
