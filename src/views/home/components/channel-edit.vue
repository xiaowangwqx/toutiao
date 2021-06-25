<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        v-for="(item, index) in myChannels"
        :key="index"
        class="grid-item"
        @click="onMyChannelClick(item, index)"
      >
        <van-icon
          v-show="isEdit && !fixedChannels.includes(item.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">{{
          item.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>

    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item
        v-for="(item, index) in recommendChannels"
        :key="index"
        icon="plus"
        class="grid-item"
        :text="item.name"
        @click="onAddChannel(item)"
      ></van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      require: true
    },
    active: {
      type: Number,
      require: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false,
      fixedChannels: [0] // 固定频道不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    //   计算属性会观测 内部依赖数据的变化
    // 如果依赖数据发生变化 则计算属性会重新执行
    recommendChannels () {
      const channels = []
      this.allChannels.forEach((channel) => {
        const ret = this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
        if (!ret) {
          // 如果我的频道中不包含该频道项
          channels.push(channel)
        }
      })
      return channels
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      // 数据持久化处理
      if (this.user) {
        // 已登录 将数据请求放到线上
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
        } catch (error) {
          this.$toast('请求失败')
        }
      } else {
        // 未登录 把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        if (this.fixedChannels.includes(channel.id)) {
          return
        }
        //   如果是编辑状态 执行删除频道
        // 参数一 要删除元素的索引(包括)
        // 参数二 删除个数 如果不指定 从参数1开始一直删除到最后

        this.myChannels.splice(index, 1)
        if (index <= this.active) {
          // 让激活频道的索引-1
          this.$emit('update-active', this.active - 1, true)
        }
        // 处理持久化删除
        this.deleteChannel(channel)
      } else {
        // 非编辑状态 执行切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          console.log(channel.id)
          //    已登录 将数据从数据库中删除
          await deleteUserChannel(channel.id)
        } else {
          //    未登录 将数据从本地存储删除
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (error) {
        this.$toast('删除失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  .grid-item {
    width: 160px;
    height: 86px;
    /deep/ .van-grid-item__content {
      white-space: nowrap;
      background-color: #f5f5f6;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 28px;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
