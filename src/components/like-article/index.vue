<template>
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{ liked: value === 1 }"
    :loading="loading"
    @click="onLike"
  ></van-button>
</template>

<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      require: true
    },
    articleId: {
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
    async onLike () {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 喜欢 取消喜欢
          await deleteLike(this.articleId)
        } else {
          // 不喜欢 添加喜欢
          await addLike(this.articleId)
          status = 1
        }
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (error) {
        this.$toast.fail('操作失败，请稍后重试')
      }
      this.loading = false
    }
  }
}
</script>

<style lang='less' scoped>
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
