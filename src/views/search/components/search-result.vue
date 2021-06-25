<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，请重试"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20,
      error: false
    }
  },
  props: {
    SearchText: {
      type: String,
      require: true
    }
  },
  methods: {
    async onLoad () {
      // 请求获取数据
      const { data } = await getSearchResult({
        page: this.page, // 页码
        per_page: this.per_page, // 每页大小
        q: this.SearchText
      })

      // 将数据添加到数组列表中
      const { results } = data.data
      this.list.push(...results)
      // 将本次加载的loading关闭
      this.loading = false
      // 判断是否还有数据 有则更新获取下一个数据页码 没有加载状态 finished关闭
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
      try {
      } catch (error) {
        this.loading = false
        this.error = true
      }
    }
  }
}
</script>

<style>
</style>
