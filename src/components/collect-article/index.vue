<template>
  <van-button
    :icon="isCollected ? 'star' : 'star-o'"
    :class="{ collected: isCollected }"
    :loading="loading"
    @click="onCollect"
  ></van-button>
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  model: {
    prop: 'isCollected',
    event: 'update-is-collected'
  },
  data () {
    return {
      loading: false
    }
  },
  props: {
    isCollected: {
      type: Boolean,
      require: true
    },
    articleId: {
      type: [Number, Object, String],
      require: true
    }
  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        if (this.isCollected) {
          // 已收藏 要取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 未收藏 要收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('update-is-collected', !this.isCollected)
        this.$toast.success(!this.isCollected ? '收藏成功' : '取消收藏')
      } catch (error) {
        this.$toast('操作失败，请稍后重试')
      }
      this.loading = false
    }
  }
}
</script>

<style lang='less' scoped>
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
