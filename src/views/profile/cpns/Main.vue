<template>
  <div id="profile-main" :class="globalStore.isDark ? '' : 'default-bg'">
    <div class="container animate-into-bottom">
      <div class="prompt">
        您可以点击下面头像选择头像预览并上传，也可以直接拖放您喜欢的头像图片到下方头像处
      </div>
      <div class="avatar" @drop.stop.prevent="drop">
        <div class="original">
          <input
            class="file"
            type="file"
            title="点击选择头像上传"
            @change="choose"
          />
          <img
            v-if="userStore.userInfo.avatar"
            :src="userStore.userInfo.avatar"
          />
          <img v-else src="~@/assets/images/avatar.svg" />
        </div>
        <div v-show="chooseAvatarUrl" class="to">
          <div>预览</div>
          <span class="to">====></span>
        </div>
        <img v-show="chooseAvatarUrl" :src="chooseAvatarUrl" />
      </div>
      <ElButton type="success" class="upload" @click="upload">
        上传<span v-show="chooseAvatarName">({{ chooseAvatarName }})</span>
      </ElButton>
      <div class="nickname">
        <ElInput v-model="newNickname" type="text" placeholder="这里输入昵称" />
        <ElButton class="btn" type="success" @click="updateName">
          修改昵称(当前昵称: {{ userStore.userInfo.nickname }})
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import req from '@/request'
import { UPDATENICKNAME, UPDATEAVATAR } from '@/request/apis'
import { useGlobal, useUser } from '@/store'
import { USERINFO } from '@/constants/localStorage'
const chooseAvatarUrl = ref('')
let newAvatarFile: any = null
const chooseAvatarName = ref('')
const globalStore = useGlobal()
const userStore = useUser()
// 点击选择
const choose = (e: any) => {
  const fileObj = e.target.files[0]
  handleFile(fileObj)
}
// 拖放选择
const drop = (e: any) => {
  const fileObj = e.dataTransfer.files[0]
  handleFile(fileObj)
}
// 处理选择或拖放的文件将其实时预览
const handleFile = (file: any) => {
  newAvatarFile = file
  const fileType = file.type
  const reg = /^image\//
  if (!reg.test(fileType)) {
    return ElMessage.warning({ message: '选择了一个非图片类型的文件' })
  }
  chooseAvatarName.value = file.name
  // 选择的是一张图片文件,读取并预览
  const reader = new FileReader()
  reader.onload = e => {
    chooseAvatarUrl.value = e.target ? (e.target.result as string) : ''
  }
  reader.readAsDataURL(file)
}
// 修改昵称
const newNickname = ref('')
const updateName = () => {
  if (!newNickname.value.trim()) {
    return ElMessage.warning({ message: '空值输入' })
  }
  req
    .request({
      ...UPDATENICKNAME(newNickname.value)
    })
    .then(res => {
      const { success, errMsg } = res.data
      if (!success) {
        return ElMessage.warning({ message: errMsg })
      }
      ElMessage.success({ message: '修改成功' })
      const userInfo = userStore.userInfo
      userInfo.nickname = newNickname.value
      const localUserInfo = localStorage.getItem(USERINFO)
      if (localUserInfo) {
        // 修改成功重新保存用户信息
        const token = JSON.parse(localUserInfo).token
        if (!token) {
          userStore.clearUserInfo()
          ElMessage.info({ message: '登录信息失效，请重新登录' })
        }
        userStore.updateUserInfo({ ...userInfo, token })
      }
      newNickname.value = ''
    })
}
// 修改头像
const upload = () => {
  if (!newAvatarFile) {
    return ElMessage.warning({ message: '请先选择头像图片' })
  }
  const formdata = new FormData()
  formdata.append('avatar', newAvatarFile)
  req
    .request({
      ...UPDATEAVATAR,
      data: formdata
    })
    .then(res => {
      const { success, errMsg, url } = res.data
      if (!success) {
        return ElMessage.warning({ message: errMsg })
      }
      ElMessage.success({ message: '头像修改成功' })
      userStore.userInfo.avatar = url
    })
}
</script>

<style scoped lang="less">
#profile-main {
  min-height: calc(100vh - var(--top-info-height));
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    padding: 1rem;
    width: 60%;
    border-radius: 10px;
    box-shadow: 0 0 10px 1px #cccccc80;
    margin: 1rem 0;
    .prompt {
      font-size: 12px;
      text-align: center;
      margin: 1rem auto;
    }
    .avatar {
      width: 60%;
      height: 150px;
      position: relative;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .original {
        width: 150px;
        height: 150px;
        position: relative;
        .file {
          width: inherit;
          height: inherit;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          z-index: 1;
          cursor: pointer;
        }
        img {
          width: inherit;
          height: inherit;
          border-radius: 50%;
        }
      }
      .to {
        font-weight: 600;
        text-align: center;
        color: #90d7ec;
        span {
          font-weight: bold;
        }
      }
      img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
      }
    }
    .upload {
      display: block;
      margin: 1rem auto;
    }
    .nickname {
      width: 60%;
      margin: auto;
      .btn {
        display: block;
        width: 100%;
        margin: 1rem 0;
      }
    }
  }
}
</style>
