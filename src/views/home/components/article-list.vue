<template>
  <div class="article-list">
    <!-- - `load 事件`：
    + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
    + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
  - `loading 属性`：控制加载中的 loading 状态
    + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
    + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件
  - `finished 属性`：控制加载结束的状态
    + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
    + 所有数据加载结束，finished 为 true，此时不会触发 load 事件 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-pull-refresh
        v-model="isreFreshLoading"
        @refresh="onRefresh"
        :success-text="refresshSuccessText"
        :success-duration="1500"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-pull-refresh>
    </van-list>
  </div>
</template>

<script>
import { getAritcles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据
      loading: false, // 控制加载的loading效果
      finished: false, // 控制数据加载结束
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false,
      isreFreshLoading: false,
      refresshSuccessText: '刷新成功'
    }
  },
  methods: {
    async onLoad () {
      //   请求获取数据
      try {
        const { data } = await getAritcles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        // 把请求结果数据放到list中
        const { results } = data.data
        this.list.push(...results)
        // 本次数据加载完成后 将加载状态设置为false
        this.loading = false
        // 判断数据是否加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据 将finished设置为true
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.loading = false
      }
      // 初始化或者滚动到底部时 也会触发调用onLoad
    },

    async onRefresh () {
      try {
        // 请求获取数据
        const { data } = await getAritcles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        })
        const { results } = data.data
        // 将数据追加到列表顶部
        this.list.unshift(...results)
        // 关闭下拉刷新的loading状态
        this.isreFreshLoading = false
        // 更新下拉刷新成功提示文本
        this.refresshSuccessText = `刷新成功，更新了${results.length}条`
      } catch (error) {
        this.isreFreshLoading = false
        this.refresshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style lang='less' scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
