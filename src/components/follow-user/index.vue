<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    @click="onFollow"
    :loading="loading"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    @click="onFollow"
    :loading="loading"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  model: {
    prop: 'isFollowed',
    event: 'update-is-followed'
  },
  props: {
    isFollowed: {
      type: Boolean, // 默认是value
      require: true // 默认是input
    },
    userId: {
      type: [Number, String, Object],
      require: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onFollow () {
      this.loading = true
      try {
        if (this.isFollowed) {
          // 已关注 取消关注
          await deleteFollow(this.userId)
        } else {
          // 没有关注 添加关注
          await addFollow(this.userId)
        }

        // this.$emit("update-is-followed", !this.value);
        this.$emit('update-is-followed', !this.isFollowed)
      } catch (error) {
        let message = '操作失败，请重试'
        if (error.response && error.response.status === 400) {
          message = '不能关注自己'
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>

<style>
</style>
