<template>
  <div class="comment-replay">
    <van-nav-bar
      :title="comment.reply_count > 0 ? `${comment.reply_count}` : '暂无回复'"
    >
      <van-icon slot="left" name="cross" @click="$emit('close')"></van-icon>
    </van-nav-bar>

    <div class="scroll-wrap">
      <comment-item :comment="comment"></comment-item>

      <!-- 评论回复列表 -->
      <van-cell title="全部回复"></van-cell>
      <comment-list
        :source="comment.com_id"
        :list="commentList"
        :type="'c'"
      ></comment-list>
    </div>

    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button size="small" class="post-btn" round @click="isPostShow = true"
        >发布评论</van-button
      >
    </div>

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post :target="comment.com_id" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  name: 'CommentReplay',
  inject: ['articleId'],
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  methods: {
    onPostSuccess (data) {
      this.comment.reply_count++
      this.isPostShow = false
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style lang='less' scoped>
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88px;
  background-color: #fff;
  border-top: solid 1px #d8d8d8;
  .post-btn {
    width: 60%;
  }
}

.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
</style>
