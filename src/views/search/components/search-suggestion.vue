<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(item, index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search', item)"
    >
      <div slot="title" v-html="highlight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    SearchText: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  watch: {
    SearchText: {
      // 当SearchText发生改变 会调用handler函数
      // handler函数名称固定
      // handler(value) {
      //   this.loaderSearchSuggestions(value);
      // },
      // debounce函数
      // 参数1 一个函数 参数2 延迟事件 单位为毫秒 返回值：防抖之后的函数
      handler: debounce(function (value) {
        this.loaderSearchSuggestions(value)
      }, 200),
      immediate: true // 该回调会在侦听开始之后被立即调用
    }
  },
  methods: {
    async loaderSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    highlight (text) {
      const hightlightStr = `<span class="active">${this.SearchText}</span>`
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      // 参数1：字符串，注意，这里不要加 //
      // 参数2：匹配模式，g 全局，i 忽略大小写
      const reg = new RegExp(this.SearchText, 'gi')
      return text.replace(reg, hightlightStr)
    }
  }
}
</script>

<style lang='less' scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
