<template>
  <div class="user-info">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>

    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUpdateNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    ></van-cell>
    <van-cell
      title="生日"
      :value="user.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    ></van-cell>

    <!-- 编辑昵称弹出层 -->
    <van-popup
      title="编辑昵称"
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        v-if="isUpdateNameShow"
        v-model="user.name"
        @close="isUpdateNameShow = false"
      ></update-name>
    </van-popup>

    <!-- 编辑性别弹出框 -->
    <van-popup title="编辑性别" v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        v-if="isUpdateGenderShow"
        v-model="user.gender"
        @close="isUpdateGenderShow = false"
      ></update-gender>
    </van-popup>

    <!-- 编辑生日弹出框 -->
    <van-popup
      title="编辑生日"
      v-model="isUpdateBirthdayShow"
      position="bottom"
    >
      <update-birthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
      ></update-birthday>
    </van-popup>

    <!-- 编辑头像弹出框 -->
    <van-popup
      title="编辑头像"
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      ></update-photo>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/updata-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserInfo',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data () {
    return {
      user: {},
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    }
  },
  created () {
    this.loaderUserProfile()
  },
  methods: {
    async loaderUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (error) {
        this.$toast('获取用户信息失败')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取blob数据
      const data = window.URL.createObjectURL(file)
      // console.log(data);
      this.img = data
      this.isUpdatePhotoShow = true
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang='less' scoped>
.user-info {
  .avatar {
    width: 60px;
    height: 60px;
  }

  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
