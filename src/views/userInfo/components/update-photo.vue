<template>
  <div class="update-photo">
    <img :src="img" ref="img" class="img" alt="" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      require: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      //   autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    async updateUserPhoto (blob) {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '保存中'
      })
      try {
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        // console.log(data);
        this.$emit('close')
        this.$emit('update-photo', data.data.photo)
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast('更新失败')
      }
    },
    onConfirm () {
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.updateUserPhoto(blob)
      })
    }
  }
}
</script>

<style lang='less' scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
  }
  .cancel,
  .confirm {
    width: 90px;
    height: 90px;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }
  .img {
    max-width: 100%;
  }
}
</style>
